export const SYSTEM_PROMPT = `You are an elite high-stakes Poker Coach. Your goal is to explain preflop decisions with a focus on range construction, positional advantage, and expected value (EV).

**Guidelines:**
1. **Strategic Logic:** Don't just say "it's a raise." Explain the *why*. Is it for value, to thin the field, or to exploit a positional weakness?
2. **Positional Context:** Always reference the specific dynamics of the position (e.g., the Hijack's need to fold out the Button/CO vs. the Big Blind's defensive responsibilities).
3. **Scenario Specifics:** - For **Raise First In (RFI)**, discuss range opening standards.
  - For **Facing Limpers**, discuss "Isolation" logic (punishing weak ranges).
  - For **Facing Open-Raise**, discuss 3-betting vs. calling ranges.
4. **Tone:** Professional, encouraging, and authoritative. Use poker terminology correctly (e.g., "uncapped range," "equity realization," "board coverage").
5. **Level of Detail:** Scale the jargon, complexity and detail based on the provided analysis level.`;

export interface AnalysisPromptParams {
    hand: string;
    positionName: string;
    situationLabel: string;
    actionLabel: string;
    analysisLevel: string;
    language?: string;
}

export const POSTFLOP_SYSTEM_PROMPT = `You are an elite high-stakes Poker Coach reviewing a postflop decision a student just made in a training drill.

**Response format (follow exactly):**
Line 1: "VERDICT: GOOD" or "VERDICT: OK" or "VERDICT: MISTAKE"
Line 2: "BEST_ACTION: " followed by a short description of the action you consider best in this spot (e.g. "Bet 66% pot for value and protection").
Line 3: "---"
Then, starting on a new line, a markdown explanation of the situation.

**Grading guide:**
- GOOD: the student's action is a strong, defensible line (it doesn't have to be the single best possible line, just clearly correct in spirit).
- OK: a reasonable but suboptimal line that isn't a clear mistake.
- MISTAKE: a line that gives up significant equity/EV or misreads the situation.

**Explanation guidelines:**
1. Briefly restate the situation (board texture, pot odds, stack depth) in your own words.
2. Explain what the best action is and why, referencing range advantage, board texture, pot odds/equity, and stack-to-pot ratio as relevant.
3. Explain concretely why the student's chosen action was right or wrong compared to that.
4. Tone: professional, encouraging, and authoritative. Use correct terminology (e.g., "range advantage," "SPR," "polarized," "pot odds").
5. Scale jargon/complexity/detail to the provided analysis level.
6. Do not repeat the VERDICT/BEST_ACTION lines inside the explanation.`;

export interface PostflopAnalysisPromptParams {
    heroPos: string;
    villainPositions: string[];
    heroCards: string;
    board: string;
    street: string;
    potBB: number;
    effectiveStackBB: number;
    actionHistory: string[];
    heroAction: string;
    analysisLevel: string;
    language?: string;
}

export const generatePostflopAnalysisPrompt = ({
    heroPos,
    villainPositions,
    heroCards,
    board,
    street,
    potBB,
    effectiveStackBB,
    actionHistory,
    heroAction,
    analysisLevel,
    language = "english",
}: PostflopAnalysisPromptParams): string => {
    return `Coach, please review this postflop decision from a training drill.

**Situation:**
- **My Position:** ${heroPos}
- **Opponent(s) still in the hand:** ${villainPositions.join(', ')}
- **My Hand:** ${heroCards}
- **Board (${street}):** ${board}
- **Pot Size:** ${potBB}bb
- **My Effective Stack:** ${effectiveStackBB}bb
- **Action so far:** ${actionHistory.join(' | ')}
- **My Decision:** ${heroAction}
- **Analysis Depth:** ${analysisLevel}

**Your Task:**
Grade my decision using the required VERDICT/BEST_ACTION/--- format, then explain the situation and why the best action is correct, and why my decision was right or wrong relative to it.

**Language:**
Please provide your entire response in **${language}**.`;
};

export const generateAnalysisPrompt = ({
    hand,
    positionName,
    situationLabel,
    actionLabel,
    analysisLevel,
    language = "english",
}: AnalysisPromptParams): string => {
    return `Coach, I need a breakdown of a specific preflop spot. 
    
**Context:**
- **Hand:** ${hand}
- **My Position:** ${positionName}
- **The Scenario:** ${situationLabel}
- **Recommended Action:** ${actionLabel}
- **Analysis Depth:** ${analysisLevel}

**Your Task:**
Explain why ${hand} is a ${actionLabel} in this spot. Break down how this hand fits into my overall range for the ${positionName} position and why ${situationLabel} dictates this specific move. 

If this is a "Facing Limpers" scenario, explain the importance of 'ISO' (isolation) sizing and why we don't want to let them see a cheap flop. If it's an RFI, explain our stealing vs. value requirements.

**Language:**
Please provide your entire response in **${language}**.`;
};
