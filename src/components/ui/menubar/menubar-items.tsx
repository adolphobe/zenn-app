
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { ChevronRight } from "lucide-react"
import { cn, dropdownStyles } from "@/lib/utils"

// This address the TypeScript error by handling the "checked" prop correctly
interface MenubarCheckboxItemProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> {
  checked?: boolean;
}

interface MenubarRadioItemProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> {
  checked?: boolean;
}

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      dropdownStyles.item,
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  MenubarCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      dropdownStyles.item,
      "relative pr-3",
      checked && dropdownStyles.itemSelected,
      className
    )}
    {...props}
  >
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  MenubarRadioItemProps
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      dropdownStyles.item,
      "relative pr-3",
      checked && dropdownStyles.itemSelected,
      className
    )}
    {...props}
  >
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      dropdownStyles.item,
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

export {
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarSubTrigger
}
