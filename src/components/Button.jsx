import React from "react";

const Button = ({ children, onClick, variant = "primary", className = "" }) => {
  const baseClasses = "font-medium py-2 px-6 rounded-full transition-colors";

  const variantClasses = {
    primary: "bg-[#f79d7f] hover:bg-[#f58b67] text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline:
      "bg-transparent border border-[#f79d7f] text-[#f79d7f] hover:bg-[#fff5e6]",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
