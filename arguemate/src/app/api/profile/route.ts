import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const prisma = new PrismaClient();

// Define sample photos (add these to your public folder)
const samplePhotos = [
  '/profile-photos/1.jpg',
  '/profile-photos/2.jpg',
  '/profile-photos/3.jpg',
  '/profile-photos/4.jpg',
  '/profile-photos/5.jpg'
];

// Helper function to get random photo
const getRandomPhoto = () => {
  const randomIndex = Math.floor(Math.random() * samplePhotos.length);
  return samplePhotos[randomIndex];
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!user?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(user.profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!user?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const data = await req.json();

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        age: data.age,
        city: data.city,
        bio: data.bio,
        occupation: data.occupation,
        communicationPreference: data.communicationPreference,
        debateStyle: data.debateStyle,
        conflictQuestions: data.conflictQuestions,
        conflictAnswers: data.conflictAnswers
      }
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  console.log('Received POST request to /api/profile');
  try {
    const body = await req.text();
    console.log('Received request body:', body);
    
    let profileData;
    try {
      profileData = JSON.parse(body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    if (!profileData || typeof profileData !== 'object') {
      console.error('Invalid profile data received:', profileData);
      return NextResponse.json({ message: 'Invalid profile data' }, { status: 400 });
    }

    const { userId, ...data } = profileData;

    if (!userId) {
      console.error('User ID is missing from profile data');
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    console.log('Attempting to create profile for user:', userId);
    console.log('Profile data:', data);

    // Validate required fields
    const requiredFields = ['bio'];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json({ message: `${field} is required` }, { status: 400 });
      }
    }

    // Validate field lengths
    if (data.bio && data.bio.length > 500) {
      return NextResponse.json({ message: 'Bio must be less than 500 characters' }, { status: 400 });
    }

    try {
      const profile = await prisma.profile.create({
        data: {
          ...data,
          user: { connect: { id: userId } },
        },
      });

      console.log('Profile created successfully:', profile.id);
      return NextResponse.json({ message: 'Profile created successfully', profile }, { status: 201 });
    } catch (dbError) {
      console.error('Error creating profile in database:', dbError);
      return NextResponse.json({ 
        message: 'Error creating profile in database', 
        error: dbError instanceof Error ? dbError.message : 'Database error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in profile creation:', error);
    return NextResponse.json({ 
      message: 'An unknown error occurred during profile creation', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
