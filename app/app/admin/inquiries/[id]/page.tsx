import { use } from "react"
import { notFound } from "next/navigation"
import { pool } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface InquiryPageProps {
  params: Promise<{ id: string }>
}

async function getInquiry(id: string) {
  try {
    const result = await pool.query(
      `SELECT i.*, p.title as property_title, p.slug as property_slug
       FROM inquiries i
       LEFT JOIN properties p ON i.property_id = p.id
       WHERE i.id = $1`,
      [id]
    )
    
    if (result.rows.length === 0) {
      return null
    }
    
    return result.rows[0]
  } catch (error) {
    console.error("Error fetching inquiry:", error)
    return null
  }
}

export default function InquiryPage({ params }: InquiryPageProps) {
  const { id } = use(params)
  const inquiry = use(getInquiry(id))

  if (!inquiry) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Заявка #{inquiry.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Дата создания</h3>
              <p className="mt-1">{formatDate(inquiry.created_at)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Имя</h3>
              <p className="mt-1">{inquiry.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{inquiry.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Телефон</h3>
              <p className="mt-1">{inquiry.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Сообщение</h3>
              <p className="mt-1">{inquiry.message}</p>
            </div>
            
            {inquiry.property_title && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Объект недвижимости</h3>
                <p className="mt-1">
                  <a 
                    href={`/admin/properties/${inquiry.property_slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {inquiry.property_title}
                  </a>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 