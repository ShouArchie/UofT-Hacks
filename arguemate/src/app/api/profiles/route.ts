import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        communicationPreference: true,
        image: true,
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

