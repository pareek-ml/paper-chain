// frontend/src/components/ui/tabs.tsx
"use client";

import * as React from "react";

type TabsContextType = {
  value: string;
  setValue: (val: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? ""
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as string) : internalValue;

  const setValue = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList: React.FC<TabsListProps> = ({
  className = "",
  ...props
}) => (
  <div
    className={
      "inline-flex h-9 items-center justify-center rounded-md bg-gray-100 p-1 " +
      "text-gray-600 dark:bg-neutral-900 dark:text-neutral-200 " +
      className
    }
    {...props}
  />
);

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  className = "",
  value,
  children,
  ...props
}) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    return (
      <button type="button" className={className} {...props}>
        {children}
      </button>
    );
  }

  const selected = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm " +
        "transition-colors focus-visible:outline-none " +
        (selected
          ? "bg-white text-gray-900 shadow dark:bg-neutral-800 dark:text-neutral-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800") +
        " " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  className = "",
  value,
  children,
  ...props
}) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;

  return (
    <div
      className={"mt-3 focus-visible:outline-none " + className}
      {...props}
    >
      {children}
    </div>
  );
};

export default Tabs;