import { POKER_RANGES, POS_ORDER, RANKS, SUITS } from './poker-data';
import type { Card, PostflopAction, PostflopScenario, PostflopVerdict, Street } from '@/types/poker';

export const getHandAction = (hand: string, pos: string, sit: string) => {
    try {
        if (sit === 'RFI') {
            if (pos === 'BB') return 'walk';
            return POKER_RANGES.RFI[pos]?.includes(hand) ? 'raise' : 'fold';
        }
        if (sit === 'FACING') {
            const d = POKER_RANGES.FACING_RAISE[pos];
            if (d?.RAISE.includes(hand)) return '3bet';
            if (d?.CALL.includes(hand)) return 'call';
            return 'fold';
        }
        const d = POKER_RANGES.FACING_LIMPERS[pos];
        if (d?.RAISE.includes(hand)) return 'raise';
        if (d?.CALL.includes(hand)) return 'call';
        return 'fold';
    } catch (err) { return 'fold'; }
};

export const getCardsFromHandString = (hand: string) => {
    if (!hand) return [];
    let r1, r2, type;
    if (hand === '1010') { r1 = '10'; r2 = '10'; type = 'pair'; }
    else if (hand.length === 2) { r1 = hand[0]; r2 = hand[1]; type = 'pair'; }
    else if (hand.includes('10')) {
        if (hand.startsWith('10')) { r1 = '10'; r2 = hand.replace('10', '')[0]; }
        else { r1 = hand[0]; r2 = '10'; }
        type = hand.endsWith('s') ? 's' : 'o';
    } else { r1 = hand[0]; r2 = hand[1]; type = hand[2]; }
    return [{ rank: r1, suit: '♠' }, { rank: r2, suit: type === 's' ? '♠' : '♥' }];
};

const DECK_RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const buildDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const rank of DECK_RANKS) {
        for (const suit of SUITS) deck.push({ rank, suit });
    }
    return deck;
};

const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const randomOf = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const formatBB = (n: number): string => (Number.isInteger(n) ? `${n}` : n.toFixed(1)) + 'bb';

interface PreflopLine {
    key: string;
    potBB: number;
    playersInHand: number;
    buildLog: (positions: string[]) => string[];
}

const PREFLOP_LINES: PreflopLine[] = [
    {
        key: 'RFI_HU',
        potBB: 6,
        playersInHand: 2,
        buildLog: ([raiser, caller]) => [`${raiser} raises to 2.5bb`, `${caller} calls`],
    },
    {
        key: 'RFI_MULTI',
        potBB: 9.5,
        playersInHand: 3,
        buildLog: ([raiser, c1, c2]) => [`${raiser} raises to 2.5bb`, `${c1} calls`, `${c2} calls`],
    },
    {
        key: '3BET_HU',
        potBB: 17,
        playersInHand: 2,
        buildLog: ([raiser, threeBettor]) => [`${raiser} raises to 2.5bb`, `${threeBettor} 3-bets to 8bb`, `${raiser} calls`],
    },
    {
        key: 'LIMP_ISO',
        potBB: 8.5,
        playersInHand: 2,
        buildLog: ([limper, iso]) => [`${limper} limps`, `${iso} isolates to 4bb`, `${limper} calls`],
    },
];

const STREET_ORDER: Street[] = ['FLOP', 'TURN', 'RIVER'];

const dealBoard = (deck: Card[], count: number): Card[] => deck.splice(0, count);

const BET_FRACTIONS = [0.33, 0.5, 0.66, 1];

