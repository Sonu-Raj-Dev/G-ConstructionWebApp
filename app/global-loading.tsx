"use client";
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader } from "@/components/ui/loader"

export function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Add event listeners for route changes
    window.addEventListener("beforeunload", handleStart)
    window.addEventListener("load", handleComplete)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
      window.removeEventListener("load", handleComplete)
    }
  }, [])

  // Reset loading state when the route changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  return isLoading ? <Loader fullScreen text="Loading..." /> : null
}

export default GlobalLoading
