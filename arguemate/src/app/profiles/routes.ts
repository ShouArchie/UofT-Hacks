import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const prisma = new PrismaClient();

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
      },
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
        user: {
          select: {
            email: true,
            name: true
          }
        }
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}