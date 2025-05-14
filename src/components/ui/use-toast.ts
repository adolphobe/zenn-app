
import * as React from "react"
import { createContext, useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"

type ToastProps = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

type ToastActionElement = React.ReactElement

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
  open: boolean
  promise: boolean
}

type ToastContextType = {
  toasts: ToasterToast[]
  addToast: (toast: ToastProps) => void
  removeToast: (id: string) => void
  updateToast: (id: string, toast: Partial<ToastProps>) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    const toasts: ToasterToast[] = []
    
    const addToast = (toast: ToastProps) => {
      // This is just a stub to prevent errors when useToast is imported directly
    }
    
    const removeToast = (id: string) => {
      // This is just a stub to prevent errors when useToast is imported directly
    }
    
    const updateToast = (id: string, toast: Partial<ToastProps>) => {
      // This is just a stub to prevent errors when useToast is imported directly
    }
    
    return {
      toasts,
      addToast,
      removeToast,
      updateToast,
    }
  }

  return context
}

function toast(props: ToastProps) {
  const { addToast } = useToast()
  // Ensure there is an ID by generating one if not provided
  addToast({
    ...props,
    id: props.id || uuidv4()
  })
}

export {
  type ToastProps,
  type ToastActionElement,
  useToast,
  toast,
}
