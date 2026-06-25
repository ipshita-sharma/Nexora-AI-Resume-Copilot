"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn("focus-ring h-10 w-full rounded-md border bg-background px-3 py-2 text-sm", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export { Select };
