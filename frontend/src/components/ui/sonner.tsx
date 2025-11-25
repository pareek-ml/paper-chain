"use client";

import { Toaster as Sonner, toast } from "sonner";
import React from "react";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      richColors
      closeButton
      className="text-sm font-medium"
    />
  );
}

export { toast };