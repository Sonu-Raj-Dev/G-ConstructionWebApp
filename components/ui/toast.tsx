"use client";

import type * as React from "react"
import { forwardRef, useState, useEffect, useRef } from "react"

import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
  variant?: "default" | "destructive"
  duration?: number
  onClose?: () => void
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, action, className, variant, duration = 3000, onClose }, ref) => {
    const [open, setOpen] = useState(true)
    const timerRef = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
      if (open) {
        timerRef.current = setTimeout(() => {
          setOpen(false)
          onClose?.()
        }, duration)
      }

      return () => {
        clearTimeout(timerRef.current)
      }
    }, [open, duration, onClose])

    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-full md:w-auto",
          variant === "destructive"
            ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50"
            : "border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
          className,
        )}
      >
        <div className="flex w-full flex-col gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {action && <>{action}</>}
        <Button
          variant="ghost"
          className="absolute right-2 top-2 rounded-md opacity-0 transition-opacity hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground group-hover:opacity-100"
          onClick={() => {
            setOpen(false)
            onClose?.()
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    )
  },
)

Toast.displayName = "Toast"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ToastViewport = () => {
  return <></>
}

const ToastTitle = () => {
  return <></>
}

const ToastDescription = () => {
  return <></>
}

const ToastClose = () => {
  return <></>
}

const ToastAction = () => {
  return <></>
}

type ToastActionElement = React.ReactNode

export {
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
  type ToastActionElement,
  Toast,
}
