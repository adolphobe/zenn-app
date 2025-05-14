
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    classNames?: {
      track?: string;
      range?: string;
      thumb?: string;
    }
  }
>(({ className, classNames, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", classNames?.track)}>
      <SliderPrimitive.Range className={cn("absolute h-full bg-primary", classNames?.range)} />
      
      {/* Step markers - adding more visible dividers for steps */}
      <div className="absolute inset-0 flex justify-between px-[10px] pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-[3px] h-full bg-white/70 rounded-full border border-gray-300"
            style={{ transform: i === 0 || i === 4 ? 'translateX(0)' : 'translateX(0)' }}
          />
        ))}
      </div>
    </SliderPrimitive.Track>
    
    <SliderPrimitive.Thumb className={cn(
      "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background",
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      classNames?.thumb
    )} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
