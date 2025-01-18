import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
