import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-6">
      <Link href="/" className="text-2xl font-light">
        ArgueMate
      </Link>
      <nav className="flex gap-8 items-center">
        <Link href="/about" className="hover:opacity-80">
          About
        </Link>
        <Link href="/signup" className="hover:opacity-80">
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default Header;

