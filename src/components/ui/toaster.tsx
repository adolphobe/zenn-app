
import { Toaster as HookToaster } from "@/hooks/use-toast"
import { ToastProvider } from "@/components/ui/toast"
import { ToastContext } from "@/hooks/use-toast-context"

export function Toaster() {
  return (
    <ToastProvider>
      <HookToaster />
    </ToastProvider>
  )
}
