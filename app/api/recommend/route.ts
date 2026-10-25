import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/prompt';
import type { CategoryFilter } from '@/lib/prompt';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { moods, conditions, freeText, preferences, categoryFilter, shopSnacks, featuredDrinks } = body;
    const prompt = buildPrompt(
      moods ?? [],
      conditions ?? [],
      preferences,
      freeText ?? '',
      (categoryFilter as CategoryFilter) ?? 'all',
      Array.isArray(shopSnacks) ? shopSnacks : undefined,
      Array.isArray(featuredDrinks) ? featuredDrinks : undefined,
    );

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      temperature: 1.0,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = (message.content[0] as { type: string; text: string }).text.trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('JSON not found in response:', text);
      return NextResponse.json({ error: '生成に失敗しました' }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (e) {
    console.error('API error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
