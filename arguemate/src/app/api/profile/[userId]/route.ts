import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Props = {
  params: {
    userId: string
  }
}

export async function GET(request: NextRequest, context: Props) {
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: context.params.userId
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 