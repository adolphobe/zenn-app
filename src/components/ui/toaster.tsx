
import { Toaster as HookToaster } from "@/hooks/use-toast"
import { ToastProvider } from "@/components/ui/toast"

export function Toaster() {
  return (
    <ToastProvider>
      <HookToaster />
    </ToastProvider>
  )
}
