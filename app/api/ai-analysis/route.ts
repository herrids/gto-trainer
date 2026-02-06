import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, generateAnalysisPrompt } from '@/lib/prompts';
import { fetchWithRetry } from '@/lib/utils'; // Assuming fetchWithRetry is a generic utility

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      error: "Server Configuration Error: OPENROUTER_API_KEY is not set."
    }, { status: 500 });
  }

  try {
    const {
      hand,
      positionName,
      situationLabel,
      actionLabel,
      analysisLevel,
      model,
      language
    } = await request.json();

    const prompt = generateAnalysisPrompt({
      hand,
      positionName,
      situationLabel,
      actionLabel,
      analysisLevel,
      language
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // Forwarding referrer and title if available from the client, though typically not from a server-side route
    // However, for consistency with the original client-side request, we can add them here if they were part of the incoming request headers.
    // For now, I'll omit window.location.origin and assume the client doesn't need to pass these to the server route.
    // If OpenRouter needs them, the client should pass them in the body, or we should re-evaluate.
    // For now, let's just make sure the essential ones are there.
    const referer = request.headers.get('referer');
    if (referer) {
      headers['HTTP-Referer'] = referer;
    }
    const xTitle = request.headers.get('x-title');
    if (xTitle) {
      headers['X-Title'] = xTitle;
    }
    // If the original client request had window.location.origin, it's problematic to pass from server directly.
    // The new client request to this route will handle the referer.

    const openRouterResponse = await fetchWithRetry("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
