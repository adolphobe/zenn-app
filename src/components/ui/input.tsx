
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, autoFocus, ...props }, ref) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // On mobile devices, we explicitly prevent autofocus to avoid keyboard popping up
    const shouldAutoFocus = isMobile ? false : autoFocus;
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base transition-colors focus:outline-none focus:border-[#8eceea] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        autoFocus={shouldAutoFocus}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