export const generatePostflopScenario = (): PostflopScenario => {
    const startStack = randomOf([40, 60, 100, 150]);

    const line = randomOf(PREFLOP_LINES);
    // The first position in the line acts first preflop (raiser/limper); every other
    // position in the line must sit later in the actual UTG->BB turn order so the
    // generated action sequence (raise, then calls/3-bet) is physically possible.
    const openerIdx = Math.floor(Math.random() * (POS_ORDER.length - line.playersInHand + 1));
    const laterIndices = shuffle(
        Array.from({ length: POS_ORDER.length - openerIdx - 1 }, (_, i) => openerIdx + 1 + i)
    ).slice(0, line.playersInHand - 1).sort((a, b) => a - b);
    const positions = [POS_ORDER[openerIdx], ...laterIndices.map(i => POS_ORDER[i])];
    const heroIdx = Math.floor(Math.random() * positions.length);
    const heroPos = positions[heroIdx];
    const villainPositions = positions.filter((_, i) => i !== heroIdx);

    const actionHistory = line.buildLog(positions);
    let potBB = line.potBB;
    // Rough estimate of what each player has already committed preflop.
    const committedPerPlayer = potBB / positions.length;
    let effectiveStackBB = Math.max(startStack - committedPerPlayer, startStack * 0.5);

    const targetStreetIdx = Math.floor(Math.random() * STREET_ORDER.length);
    const deck = shuffle(buildDeck());

    // Remove hero's hole cards from the deck first.
    const heroCards = deck.splice(0, 2);
    const board = dealBoard(deck, 5);

    const streetBoardCounts = { FLOP: 3, TURN: 4, RIVER: 5 };
    const streetLabels: Record<Street, string> = { FLOP: 'Flop', TURN: 'Turn', RIVER: 'River' };

    // Simulate any streets before the current (target) one as either
    // checked-through or a small bet that gets called, so the hand is
    // still live by the time hero has to make the featured decision.
    for (let i = 0; i < targetStreetIdx; i++) {
        const street = STREET_ORDER[i];
        const cards = board.slice(0, streetBoardCounts[street]).map(c => `${c.rank}${c.suit}`).join(' ');
        const villainRep = randomOf(villainPositions);
        if (Math.random() < 0.5) {
            actionHistory.push(`${streetLabels[street]} (${cards}): checks through`);
        } else {
            const frac = randomOf(BET_FRACTIONS);
            const betAmt = Math.round(potBB * frac * 10) / 10;
            potBB += betAmt * 2;
            effectiveStackBB = Math.max(effectiveStackBB - betAmt, 2);
            actionHistory.push(`${streetLabels[street]} (${cards}): ${villainRep} bets ${formatBB(betAmt)}, called`);
        }
    }

    const street = STREET_ORDER[targetStreetIdx];
    const currentBoard = board.slice(0, streetBoardCounts[street]);
    const currentCardsLabel = currentBoard.slice(-(streetBoardCounts[street] - (targetStreetIdx > 0 ? streetBoardCounts[STREET_ORDER[targetStreetIdx - 1]] : 0)))
        .map(c => `${c.rank}${c.suit}`).join(' ');

    const heroActsFirst = villainPositions.length === 0 || Math.random() < 0.35;
    const villainRep = randomOf(villainPositions);

    // Bet/raise sizes can never exceed what's actually behind — clamp to the
    // effective stack and drop any duplicate sizes that clamping produces.
    const capSizeOptions = (raw: { label: string; toBB: number }[], stackCap: number) => {
        const seen = new Set<number>();
        const result: { label: string; toBB: number }[] = [];
        for (const o of raw) {
            const toBB = Math.round(Math.min(o.toBB, stackCap) * 10) / 10;
            if (seen.has(toBB)) continue;
            seen.add(toBB);
            result.push({ label: toBB >= stackCap ? 'All-in' : o.label, toBB });
        }
        return result;
    };

    let facingBet = false;
    let betToCallBB = 0;
    let legalActions: PostflopAction[];
    let betSizeOptions: { label: string; toBB: number }[] = [];

    if (!heroActsFirst) {
        const frac = randomOf(BET_FRACTIONS);
        betToCallBB = Math.round(Math.min(potBB * frac, effectiveStackBB) * 10) / 10;
        facingBet = true;
        legalActions = betToCallBB >= effectiveStackBB ? ['fold', 'call'] : ['fold', 'call', 'raise'];
        actionHistory.push(`${streetLabels[street]} (${currentCardsLabel}): ${villainRep} bets ${formatBB(betToCallBB)} (${Math.round(frac * 100)}% pot) — action on you`);
        betSizeOptions = capSizeOptions([
            { label: 'Raise to 2.5x', toBB: betToCallBB * 2.5 },
            { label: 'Raise to 3.5x', toBB: betToCallBB * 3.5 },
            { label: 'All-in', toBB: effectiveStackBB },
        ], effectiveStackBB);
    } else {
        facingBet = false;
        legalActions = ['check', 'bet'];
        actionHistory.push(`${streetLabels[street]} (${currentCardsLabel}): checks to you`);
        betSizeOptions = capSizeOptions([
            ...BET_FRACTIONS.map(f => ({ label: `Bet ${Math.round(f * 100)}% pot`, toBB: potBB * f })),
            { label: 'All-in', toBB: effectiveStackBB },
        ], effectiveStackBB);
    }

    return {
        heroPos,
        villainPositions,
        heroCards,
        board: currentBoard,
        street,
        potBB: Math.round(potBB * 10) / 10,
        effectiveStackBB: Math.round(effectiveStackBB * 10) / 10,
        actionHistory,
        facingBet,
        betToCallBB,
        legalActions,
        betSizeOptions,
    };
};

export const parsePostflopVerdict = (raw: string): PostflopVerdict => {
    const verdictMatch = raw.match(/VERDICT:\s*(GOOD|OK|MISTAKE)/i);
    const bestActionMatch = raw.match(/BEST_ACTION:\s*(.+)/i);
    const separatorIdx = raw.indexOf('---');

    const verdict = verdictMatch ? (verdictMatch[1].toUpperCase() as PostflopVerdict['verdict']) : null;
    const bestAction = bestActionMatch ? bestActionMatch[1].trim() : null;
    const explanation = separatorIdx >= 0 ? raw.slice(separatorIdx + 3).trim() : raw.trim();

    return { verdict, bestAction, explanation };
};

export const generateHandMatrix = (position: string, situation: string) => {
    const rows = [];
    for (let i = 0; i < RANKS.length; i++) {
        const row = [];
        for (let j = 0; j < RANKS.length; j++) {
            let hand;
            const r1 = RANKS[i], r2 = RANKS[j];
            if (i === j) hand = r1 + r2;
            else if (i < j) hand = r1 + r2 + 's';
            else hand = r2 + r1 + 'o';
            row.push({ hand, action: getHandAction(hand, position, situation) });
        }
        rows.push(row);
    }
    return rows;
};
