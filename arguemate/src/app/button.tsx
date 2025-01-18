import React from "react";

interface ButtonProps {
  text: string;
  href: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, href, onClick }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded-md hover:bg-[#FFD0A0] transition duration-300"
    >
      {text}
    </a>
  );
};

export default Button;
