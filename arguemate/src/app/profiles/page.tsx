'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Profile {
  id: string;
  preferredName: string;
  age: number;
  gender: string;
  city: string;
  bio: string;
  occupation: string;
  debateStyle: string;
  communicationPreference: string;
  image?: string;
}

export default function ProfilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchProfiles();
    }
  }, [status, router]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      } else {
        console.error('Failed to fetch profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // This will prevent the "Please sign in" message from flashing before redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profiles</h1>
      {profiles.length === 0 ? (
        <p>No profiles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={profile.image || '/placeholder.svg'}
                  alt={`${profile.preferredName}'s profile`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{profile.preferredName}</h2>
                <p className="text-gray-600 mb-2">{profile.age} years old, {profile.gender}</p>
                <p className="text-gray-600 mb-2">{profile.city}</p>
                <p className="text-gray-700 mb-4">{profile.bio}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Occupation: {profile.occupation}</span>
                  <span>Debate Style: {profile.debateStyle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

