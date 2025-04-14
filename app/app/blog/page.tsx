import { Metadata } from "next"
import { pool } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Блог | Cyprus Elite Estates",
  description: "Полезные статьи о недвижимости на Кипре, инвестициях, налогах и жизни на острове.",
}

async function getArticles() {
  const result = await pool.query(`
    SELECT 
      ba.*,
      bc.name as category_name,
      bc.slug as category_slug,
      u.name as author_name
    FROM blog_articles ba
    LEFT JOIN blog_categories bc ON ba.category_id = bc.id
    LEFT JOIN users u ON ba.author_id = u.id
    WHERE ba.status = 'published'
    ORDER BY ba.created_at DESC
  `)

  return result.rows
}

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">Блог</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group">
              <div className="flex flex-col rounded-lg border bg-white overflow-hidden shadow-sm transition-all hover:shadow-md h-full">
                <div className="relative h-48 w-full">
                  <Image
                    src={article.featured_image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-estate-gold text-white text-xs font-medium px-2 py-1 rounded">
                    {article.category_name}
                  </div>
                </div>
                <div className="flex flex-col p-4 flex-grow">
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(article.created_at).toLocaleDateString('ru-RU')}
                  </p>
                  <h3 className="font-playfair text-lg font-bold mb-2 line-clamp-2 group-hover:text-estate-gold">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-[#0077B6] text-sm font-medium mt-auto">
                    Читать далее
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

