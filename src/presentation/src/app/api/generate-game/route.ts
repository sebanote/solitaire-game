import { NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch('http://localhost:3001/generate-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from game generator');
    }

    const { defaultGame } = await response.json();
    return NextResponse.json(defaultGame);
  } catch (error) {
    console.error('Game generator error:', error);
    return NextResponse.json({ error: 'Failed to generate game' }, { status: 500 });
  }
}
