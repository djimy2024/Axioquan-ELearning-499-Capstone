import React from "react";

interface SocialButtonProps {
  label: string; // Eg: "Sign in with Google"
  icon: React.ReactNode; // Icon JSX, ex: <FaGoogle />
  onClick: () => void;
  className?: string; // Opsyonèl pou style custom
}

const SocialButton: React.FC<SocialButtonProps> = ({ label, icon, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition ${className}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default SocialButton;

