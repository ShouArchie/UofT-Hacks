'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    preferredName: '',
    age: '',
    gender: '',
    city: '',
    bio: '',
    occupation: '',
    debateStyle: '',
    communicationPreference: '',
  });

  const totalSteps = 8;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== totalSteps) {
      handleNext();
      return;
    }
    
    const user = session?.user as SessionUser | undefined;
    if (!user?.id) {
      setError('User ID not found in session. Please try logging in again.');
      return;
    }

    try {
      const profileData = {
        ...formData,
        age: parseInt(formData.age, 10),
        userId: user.id,
      };
      
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Failed to save profile';
        } catch (parseError) {
          errorMessage = 'An unexpected error occurred';
        }
        throw new Error(errorMessage);
      }

      await response.json();
      router.push('/profiles');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while creating your profile. Please try again.');
    }
  };

  const goBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">What should we call you?</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">Choose a name you'd like others to use</p>
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
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">What's your age?</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">This helps us find suitable debate partners</p>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="13"
              max="120"
              placeholder="Your age"
              className="w-full text-3xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 pb-2"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">How do you identify?</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">Tell us about yourself</p>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full text-3xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] focus:outline-none transition-all duration-300 pb-2"
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
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">Where are you based?</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">We'll connect you with nearby debaters</p>
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
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">Tell us about yourself</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">Share a brief bio with the community</p>
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
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">What do you do?</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">Your occupation helps people know you better</p>
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
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">How do you like to debate?</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">Choose your preferred style</p>
            <select
              name="debateStyle"
              value={formData.debateStyle}
              onChange={handleChange}
              className="w-full text-3xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] focus:outline-none transition-all duration-300 pb-2"
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
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">How would you like to communicate?</h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">Choose your preferred method</p>
            <select
              name="communicationPreference"
              value={formData.communicationPreference}
              onChange={handleChange}
              className="w-full text-3xl text-center font-['Poppins'] border-b-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] focus:outline-none transition-all duration-300 pb-2"
            >
              <option value="">Select preference</option>
              <option value="text">Text Only</option>
              <option value="voice">Voice Chat</option>
              <option value="video">Video Chat</option>
            </select>
          </div>
        );
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
                i + 1 === step ? 'bg-[#FF8D58]' : 'bg-[#FF8D58]/20'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-8 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center max-w-md">
            {error}
          </div>
        )}

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}
            
            <button
              type="submit"
              className="mt-8 w-full bg-[#FF8D58] text-white py-4 px-6 rounded-full text-lg font-['Poppins'] font-light transition-all duration-300 hover:opacity-90 hover:scale-[0.99] active:scale-95"
            >
              {step === totalSteps ? 'Complete Profile' : 'Enter'}
            </button>
          </form>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between w-full max-w-md mt-8">
          {step > 1 && (
            <button
              onClick={goBack}
              className="text-[#FF8D58] font-light transition-all duration-300 hover:opacity-70"
            >
              ← Back
            </button>
          )}
          {step < totalSteps && (
            <button
              onClick={handleNext}
              className="text-[#FF8D58] font-light transition-all duration-300 hover:opacity-70 ml-auto"
            >
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}