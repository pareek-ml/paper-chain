// frontend/src/components/ui/avatar.tsx
"use client";

import * as React from "react";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={
        "relative inline-flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200 " +
        className
      }
      {...props}
    >
      {children}
    </span>
  )
);

Avatar.displayName = "Avatar";

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className = "", ...props }, ref) => (
    <img
      ref={ref}
      className={"h-full w-full object-cover " + className}
      {...props}
    />
  )
);

AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  AvatarFallbackProps
>(({ className = "", children, ...props }, ref) => (
  <span
    ref={ref}
    className={
      "flex h-full w-full items-center justify-center text-xs font-medium text-gray-600 " +
      className
    }
    {...props}
  >
    {children}
  </span>
));

AvatarFallback.displayName = "AvatarFallback";

export default Avatar;