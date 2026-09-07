import { NextResponse } from 'next/server';
import { POSTFLOP_SYSTEM_PROMPT, generatePostflopAnalysisPrompt } from '@/lib/prompts';
import { fetchWithRetry } from '@/lib/utils';

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      error: "Server Configuration Error: OPENROUTER_API_KEY is not set."
    }, { status: 500 });
  }

  try {
    const {
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
      model,
      language
    } = await request.json();

    const prompt = generatePostflopAnalysisPrompt({
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
      language
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const referer = request.headers.get('referer');
    if (referer) {
      headers['HTTP-Referer'] = referer;
    }
    const xTitle = request.headers.get('x-title');
    if (xTitle) {
      headers['X-Title'] = xTitle;
    }

    const openRouterResponse = await fetchWithRetry("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: POSTFLOP_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error("OpenRouter API Error:", errorData);
      return NextResponse.json({
        error: `OpenRouter API error: ${openRouterResponse.statusText}`,
        details: errorData
      }, { status: openRouterResponse.status });
    }

    const data = await openRouterResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({
      error: "Failed to fetch AI explanation.",
      details: (error as Error).message
    }, { status: 500 });
  }
}
