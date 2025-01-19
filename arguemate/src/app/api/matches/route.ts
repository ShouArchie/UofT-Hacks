import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(req: Request) {
  try {
    // Get all profiles
    const profiles = await prisma.profile.findMany({
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

    // Separate Toronto and non-Toronto profiles
    const torontoProfiles = profiles.filter(profile => 
      profile.city?.toLowerCase().includes('toronto'));
    const otherProfiles = profiles.filter(profile => 
      !profile.city?.toLowerCase().includes('toronto'));

    // Modified prompt to encourage more varied scores
    const prompt = `As a matchmaker, rate these dating profiles' compatibility with someone who:
- Lives in Toronto (give Toronto residents +30 points automatically)
- Aged 25
- Values positive communication during breakups
- Believes in working through issues together

Rate each profile from 0-100, ensuring scores are well-distributed and distinct.
Guidelines:
- Toronto residents: 70-100 range
- Strong communicators: +20 points
- Growth mindset: +20 points
- Non-Toronto but nearby: 40-70 range
- Others: 0-40 range

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
    
    // Log Gemini's output to the terminal
    console.log('\n=== Gemini Analysis ===');
    console.log(rankingText);
    console.log('=====================\n');
    
    try {
      // Parse Gemini's response and combine with profile data
      const rankings = JSON.parse(rankingText);
      
      // Process Toronto profiles first, then others
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

      // Combine the sorted arrays with Toronto profiles first
      const allRankedProfiles = [...rankedTorontoProfiles, ...rankedOtherProfiles];

      // Add index information for profile navigation
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
      // If parsing fails, return basic sorted profiles
      const sortedProfiles = [
        ...torontoProfiles.map(p => ({ 
          ...p, 
          isFromToronto: true,
          compatibilityScore: p.city?.toLowerCase().includes('toronto') ? 80 : 50,
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

