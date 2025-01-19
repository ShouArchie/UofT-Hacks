'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-#FF8D58">
      <div className="text-[#FFEBD0] text-4xl font-light animate-pulse">
        Loading...
      </div>
    </div>
  );
}

