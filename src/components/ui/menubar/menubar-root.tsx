
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { cn } from "@/lib/utils"

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1.5",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-blue-50 data-[state=open]:text-blue-600 dark:data-[state=open]:bg-blue-900/20 dark:data-[state=open]:text-blue-400",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup,
}
