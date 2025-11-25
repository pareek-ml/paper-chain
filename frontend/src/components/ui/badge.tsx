// frontend/src/components/ui/badge.tsx
"use client";

import * as React from "react";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    let base =
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold " +
      "transition-colors";

    let variantClasses = "";
    switch (variant) {
      case "secondary":
        variantClasses =
          "border-transparent bg-gray-200 text-gray-800 dark:bg-neutral-800 dark:text-neutral-100";
        break;
      case "outline":
        variantClasses = "border-gray-300 text-gray-800 dark:border-neutral-700";
        break;
      default:
        variantClasses =
          "border-transparent bg-blue-600 text-white dark:bg-blue-500";
    }

    return (
      <span
        ref={ref}
        className={`${base} ${variantClasses} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;