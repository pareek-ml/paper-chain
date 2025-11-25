// frontend/src/components/ui/tooltip.tsx
"use client";

import * as React from "react";

type TooltipContextType = {
  content: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const TooltipContext = React.createContext<TooltipContextType | null>(null);

export interface TooltipProviderProps {
  children?: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
}) => <>{children}</>;

export interface TooltipProps {
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>(null);

  return (
    <TooltipContext.Provider value={{ open, setOpen, content }}>
      {children}
      {open && content && (
        <div className="pointer-events-none fixed z-50 translate-x-2 translate-y-2 rounded-md bg-black px-2 py-1 text-xs text-white shadow-lg">
          {content}
        </div>
      )}
    </TooltipContext.Provider>
  );
};

export interface TooltipTriggerProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  children,
  asChild,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) {
    return (
      <span {...props}>
        {children}
      </span>
    );
  }

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    ctx.setOpen(true);
    onMouseEnter?.(e);
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    ctx.setOpen(false);
    onMouseLeave?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      onMouseEnter: handleEnter,
      onMouseLeave: handleLeave,
      ...props,
    });
  }

  return (
    <span onMouseEnter={handleEnter} onMouseLeave={handleLeave} {...props}>
      {children}
    </span>
  );
};

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const TooltipContent: React.FC<TooltipContentProps> = ({
  children,
  ...props
}) => {
  const ctx = React.useContext(TooltipContext);
  React.useEffect(() => {
    if (!ctx) return;
    ctx.content = children;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  // We render nothing here; the actual content is rendered in <Tooltip /> overlay.
  return <div {...props} style={{ display: "none" }} />;
};