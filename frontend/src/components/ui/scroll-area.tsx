// frontend/src/components/ui/scroll-area.tsx
"use client";

import * as React from "react";

export interface ScrollAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  className = "",
  viewportClassName = "",
  children,
  ...props
}) => {
  return (
    <div
      className={
        "relative overflow-hidden " + className
      }
      {...props}
    >
      <div
        className={
          "h-full w-full overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full " +
          "[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 " +
          viewportClassName
        }
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollArea;