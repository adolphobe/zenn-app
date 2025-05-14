
import * as React from "react"
import { cn } from "@/lib/utils"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import {
  useToast as useToastOriginal,
  type ToastProps,
  type ToastActionElement,
  toast,
} from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToastOriginal()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export const useToast = useToastOriginal;

export {
  type ToastProps,
  type ToastActionElement,
  toast,
}
