import { NextResponse } from 'next/server';

const MAX_TEXT_LENGTH = 120000;

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractTitle(html: string) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch?.[1]) {
    return titleMatch[1].trim();
  }

  const headingMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return headingMatch?.[1]?.trim() ?? '';
}

function buildPrompt(url: string, extractedText: string) {
  return `You are a legal analyst that writes concise IRAC-style case briefs for law students. Given the webpage contents and the URL below, return valid JSON only with these keys exactly: caseName, facts, issue, ruling, doctrine. Do not include any other keys or text.

URL: ${url}

Webpage content:
${extractedText}

Requirements:
- caseName should be the name of the case or the title of the opinion.
- facts should summarize the controlling facts, parties, and procedural background.
- issue should be stated as a single legal question.
- ruling should explain the court's holding and outcome.
- doctrine should identify the legal principle or rule the case illustrates.

Return JSON only. Use clear, professional legal language suitable for a law-student brief.`;
}

function parseJsonContent(content: string) {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON object found in model response.');
  }
  return JSON.parse(jsonMatch[0]);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = body?.url;

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
  }

  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: 'URL must start with http:// or https://.' }, { status: 400 });
  }

  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) {
    return NextResponse.json({ error: 'Server is not configured with OPENAI_API_KEY.' }, { status: 500 });
  }

  let html: string;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LegalCaseBriefer/1.0; +https://vercel.com)',
        Accept: 'text/html,*/*',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Unable to fetch URL: ${response.status} ${response.statusText}` }, { status: 502 });
    }

    html = await response.text();
  } catch (error) {
    return NextResponse.json({ error: 'Unable to fetch the requested URL.' }, { status: 502 });
  }

  const pageTitle = extractTitle(html);
  const text = stripHtml(html);
  const extractedText = [pageTitle, text].filter(Boolean).join('\n\n').slice(0, MAX_TEXT_LENGTH);
  const prompt = buildPrompt(url, extractedText);

  let aiResponse;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert legal brief writer.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `LLM request failed: ${response.status} ${response.statusText} - ${errorText}` }, { status: 502 });
    }

    aiResponse = await response.json();
  } catch (error) {
    return NextResponse.json({ error: 'LLM request failed.' }, { status: 502 });
  }

  const content = aiResponse?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'LLM returned no usable content.' }, { status: 502 });
  }

  let brief;
  try {
    brief = parseJsonContent(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse LLM response as JSON.' }, { status: 502 });
  }

  return NextResponse.json({ brief });
}
