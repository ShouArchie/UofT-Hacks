"use client";
import React from "react";

type ButtonOrAnchorProps =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

const Button: React.FC<ButtonOrAnchorProps> = ({
  children,
  className = "",
  href,
  ...props
}) => {
  const baseClassName = `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClassName} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseClassName} {...props}>
      {children}
    </button>
  );
};

const Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  ...props
}) => <a {...props}>{children}</a>;

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FF8D58] text-[#FFEBD0] font-['Poppins',sans-serif]">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-light">
          ArgueMate
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/about" className="hover:opacity-80">
            About
          </Link>
          <Link href="/signup" className="hover:opacity-80">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 -mt-20">
        <h1 className="text-6xl md:text-8xl font-light text-center">
          ArgueMate
        </h1>
        <p className="text-xl md:text-2xl font-light italic text-center">
          A new perspective on dating
        </p>
        <Button
          href="/login"
          className="mt-8 px-8 py-6 text-[#FF8D58] bg-[#FFEBD0] hover:bg-[#FFE0B5] text-lg rounded-full"
        >
          FIND LOVE
        </Button>
      </main>
    </div>
  );
}
