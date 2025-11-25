// frontend/src/components/ui/skeleton.tsx
"use client";

import * as React from "react";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={
        "animate-pulse rounded-md bg-gray-200 dark:bg-neutral-800 " +
        className
      }
      {...props}
    />
  )
);

Skeleton.displayName = "Skeleton";

export default Skeleton;