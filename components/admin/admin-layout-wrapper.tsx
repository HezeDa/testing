"use client"

import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { useEffect, useState } from "react"

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {children}
    </>
  )
} 