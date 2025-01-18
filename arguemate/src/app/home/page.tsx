'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FF8D58] text-[#FFEBD0] p-4">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-light mb-4">ArgueMate</h1>
        <p className="text-2xl italic mb-12">A new perspective on dating</p>
        
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-4 bg-[#FFEBD0] text-[#FF8D58] rounded-full text-xl font-light 
                   transition-all duration-300 hover:opacity-90 hover:scale-[0.99] active:scale-95"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

