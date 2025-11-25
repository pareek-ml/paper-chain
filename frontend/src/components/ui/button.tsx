"use client";

import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    let base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
      "disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2";

    let variantClasses = "";
    switch (variant) {
      case "outline":
        variantClasses = "border border-gray-300 bg-white text-gray-900";
        break;
      case "ghost":
        variantClasses = "bg-transparent hover:bg-gray-100 text-gray-900";
        break;
      default:
        variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variantClasses} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;