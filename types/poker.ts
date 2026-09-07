export interface Card {
    rank: string;
    suit: string;
}

export type Street = 'FLOP' | 'TURN' | 'RIVER';

export type PostflopAction = 'fold' | 'check' | 'call' | 'bet' | 'raise';

export interface BetSizeOption {
    label: string;
    toBB: number;
}

export interface PostflopScenario {
    heroPos: string;
    villainPositions: string[];
    heroCards: Card[];
    board: Card[];
    street: Street;
    potBB: number;
    effectiveStackBB: number;
    actionHistory: string[];
    facingBet: boolean;
    betToCallBB: number;
    legalActions: PostflopAction[];
    betSizeOptions: BetSizeOption[];
}

export interface PostflopVerdict {
    verdict: 'GOOD' | 'OK' | 'MISTAKE' | null;
    bestAction: string | null;
    explanation: string;
}
