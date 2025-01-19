import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(req: Request) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the current user's profile
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!currentUser?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get all other profiles
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { not: currentUser.id } // Exclude current user
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            image: true,
          }
        }
      }
    });

    // Parse conflict answers if they're stored as strings
    let userAnswers: string[] = [];
    let userQuestions: string[] = [];

    try {
      if (typeof currentUser.profile.conflictAnswers === 'string') {
        userAnswers = JSON.parse(currentUser.profile.conflictAnswers);
      } else if (Array.isArray(currentUser.profile.conflictAnswers)) {
        userAnswers = currentUser.profile.conflictAnswers;
      }
    } catch (error) {
      console.error('Error parsing conflict answers:', error);
    }

    try {
      if (typeof currentUser.profile.conflictQuestions === 'string') {
        userQuestions = JSON.parse(currentUser.profile.conflictQuestions);
      } else if (Array.isArray(currentUser.profile.conflictQuestions)) {
        userQuestions = currentUser.profile.conflictQuestions;
      }
    } catch (error) {
      console.error('Error parsing conflict questions:', error);
    }

    // Separate Toronto and non-Toronto profiles
    const torontoProfiles = profiles.filter(profile => 
      profile.city?.toLowerCase().includes('toronto'));
    const otherProfiles = profiles.filter(profile => 
      !profile.city?.toLowerCase().includes('toronto'));

    // Modified prompt to use current user's data
    const prompt = `As a matchmaker, rate these dating profiles' compatibility with someone who:
- Lives in ${currentUser.profile.city}
- Is ${currentUser.profile.age} years old
- Has this communication style: ${currentUser.profile.communicationPreference}
- Approaches debates this way: ${currentUser.profile.debateStyle}
- Answered these relationship scenarios:
Questions: ${userQuestions?.join('\n')}
Answers: ${userAnswers?.join('\n')}

Rate each profile from 0-100, ensuring scores are well-distributed and distinct.
Guidelines:
- Location match (same city): +30 points
- Age compatibility (within 5 years): +20 points
- Similar communication style: +20 points
- Compatible debate approach: +20 points
- Similar conflict resolution style: +10 points

Return a JSON array with objects in this exact format:
[
  {
    "id": "profile_id",
    "score": number (make sure scores are different for each profile),
    "reason": "One clear sentence about why this score was given"
  }
]

Profiles to analyze:
${JSON.stringify([...torontoProfiles, ...otherProfiles], null, 2)}`;

    // Get Gemini's analysis
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rankingText = response.text();
    
    console.log('\n=== Current User Profile ===');
    console.log({
      name: currentUser.name,
      email: currentUser.email,
      profile: {
        age: currentUser.profile.age,
        city: currentUser.profile.city,
        communicationPreference: currentUser.profile.communicationPreference,
        debateStyle: currentUser.profile.debateStyle,
        questions: userQuestions,
        answers: userAnswers
      }
    });
    console.log('\n=== Gemini Analysis ===');
    console.log(rankingText);
    console.log('=====================\n');
    
    try {
      const rankings = JSON.parse(rankingText);
      
      const rankedTorontoProfiles = torontoProfiles.map(profile => {
        const ranking = rankings.find((r: any) => r.id === profile.id) || {
          score: 0,
          reason: 'Analysis not available'
        };
        return {
          ...profile,
          compatibilityScore: ranking.score,
          compatibilityReason: ranking.reason,
          isFromToronto: true
        };
      }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      const rankedOtherProfiles = otherProfiles.map(profile => {
        const ranking = rankings.find((r: any) => r.id === profile.id) || {
          score: 0,
          reason: 'Analysis not available'
        };
        return {
          ...profile,
          compatibilityScore: ranking.score,
          compatibilityReason: ranking.reason,
          isFromToronto: false
        };
      }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      const allRankedProfiles = [...rankedTorontoProfiles, ...rankedOtherProfiles];
      const profilesWithNavigation = allRankedProfiles.map((profile, index) => ({
        ...profile,
        totalProfiles: allRankedProfiles.length,
        currentIndex: index + 1,
        hasNext: index < allRankedProfiles.length - 1,
        hasPrevious: index > 0
      }));

      return NextResponse.json(profilesWithNavigation);

    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw Gemini response:', rankingText);
      
      // Safe fallback with null check
      const userCity = currentUser.profile?.city?.toLowerCase() || '';
      const sortedProfiles = [
        ...torontoProfiles.map(p => ({ 
          ...p, 
          isFromToronto: true,
          compatibilityScore: p.city?.toLowerCase() === userCity ? 80 : 50,
          compatibilityReason: 'Basic compatibility score based on location'
        })),
        ...otherProfiles.map(p => ({ 
          ...p, 
          isFromToronto: false,
          compatibilityScore: 50,
          compatibilityReason: 'Basic compatibility score based on location'
        }))
      ];
      return NextResponse.json(sortedProfiles);
    }

  } catch (error) {
    console.error('Error in matches route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

