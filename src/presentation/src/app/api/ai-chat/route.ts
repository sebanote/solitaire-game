import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body

    try {
      const gameGeneratorResponse = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!gameGeneratorResponse.ok) {
        throw new Error('Game generator service error')
      }

      const data = await gameGeneratorResponse.json()

      return NextResponse.json({ response: data.response })
      
    } catch (serviceError) {
      console.warn('Falling back to mock response:', serviceError)
      const mockResponse = {
        response: {
          text: `This is a temporary response to your message: "${message}". AI service will be back soon.`,
          arrangements: [],
          id: 0
        }
      }
      return NextResponse.json(mockResponse)
    }

  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
