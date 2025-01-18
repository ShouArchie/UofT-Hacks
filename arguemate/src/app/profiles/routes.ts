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
        preferredName: true,
        age: true,
        gender: true,
        city: true,
        bio: true,
        occupation: true,
        debateStyle: true,
        image: true,
      },
    });

    // Map through profiles and add photos where missing
    const profilesWithPhotos = profiles.map(profile => ({
      ...profile,
      image: profile.image || getRandomPhoto()
    }));

    return NextResponse.json(profilesWithPhotos);
  } catch (error) {
    // ... existing error handling ...
  }
}