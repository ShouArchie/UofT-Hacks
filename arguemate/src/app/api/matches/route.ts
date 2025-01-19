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
        userId: { not: currentUser.id }
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

    // Parse conflict answers and questions
    let userAnswers: string[] = [];
    let userQuestions: string[] = [];
    try {
      userAnswers = typeof currentUser.profile.conflictAnswers === 'string' 
        ? JSON.parse(currentUser.profile.conflictAnswers)
        : currentUser.profile.conflictAnswers || [];
      
      userQuestions = typeof currentUser.profile.conflictQuestions === 'string'
        ? JSON.parse(currentUser.profile.conflictQuestions)
        : currentUser.profile.conflictQuestions || [];
    } catch (error) {
      console.error('Error parsing user answers/questions:', error);
    }

    // Process profiles in smaller batches to avoid overwhelming Gemini
    const batchSize = 5;
    const allRankedProfiles = [];
    
    // Process Toronto profiles first
    const torontoProfiles = profiles.filter(p => p.city?.toLowerCase().includes('toronto'));
    const otherProfiles = profiles.filter(p => !p.city?.toLowerCase().includes('toronto'));
    
    // Function to process a single profile
    const processProfile = async (profile: any, isFromToronto: boolean) => {
      const prompt = `As a matchmaker for me, rate this specific profile's compatibility with someone who:
- Lives in ${currentUser.profile?.city || 'Unknown'}
- Is ${currentUser.profile?.age || 'Unknown'} years old
- Has this communication style: ${currentUser.profile?.communicationPreference || 'Unknown'}
- Approaches debates this way: ${currentUser.profile?.debateStyle || 'Unknown'}
- Answered these relationship scenarios:
Questions: ${userQuestions.join('\n')}
Answers: ${userAnswers.join('\n')}

Rate from 0-100 and Write a short blurb about the person and why we are compatible romantically and would be a good couple, try and extrpolate from our answers to questions.
Guidelines:
- Location match (same city)
- Age compatibility (within 5 years)
- Similar communication style
- Compatible debate approach
- Similar conflict resolution style

Profile to analyze:
${JSON.stringify(profile, null, 2)}

Return in this exact format:
{
  "id": "${profile.id}",
  "score": number,
  "reason": "Detailed 2-3 sentence analysis"
}`;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();
      
      try {
        const analysis = JSON.parse(analysisText);
        return {
          ...profile,
          compatibilityScore: analysis.score,
          compatibilityReason: analysis.reason,
          isFromToronto
        };
      } catch (parseError) {
        console.error('Error parsing Gemini response for profile:', profile.id);
        console.error('Raw response:', analysisText);
        throw new Error('Invalid Gemini response format');
      }
    };

    // Process profiles in batches
    for (let i = 0; i < torontoProfiles.length; i += batchSize) {
      const batch = torontoProfiles.slice(i, i + batchSize);
      const rankedBatch = await Promise.all(
        batch.map(profile => processProfile(profile, true))
      );
      allRankedProfiles.push(...rankedBatch);
    }

    for (let i = 0; i < otherProfiles.length; i += batchSize) {
      const batch = otherProfiles.slice(i, i + batchSize);
      const rankedBatch = await Promise.all(
        batch.map(profile => processProfile(profile, false))
      );
      allRankedProfiles.push(...rankedBatch);
    }

    // Sort profiles by compatibility score
    const sortedProfiles = allRankedProfiles.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Add navigation metadata
    const profilesWithNavigation = sortedProfiles.map((profile, index) => ({
      ...profile,
      totalProfiles: sortedProfiles.length,
      currentIndex: index + 1,
      hasNext: index < sortedProfiles.length - 1,
      hasPrevious: index > 0,
      currentUserCity: currentUser.profile?.city || 'Unknown'
    }));

    return NextResponse.json(profilesWithNavigation);

  } catch (error) {
    console.error('Error in matches route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze profiles. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

