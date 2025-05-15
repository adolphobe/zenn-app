
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn, dropdownStyles } from "@/lib/utils"

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  // Extract the selected prop safely
  const { selected, ...restProps } = props as { selected?: boolean } & typeof props;
  
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        dropdownStyles.item,
        "relative pl-3 pr-3",
        selected && dropdownStyles.itemSelected,
        className
      )}
      {...restProps}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
})
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  SelectItem
}
