import { Metadata } from "next"
import { notFound } from "next/navigation"
import { pool } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BlogArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await params

  const { rows } = await pool.query(
    `SELECT title, excerpt, featured_image
     FROM blog_articles
     WHERE slug = $1`,
    [slug]
  )

  console.log('📊 Результат запроса метаданных:', {
    slug,
    rows: rows.length,
    title: rows[0]?.title,
    excerpt: rows[0]?.excerpt,
    featured_image: rows[0]?.featured_image
  })

  if (rows.length === 0) {
    return {
      title: 'Статья не найдена',
      description: 'Запрошенная статья не существует или была удалена',
    }
  }

  const article = rows[0]

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [article.featured_image] : [],
    },
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  console.log('📄 Рендеринг страницы статьи')
  console.log('📌 Параметры:', { slug: params.slug })
  
  try {
    const result = await pool.query(
      `SELECT * FROM blog_articles WHERE slug = $1`,
      [params.slug]
    )

    console.log('📊 Результат запроса статьи:', { 
      found: result.rows.length > 0,
      rowCount: result.rows.length 
    })

    if (result.rows.length === 0) {
      console.log('❌ Статья не найдена')
      notFound()
    }

    const article = result.rows[0]
    console.log('✅ Статья получена:', article)

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к блогу
              </Link>
            </Button>
            
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <span>{article.author_name}</span>
              <span>•</span>
              <span>{new Date(article.created_at).toLocaleDateString('ru-RU')}</span>
              <span>•</span>
              <Link 
                href={`/blog/category/${article.category_slug}`}
                className="hover:text-primary"
              >
                {article.category_name}
              </Link>
            </div>
          </div>

          {article.featured_image && (
            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={article.featured_image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.related_articles && article.related_articles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Похожие статьи</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {article.related_articles.map((related: any) => (
                  <Link 
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group"
                  >
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={related.featured_image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {new Date(related.date).toLocaleDateString('ru-RU')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("❌ Ошибка при загрузке статьи:", error)
    throw error
  }
}
