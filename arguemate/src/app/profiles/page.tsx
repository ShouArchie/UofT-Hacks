"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfiles();
    }
  }, [status, router]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profiles");
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      } else {
        console.error("Failed to fetch profiles");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background p-4 text-foreground">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <nav className="flex justify-between items-center text-foreground py-4 mb-8">
          <h1 className="text-2xl font-light">ArgueMate</h1>
        </nav>

        {profiles.length === 0 ? (
          <p className="text-foreground text-center">No profiles found.</p>
        ) : (
          <div className="space-y-8">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-foreground shadow-xl rounded-lg overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-[300px] md:h-[600px]">
                    <Image
                      src={profile.image || "/placeholder.svg"}
                      alt={`${profile.preferredName}'s profile`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-3xl font-semibold text-background">
                        {profile.preferredName}, {profile.age}
                      </h2>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-2 text-background">
                      <p>
                        <span className="font-medium">Gender:</span>{" "}
                        {profile.gender}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {profile.city}
                      </p>
                      <p>
                        <span className="font-medium">Occupation:</span>{" "}
                        {profile.occupation}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-background">
                        Debate Style
                      </h3>
                      <p className="text-background">{profile.debateStyle}</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-background">
                        Communication Preference
                      </h3>
                      <p className="text-background">
                        {profile.communicationPreference}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-background">
                        Bio
                      </h3>
                      <p className="text-background">{profile.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
