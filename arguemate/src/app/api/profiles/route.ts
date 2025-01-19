import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define sample photos
const samplePhotos = [
  '/profile-photos/1.jpg',
  '/profile-photos/2.jpg',
  '/profile-photos/3.jpg',
  '/profile-photos/4.jpg',
  '/profile-photos/5.jpg',
  '/profile-photos/6.jpg',
  '/profile-photos/7.jpg',
  '/profile-photos/8.jpg',
  '/profile-photos/9.jpg',
  '/profile-photos/10.jpg',
  '/profile-photos/11.jpg',
  '/profile-photos/12.jpg'
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
        preferredName: true,
        age: true,
        gender: true,
        city: true,
        bio: true,
        occupation: true,
        debateStyle: true,
        communicationPreference: true
      },
    });

    // Map through profiles and add photos where missing
    const profilesWithPhotos = profiles.map(profile => ({
      ...profile,
      image: getRandomPhoto()
    }));

    return NextResponse.json(profilesWithPhotos);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

