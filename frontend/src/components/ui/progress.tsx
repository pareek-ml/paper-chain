// frontend/src/components/ui/progress.tsx
"use client";

import * as React from "react";

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0–100
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800 " +
          className
        }
        {...props}
      >
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;