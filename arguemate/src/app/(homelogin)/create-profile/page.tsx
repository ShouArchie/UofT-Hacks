"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
//import { createProfile } from '@/app/api/profile/createProfile'; // Updated import

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
}

export default function CreateProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    preferredName: string;
    age: string;
    gender: string;
    city: string;
    bio: string;
    occupation: string;
    debateStyle: string;
    communicationPreference: string;
    answer1: string;
    answer2: string;
    answer3: string;
    photo: File | null; // Allow `File` or `null`
  }>({
    preferredName: "",
    age: "",
    gender: "",
    city: "",
    bio: "",
    occupation: "",
    debateStyle: "",
    communicationPreference: "",
    photo: null,
    answer1: "",
    answer2: "",
    answer3: "",
  });

  const totalSteps = 12; // Update to match the total number of steps

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prevState) => ({ ...prevState, photo: file }));
      setPhotoPreview(URL.createObjectURL(file)); // Show photo preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== totalSteps) {
      handleNext();
      return;
    }

    const user = session?.user as SessionUser | undefined;
    if (!user?.id) {
      setError("User ID not found in session. Please try logging in again.");
      return;
    }

    // Validate required fields
    if (!formData.preferredName || !formData.age || !formData.photo) {
      setError("Please fill out all required fields and upload a photo.");
      console.log("Form Data:", formData);
      return;
    }

    let photoPath = "";
    if (formData.photo) {
      const photoData = new FormData();
      photoData.append("photo", formData.photo);
      photoData.append("userId", user.id);

      try {
        const photoResponse = await fetch("/api/upload", {
          method: "POST",
          body: photoData,
        });

        if (!photoResponse.ok) {
          throw new Error("Photo upload failed.");
        }

        const photoResult = await photoResponse.json();
        photoPath = photoResult.photoPath;
      } catch (err) {
        console.error("Photo upload error:", err);
        setError("Failed to upload photo. Please try again.");
        return;
      }
    }

    const profileData = {
      ...formData,
      photo: photoPath, // Use the uploaded photo path
      age: parseInt(formData.age, 10),
      userId: user.id,
    };

    try {
      const response = await fetch("/api/profile/createProfile", {
        // Updated fetch call
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        setError("Failed to save profile. Please try again.");
        return;
      }

      const result = await response.json();
      console.log("Profile created successfully:", result);
      router.push("/profiles");
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">Name</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Your name will be visible on your profile
            </p>
            <input
              type="text"
              name="preferredName"
              value={formData.preferredName}
              onChange={handleChange}
              placeholder="Your preferred name"
              className="w-full text-3xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 pb-2"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">Age</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Your age will be visible on your profile
            </p>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="120"
              placeholder="Your age"
              className="w-full text-3xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 pb-2"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              How do you identify?
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Your gender will be visible on your profile
            </p>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full text-2xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] focus:outline-none transition-all duration-300 pb-2"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              Where are you based?
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Your relative location will be shown on your profile
            </p>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Your city"
              className="w-full text-3xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 pb-2"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              Tell us about yourself
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Share a brief bio with the community
            </p>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Your bio"
              rows={4}
              className="w-full text-xl text-center font-['Poppins'] border-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 p-4 rounded-lg"
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              What do you do?
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Your occupation will be visible on your profile
            </p>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Your occupation"
              className="w-full text-3xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 pb-2"
            />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              How do you like to debate?
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Choose your preferred style
            </p>
            <select
              name="debateStyle"
              value={formData.debateStyle}
              onChange={handleChange}
              className="w-full text-2xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] focus:outline-none transition-all duration-300 pb-2"
            >
              <option value="">Select style</option>
              <option value="casual">Casual Discussion</option>
              <option value="formal">Formal Debate</option>
              <option value="competitive">Competitive</option>
            </select>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              How would you like to communicate?
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Choose your preferred method
            </p>
            <select
              name="communicationPreference"
              value={formData.communicationPreference}
              onChange={handleChange}
              className="w-full text-2xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] focus:outline-none transition-all duration-300 pb-2"
            >
              <option value="">Select preference</option>
              <option value="text">Text Only</option>
              <option value="voice">Voice Chat</option>
              <option value="video">Video Chat</option>
            </select>
          </div>
        );
      case 9:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              Your partner dreams of being a goat farmer in the Alps, but you’re
              all about city life with coffee shops and reliable Wi-Fi. What
              steps would you take to find a middle ground?
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Share how you would resolve this conflict
            </p>
            <textarea
              name="answer1"
              value={formData.answer1}
              onChange={handleChange}
              placeholder="Your solution"
              rows={4}
              className="w-full text-xl text-center font-['Poppins'] border-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 p-4 rounded-lg"
            />
          </div>
        );
      case 10:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              Your partner bought a life-sized inflatable dinosaur “because it
              was a great deal.” How would you address their spending habits
              without stomping on their dino-sized joy?
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Share how you would resolve this conflict
            </p>
            <textarea
              name="answer2"
              value={formData.answer2}
              onChange={handleChange}
              placeholder="Your solution"
              rows={4}
              className="w-full text-xl text-center font-['Poppins'] border-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 p-4 rounded-lg"
            />
          </div>
        );
      case 11:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              You suggest a comedy, and they pick a 4-hour documentary about
              medieval farming. How do you settle on something without it
              becoming the next great debate?
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Share how you would resolve this conflict
            </p>
            <textarea
              name="answer3"
              value={formData.answer3}
              onChange={handleChange}
              placeholder="Your solution"
              rows={4}
              className="w-full text-xl text-center font-['Poppins'] border-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 p-4 rounded-lg"
            />
          </div>
        );
      case 12: // New photo upload step
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              Upload A Photo
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              This will be your profile picture
            </p>

            {/* Custom File Input */}
            <div className="relative">
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                required
              />
              <label
                htmlFor="photo"
                className="inline-block bg-[#FF8D58] text-white text-lg font-light py-2 px-6 rounded-full cursor-pointer transition-all hover:bg-[#e87749] focus:outline-none"
              >
                Choose File
              </label>
            </div>

            {/* Preview */}
            {photoPreview && (
              <img
                src={photoPreview || "/placeholder.svg"}
                alt="Photo preview"
                className="w-32 h-32 object-cover rounded-full mx-auto mt-4"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white font-['Poppins'] text-[#FF8D58] flex items-center justify-center">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Poppins'] text-[#FF8D58]">
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Progress Dots */}
        <div className="flex gap-2 mb-12">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i + 1 === step ? "bg-[#FF8D58]" : "bg-[#FF8D58]/20"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-8 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center max-w-md">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col w-full max-w-md mt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}

            {/* Buttons container */}
            <div className="flex justify-between mt-8">
              <button
                type="button" // Add this to prevent form submission
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  goBack();
                }}
                className="text-[#FF8D58] text-lg font-light transition-all duration-300 hover:opacity-70"
                style={{ visibility: step === 1 ? "hidden" : "visible" }}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="text-[#FF8D58] text-lg font-light transition-all duration-300 hover:opacity-70"
              >
                {step === totalSteps ? "Complete Profile →" : "Enter →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
