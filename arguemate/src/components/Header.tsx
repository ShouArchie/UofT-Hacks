import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-6">
      <Link href="/" className="text-2xl font-light">
        ArgueMate
      </Link>
    </header>
  );
};

export default Header;
