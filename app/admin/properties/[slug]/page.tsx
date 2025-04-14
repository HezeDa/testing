"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { PropertyForm } from "@/components/property-form"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EditPropertyPage({ params }: PageProps) {
  const { slug } = use(params)

  if (!slug) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Редактировать объект</h1>
      </div>
      <PropertyForm slug={slug} />
    </div>
  )
} 