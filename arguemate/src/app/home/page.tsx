'use client';

import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Users } from 'lucide-react';

const PuzzleWord = ({ word }: { word: string }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  const letterVariants = {
    initial: (i: number) => ({
      rotateZ: (i % 2 === 0 ? 1 : -1) * Math.random() * 30,
      y: Math.random() * 30 - 15,
      opacity: 0
    }),
    animate: (i: number) => ({
      rotateZ: 0,
      y: 0,
      opacity: 1,
      transition: { 
        duration: 1, 
        type: "spring", 
        stiffness: 100,
        delay: i * 0.1
      }
    })
  };

  return (
    <motion.div className="relative inline-block">
      {word.split('').map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          initial="initial"
          animate={controls}
          custom={index}
          className="inline-block origin-center"
          style={{ display: 'inline-block' }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const FeatureIcon = ({ Icon, text }: { Icon: React.ElementType; text: string }) => (
  <motion.div
    className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg backdrop-blur-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 1.5 }}
  >
    <Icon size={32} className="mb-2" />
    <p className="text-sm font-light">{text}</p>
  </motion.div>
);

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FF8D58] text-[#FFEBD0] p-4 font-['Poppins']">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-12 z-10"
      >
        <h1 className="text-7xl sm:text-8xl font-extralight tracking-wide">
          <PuzzleWord word="ArgueMate" />
        </h1>
        <motion.p
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-xl sm:text-2xl font-light tracking-wide"
        >
          A new perspective on dating
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xl sm:text-2xl font-light tracking-wide"
        >
          Fix together to fit together
        </motion.p>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-3xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <FeatureIcon Icon={Heart} text="Find your perfect match" />
        <FeatureIcon Icon={MessageCircle} text="Meaningful conversations" />
        <FeatureIcon Icon={Users} text="Build lasting relationships" />
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 235, 208, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        onClick={() => router.push('/login')}
        className="mt-12 px-16 py-5 bg-transparent text-[#FFEBD0] text-xl sm:text-2xl 
                   font-light tracking-wider uppercase
                   transition-all duration-300 ease-in-out
                   hover:bg-[#FFEBD0]/10
                   relative
                   border-2 border-[#FFEBD0] rounded-full
                   overflow-hidden"
      >
        <span className="relative z-10">Find Love</span>
        <motion.div
          className="absolute inset-0 bg-[#FFEBD0]"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </div>
  );
}

