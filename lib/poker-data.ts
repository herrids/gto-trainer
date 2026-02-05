export const POS_ORDER = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

export const POSITION_NAMES: Record<string, string> = {
    UTG: 'Under the Gun',
    HJ: 'HiJack',
    CO: 'Cutoff',
    BTN: 'Button',
    SB: 'Small Blind',
    BB: 'Big Blind'
};

export const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
export const SUITS = ['♠', '♥', '♦', '♣'];

export const TABLE_SLOTS = [
    { top: '85%', left: '50%' },
    { top: '70%', left: '15%' },
    { top: '30%', left: '15%' },
    { top: '15%', left: '50%' },
    { top: '30%', left: '85%' },
    { top: '70%', left: '85%' },
];

export const POKER_RANGES: any = {
    RFI: {
        UTG: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'A7s', 'A5s', 'A4s', 'A3s', 'KQs', 'KJs', 'K10s', 'K9s', 'QJs', 'Q10s', 'J10s', '109s', '98s', 'AKo', 'AQo', 'AJo', 'KQo'],
        HJ: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', '55', '44', 'AKs', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'K10s', 'K9s', 'QJs', 'Q10s', 'Q9s', 'J10s', 'J9s', '109s', '98s', 'AKo', 'AQo', 'AJo', 'A10o', 'KQo', 'KJo'],
        CO: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'K10s', 'K9s', 'K8s', 'K7s', 'QJs', 'Q10s', 'Q9s', 'Q8s', 'J10s', 'J9s', '109s', '108s', '98s', '87s', '76s', 'AKo', 'AQo', 'AJo', 'A10o', 'A9o', 'KQo', 'KJo', 'K10o', 'QJo', 'Q10o'],
        BTN: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'K10s', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'QJs', 'Q10s', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'J10s', 'J9s', 'J8s', 'J7s', '109s', '108s', '107s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '54s', 'AKo', 'AQo', 'AJo', 'A10o', 'A9o', 'A8o', 'A7o', 'A5o', 'KQo', 'KJo', 'K10o', 'K9o', 'QJo', 'Q10o', 'Q9o', 'J10o', 'J9o', '109o'],
        SB: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'K10s', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'QJs', 'Q10s', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'J10s', 'J9s', 'J8s', 'J7s', '109s', '108s', '107s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '54s', 'AKo', 'AQo', 'AJo', 'A10o', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'KQo', 'KJo', 'K10o', 'K9o', 'QJo', 'Q10o', 'Q9o', 'J10o', '109o'],
        BB: []
    },
    FACING_RAISE: {
        UTG: { CALL: ['QQ', 'JJ', '1010', '99', '88', '77', 'AQs', 'AJs', 'KQs'], RAISE: ['AA', 'KK', 'AKs', 'AKo'] },
        HJ: { CALL: ['JJ', '1010', '99', '88', '77', 'AQs', 'AJs', 'KQs', 'KJs'], RAISE: ['AA', 'KK', 'QQ', 'AKs', 'AKo'] },
        CO: { CALL: ['1010', '99', '88', '77', '66', 'AQs', 'AJs', 'A10s', 'KQs', 'KJs', 'QJs', 'J10s'], RAISE: ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'A5s', 'AKo'] },
        BTN: { CALL: ['99', '88', '77', '66', '55', 'AJs', 'A10s', 'A9s', 'KQs', 'KJs', 'K10s', 'QJs', 'Q10s', 'J10s', '109s'], RAISE: ['AA', 'KK', 'QQ', 'JJ', '1010', 'AKs', 'AQs', 'A5s', 'A4s', 'A3s', 'AKo', 'AQo'] },
        SB: { CALL: [], RAISE: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', 'AKs', 'AQs', 'AJs', 'KQs', 'AKo', 'AQo'] },
        BB: { CALL: ['JJ', '1010', '99', '88', '77', '66', '55', '44', '33', '22', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'K10s', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'QJs', 'Q10s', 'Q9s', 'Q8s', 'Q7s', 'J10s', 'J9s', 'J8s', '109s', '108s', '98s', '97s', '87s', '76s', '65s', 'AQo', 'AJo', 'A10o', 'A9o', 'A8o', 'KQo', 'KJo', 'K10o', 'QJo', 'Q10o', 'J10o'], RAISE: ['AA', 'KK', 'QQ', 'AKs', 'A5s', 'A4s', 'A3s', 'AKo'] }
    },
    FACING_LIMPERS: {
        UTG: { RAISE: [], CALL: [] },
        HJ: { RAISE: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'A10s', 'KQs', 'KJs', 'AKo', 'AQo', 'AJo', 'KQo'], CALL: [] },
        CO: { RAISE: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', 'AKs', 'AQs', 'AJs', 'A10s', 'KQs', 'KJs', 'QJs', 'AKo', 'AQo', 'AJo', 'KQo'], CALL: [] },
        BTN: { RAISE: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'KQs', 'KJs', 'K10s', 'QJs', 'Q10s', 'J10s', 'AKo', 'AQo', 'AJo', 'A10o', 'KQo', 'KJo'], CALL: [] },
        SB: {
            RAISE: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'KQs', 'AKo', 'AQo', 'AJo'],
            CALL: ['66', '55', '44', '33', '22', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'KJs', 'K10s', 'QJs', 'J10s', '109s', '98s', '87s', '76s']
        },
        BB: {
            RAISE: ['AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', 'AKs', 'AQs', 'AJs', 'KQs', 'AKo', 'AQo'],
            CALL: ['77', '66', '55', '44', '33', '22', 'A10s', 'A9s', 'A8s', 'A7s', 'A5s', 'KJs', 'K10s', 'QJs', 'Q10s', 'J10s', '109s', '98s', '87s', '76s']
        }
    }
};
