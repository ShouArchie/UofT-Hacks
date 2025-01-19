import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { message, matchProfile } = await req.json()

    const prompt = `You are roleplaying as ${matchProfile.user.name}, a romantically interested person in a dating app chat. Here's your profile:
Age: ${matchProfile.age}
City: ${matchProfile.city}
Occupation: ${matchProfile.occupation}
Communication Style: ${matchProfile.communicationPreference}
Debate Approach: ${matchProfile.debateStyle}
Interests: ${matchProfile.interests?.join(', ')}

Respond to this message from your match: "${message}"

Guidelines for your response:
1. Stay in character as ${matchProfile.user.name}
2. Be flirty but respectful
3. Show genuine interest in getting to know your match
4. Reference your profile details naturally when relevant
5. Keep responses concise (1-3 sentences)
6. Use your defined communication style and debate approach
7. Be authentic and engaging

Remember: You're interested in this person romantically but want to get to know them better through meaningful conversation.`

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Error in chat route:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
} 