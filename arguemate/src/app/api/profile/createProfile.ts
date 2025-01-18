'use server'

import { prisma } from '@/db'

export async function createProfile(userId: string, profileData: any) {
  console.log('Received profile data:', profileData)

  try {
    const profile = await prisma.profile.create({
      data: {
        userId,
        preferredName: profileData.preferredName,
        age: parseInt(profileData.age),
        gender: profileData.gender,
        city: profileData.city,
        bio: profileData.bio || null,
        interests: profileData.interests ? JSON.parse(profileData.interests) : null,
        occupation: profileData.occupation || null,
        debateTopics: profileData.debateTopics ? JSON.parse(profileData.debateTopics) : null,
        debateStyle: profileData.debateStyle || null,
        communicationPreference: profileData.communicationPreference || null,
        image: profileData.image || null,
      },
    })

    console.log('Profile created successfully:', profile)
    return { success: true, profile }
  } catch (error) {
    console.error('Error creating profile:', error)
    return { success: false, error: error.message }
  }
}

