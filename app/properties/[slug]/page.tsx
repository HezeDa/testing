import { Metadata } from "next"
import { notFound } from "next/navigation"
import { pool } from "@/lib/db"
import PropertyDetails from "@/components/property-details"

interface PropertyPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await params

  try {
    const result = await pool.query(
      `SELECT p.title, p.description, pi.url as featured_image
       FROM properties p
       LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
       WHERE p.slug = $1`,
      [slug]
    )

    console.log('📊 Результат запроса метаданных:', {
      slug,
      found: result.rows.length > 0,
      rowCount: result.rows.length 
    })

    if (result.rows.length === 0) {
      console.log('❌ Объект не найден')
      return {
        title: "Объект не найден",
        description: "Запрошенный объект недвижимости не существует"
      }
    }

    const property = result.rows[0]
    console.log('✅ Метаданные получены:', property)

    return {
      title: property.title,
      description: property.description,
      openGraph: {
        title: property.title,
        description: property.description,
        images: property.featured_image ? [property.featured_image] : [],
      },
    }
  } catch (error) {
    console.error("❌ Ошибка при получении метаданных:", error)
    return {
      title: "Ошибка",
      description: "Произошла ошибка при загрузке объекта"
    }
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  console.log('📄 Рендеринг страницы объекта')
  console.log('📌 Параметры:', { slug: params.slug })
  
  try {
    const result = await pool.query(
      `SELECT 
        p.*,
        json_agg(
          json_build_object(
            'id', pi.id,
            'url', pi.url,
            'alt', pi.alt,
            'is_primary', pi.is_primary
          )
        ) as images
       FROM properties p
       LEFT JOIN property_images pi ON p.id = pi.property_id
       WHERE p.slug = $1
       GROUP BY p.id`,
      [params.slug]
    )

    console.log('📊 Результат запроса объекта:', { 
      found: result.rows.length > 0,
      rowCount: result.rows.length 
    })

    if (result.rows.length === 0) {
      console.log('❌ Объект не найден')
      notFound()
    }

    const property = result.rows[0]
    // Преобразуем строку JSON в массив объектов и фильтруем null значения
    property.images = property.images.filter((img: { id: number | null }) => img.id !== null)
    console.log('✅ Объект получен:', property)

    return (
      <div className="py-8 md:py-12">
        <div className="container">
          <PropertyDetails property={property} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("❌ Ошибка при загрузке объекта:", error)
    throw error
  }
}
