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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const profiles = await prisma.profile.findMany({
      where: {
        user: {
          email: {
            not: session.user.email
          }
        }
      }
    });

    // Map through profiles and add photos where missing
    const profilesWithPhotos = profiles.map(profile => ({
      ...profile,
      image: profile.image || getRandomPhoto()
    }));

    return NextResponse.json(profilesWithPhotos);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}