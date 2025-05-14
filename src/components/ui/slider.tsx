
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
    <div className="absolute top-[9px] z-10 w-full flex justify-between px-[10px] pointer-events-none">
      {[1, 2, 3, 4, 5].map((step) => (
        <div
          key={step}
          className="w-[21px] h-[21px] rounded-full bg-white opacity-75 border-2 border-gray-300"
          aria-hidden="true"
        />
      ))}
    </div>
    <SliderPrimitive.Track className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", classNames?.track)}>
      <SliderPrimitive.Range className={cn("absolute h-full bg-primary", classNames?.range)} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn(
      "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background",
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50 z-20",
      classNames?.thumb
    )} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
