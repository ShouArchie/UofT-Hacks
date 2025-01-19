"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createProfile } from '@/app/api/profile/createProfile'

const conflictQuestions = [
  "Your partner dreams of being a goat farmer in the Alps, but you're all about city life with coffee shops and reliable Wi-Fi. What steps would you take to find a middle ground?",
  'Your partner bought a life-sized inflatable dinosaur "because it was a great deal." How would you address their spending habits without stomping on their dino-sized joy?',
  'Your partner says "nothing\'s wrong" but sighs loudly every five minutes. What steps would you take to get to the root of their feelings?',
  "Your partner gets upset whenever you mention your work buddy, Sam, who happens to be a 70-year-old model. How would you handle their jealousy constructively?",
  'Your partner\'s mom keeps comparing you to her "perfect" basketball player. How would you establish healthy boundaries while keeping the peace?',
  'Your partner critiques your cooking every time with phrases like, "It\'s… creative." How would you express your feelings about their comments and find a solution?',
  'Your partner thinks gifting socks is romantic, but you value quality time. How would you bridge the gap between your different love languages?',
  "You want a relaxing beach vacation, but your partner insists on hiking up a volcano. How do you avoid turning the trip into a disaster movie?",
  "Your partner lets the dog sleep in the bed, and now you're clinging to the edge of the mattress for dear life. How do you reclaim your spot without sparking a custody battle?",
  "You suggest a comedy, and they pick a 4-hour documentary about medieval farming. How do you settle on something without it becoming the next great debate?",
  "Your partner hits snooze 47 times every morning, and you've started dreaming about hiding the alarm. How do you address this without escalating to a 6 a.m. shouting match?",
  'They want to "experiment" in the kitchen, and now you\'re eating spaghetti tacos for the third time this week. How do you diplomatically encourage a return to recipes?',
  "You love sleeping in a pitch-black room, and they insist on having the TV on all night. How do you negotiate a truce without losing sleep?",
  "You're always cold, and they're always hot. How do you find a solution before the thermostat becomes a battleground?",
  "Your partner insists on hoarding all the pillows, leaving you with a flat pancake. How do you reclaim your fair share of cushion real estate?",
];

function getRandomQuestions(questions: string[], count: number): string[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

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
  const [formData, setFormData] = useState<{
    preferredName: string;
    age: string;
    gender: string;
    city: string;
    bio: string;
    occupation: string;
    debateStyle: string;
    communicationPreference: string;
    questions: string[];
    answers: string[];
  }>(() => {
    const selectedQuestions = getRandomQuestions(conflictQuestions, 3);
    return {
      preferredName: "",
      age: "",
      gender: "",
      city: "",
      bio: "",
      occupation: "",
      debateStyle: "",
      communicationPreference: "",
      questions: selectedQuestions,
      answers: ["", "", ""],
    };
  });

  const totalSteps = 11; // Updated total steps (removed photo upload step)

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
    if (name.startsWith("answer")) {
      const index = parseInt(name.slice(-1)) - 1;
      setFormData((prevState) => ({
        ...prevState,
        answers: prevState.answers.map((ans, i) => (i === index ? value : ans)),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== totalSteps) {
      handleNext();
      return;
    }

    // Get user email from session
    const userEmail = session?.user?.email;
    if (!userEmail) {
      setError("User email not found in session. Please try logging in again.");
      return;
    }

    // Validate required fields
    if (!formData.preferredName || !formData.age) {
      setError("Please fill out all required fields.");
      console.log("Form Data:", formData);
      return;
    }

    try {
      // First, get the user ID using the email
      const userResponse = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user ID');
      }

      const userData = await userResponse.json();
      const userId = userData.id;

      if (!userId) {
        setError("Could not find user ID. Please try logging in again.");
        return;
      }

      const profileData = {
        userId: userId,
        ...formData,
        age: parseInt(formData.age, 10),
        conflictQuestions: formData.questions,
        conflictAnswers: formData.answers,
      };

      const result = await createProfile(profileData);

      if (result.success) {
        console.log("Profile created successfully:", result.profile);
        router.push("/home"); // Redirect to home page after profile creation
      } else {
        setError("Failed to save profile. Please try again.");
      }
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
      case 10:
      case 11:
        const questionIndex = step - 9;
        return (
          <div className="space-y-4 animate-fadeIn text-center">
            <h2 className="text-4xl font-['Poppins'] font-light mb-2">
              {formData.questions[questionIndex]}
            </h2>
            <p className="text-[#FF8D58]/70 mb-6 font-light">
              Share how you would resolve this conflict
            </p>
            <textarea
              name={`answer${questionIndex + 1}`}
              value={formData.answers[questionIndex]}
              onChange={handleChange}
              placeholder="Your solution"
              rows={4}
              className="w-full text-xl text-center font-['Poppins'] border-2 border-[#FF8D58]/20 focus:border-[#FF8D58] bg-transparent text-[#FF8D58] placeholder-[#FF8D58]/40 focus:outline-none transition-all duration-300 p-4 rounded-lg"
            />
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

        <div className="flex flex-col w-full max-w-md mt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
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

