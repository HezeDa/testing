"use client"

import { useEffect, useState } from "react"
import { BlogForm } from "@/components/blog/blog-form"
import { toast } from "sonner"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

interface ArticleData {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: number
  status: "draft" | "published"
  featured: boolean
  featured_image?: string
  published_at?: string
}

export default function EditBlogPage({ params }: PageProps) {
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const routeParams = await params
        const response = await fetch(`/api/admin/blog/${routeParams.slug}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Ошибка при загрузке статьи")
        }

        setArticle(data.data)
      } catch (error) {
        console.error("Ошибка при загрузке статьи:", error)
        toast.error("Ошибка при загрузке статьи")
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [params])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Редактирование статьи</h1>
          </div>
          <div>Загрузка...</div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container py-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Редактирование статьи</h1>
          </div>
          <div>Статья не найдена</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Редактирование статьи</h1>
        </div>
        <BlogForm initialData={article} />
      </div>
    </div>
  )
} 