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
