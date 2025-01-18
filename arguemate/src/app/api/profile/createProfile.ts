'use server'

import { prisma } from '@/db'

export async function createProfile(profileData: any) {
  console.log('Received profile data:', profileData)

  try {
    const profile = await prisma.profile.create({
      data: {
        userId: profileData.userId,
        preferredName: profileData.preferredName,
        age: parseInt(profileData.age),
        gender: profileData.gender,
        city: profileData.city,
        bio: profileData.bio || null,
        occupation: profileData.occupation || null,
        debateStyle: profileData.debateStyle || null,
        communicationPreference: profileData.communicationPreference || null,
        conflictQuestions: JSON.stringify(profileData.conflictQuestions),
        conflictAnswers: JSON.stringify(profileData.conflictAnswers),
      },
    })

    console.log('Profile created successfully:', profile)
    return { success: true, profile }
  } catch (error) {
    console.error('Error creating profile:', error)
    return { success: false, error: error.message }
  }
}

