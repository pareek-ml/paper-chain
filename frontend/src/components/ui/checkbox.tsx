// frontend/src/components/ui/checkbox.tsx
"use client";

import * as React from "react";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className = "", checked, defaultChecked, onCheckedChange, ...props },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked ?? false
    );
    const isControlled = checked !== undefined;
    const value = isControlled ? !!checked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    };

    return (
      <input
        ref={ref}
        type="checkbox"
        className={
          "h-4 w-4 rounded border border-gray-300 text-blue-600 " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
          "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " +
          className
        }
        checked={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;