
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent dropdown styling helper
export const dropdownStyles = {
  trigger: "px-4 py-2.5 flex items-center justify-between rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=open]:bg-blue-50 data-[state=open]:text-blue-600 dark:data-[state=open]:bg-blue-900/20 dark:data-[state=open]:text-blue-400",
  content: "bg-white dark:bg-gray-800 p-1.5 border rounded-md shadow-md z-50",
  item: "relative flex cursor-default select-none items-center rounded-sm px-3 py-2.5 text-sm outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  itemSelected: "bg-blue-700 text-white hover:bg-blue-800 hover:text-white dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800 dark:hover:text-white",
  label: "px-3 py-2 text-sm font-medium",
  separator: "-mx-1 my-1.5 h-px bg-muted"
}
