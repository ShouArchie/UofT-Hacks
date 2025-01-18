import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      select: {
        id: true,
        bio: true,
        image: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
    });

    // Map through profiles and add photos where missing
    const profilesWithPhotos = profiles.map(profile => ({
      ...profile,
      image: profile.image || getRandomPhoto()
    }));

    return NextResponse.json(profilesWithPhotos);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ message: 'Error fetching profiles', error: error.message }, { status: 500 });
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
      return NextResponse.json({ message: 'Error creating profile in database', error: dbError.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in profile creation:', error);
    return NextResponse.json({ message: 'An unknown error occurred during profile creation', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
