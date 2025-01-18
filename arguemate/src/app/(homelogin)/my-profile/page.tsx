'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProfile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    preferredName: '',
    age: '',
    gender: '',
    city: '',
    
    // About You
    bio: '',
    interests: [],
    occupation: '',
    
    // Preferences
    debateTopics: [],
    debateStyle: '',
    communicationPreference: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) {
      nextStep();
      return;
    }
    
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const inputClassName = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 placeholder-gray-500";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700">
                  Preferred Name
                </label>
                <input
                  type="text"
                  id="preferredName"
                  name="preferredName"
                  value={formData.preferredName}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                  min="13"
                  max="120"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                />
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">About You</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className={inputClassName}
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                  Occupation
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Debate Preferences</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="debateStyle" className="block text-sm font-medium text-gray-700">
                  Preferred Debate Style
                </label>
                <select
                  id="debateStyle"
                  name="debateStyle"
                  value={formData.debateStyle}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">Select style</option>
                  <option value="casual">Casual Discussion</option>
                  <option value="formal">Formal Debate</option>
                  <option value="competitive">Competitive</option>
                </select>
              </div>
              <div>
                <label htmlFor="communicationPreference" className="block text-sm font-medium text-gray-700">
                  Communication Preference
                </label>
                <select
                  id="communicationPreference"
                  name="communicationPreference"
                  value={formData.communicationPreference}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">Select preference</option>
                  <option value="text">Text Only</option>
                  <option value="voice">Voice Chat</option>
                  <option value="video">Video Chat</option>
                </select>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Profile</h2>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="ml-auto bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            {step === 3 ? 'Complete Profile' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
}