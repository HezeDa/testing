"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Property, BlogArticle } from "@/types"
import { formatPrice } from "@/lib/utils"

interface DashboardStats {
  properties: {
    stats: {
      total: number
      active: number
      featured: number
      avg_price: number
      min_price: number
      max_price: number
    }
    recent: Property[]
  }
  blog: {
    stats: {
      total_articles: number
      published: number
      featured: number
      categories: number
    }
    recent: BlogArticle[]
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || "Ошибка при загрузке данных")
        }
        
        setStats(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Панель управления</h1>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего объектов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.properties.stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.properties.stats.active} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средняя цена</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.properties.stats.avg_price)}</div>
            <p className="text-xs text-muted-foreground">
              от {formatPrice(stats.properties.stats.min_price)} до {formatPrice(stats.properties.stats.max_price)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Статьи блога</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blog.stats.total_articles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.blog.stats.published} опубликовано
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Категории</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blog.stats.categories}</div>
            <p className="text-xs text-muted-foreground">
              {stats.blog.stats.featured} избранных статей
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Последние объекты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.properties.recent.map((property) => (
                <div key={property.id} className="flex items-center space-x-4">
                  <img
                    src={property.image_url || "/placeholder.svg"}
                    alt={property.title}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{property.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Последние статьи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.blog.recent.map((article) => (
                <div key={article.id} className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{article.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {article.category_name} • {article.author_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
