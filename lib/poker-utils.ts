import { POKER_RANGES, POS_ORDER, RANKS, SUITS } from './poker-data';

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
