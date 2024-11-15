"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  appName?: string;
}

export const Button = ({ onClick, children, appName }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
    >
      {appName && <span>{appName}</span>} // Add this line
      {children}
    </button>
  );
};
