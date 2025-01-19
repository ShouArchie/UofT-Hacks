import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@../../../src/pages/api/auth/[...nextauth]'

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user's profile
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    });

    if (!currentUserProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get all other profiles
    const potentialMatches = await prisma.profile.findMany({
      where: {
        userId: { not: session.user.id },
        // Add basic filtering
        age: {
          gte: currentUserProfile.age - 5,
          lte: currentUserProfile.age + 5
        },
        city: currentUserProfile.city
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        }
      }
    });

    if (potentialMatches.length === 0) {
      return NextResponse.json([]);
    }

    // Use Gemini to analyze compatibility
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Given a user with the following profile:
      Age: ${currentUserProfile.age}
      Gender: ${currentUserProfile.gender}
      Bio: ${currentUserProfile.bio}
      Occupation: ${currentUserProfile.occupation}
      Debate Style: ${currentUserProfile.debateStyle}
      Communication Preference: ${currentUserProfile.communicationPreference}
      Conflict Answers: ${currentUserProfile.conflictAnswers}

      Rank the following potential matches from 0-100 based on compatibility.
      Return only a JSON array of objects with 'userId' and 'score' properties.
      
      Potential matches:
      ${JSON.stringify(potentialMatches)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rankings = JSON.parse(response.text());

    // Sort matches by score and attach full profile data
    const rankedMatches = rankings
      .sort((a: any, b: any) => b.score - a.score)
      .map((rank: any) => {
        const match = potentialMatches.find(p => p.user.id === rank.userId);
        return {
          ...match,
          compatibilityScore: rank.score
        };
      });

    return NextResponse.json(rankedMatches);
    
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

