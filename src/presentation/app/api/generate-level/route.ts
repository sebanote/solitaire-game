
import { NextResponse } from 'next/server';
import { GenerateLevel } from '../../../../domain/use-cases/generate-level'; 

export async function GET() {
  try {
    const generator = new GenerateLevel();
    const level = await generator.generate();
    return NextResponse.json(level);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to generate level' }, { status: 500 });
  }
}