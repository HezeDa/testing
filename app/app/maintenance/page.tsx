import { Settings } from "@/lib/types/settings"
import { pool } from "@/lib/db"

async function getSettings(): Promise<Settings> {
  try {
    const result = await pool.query(
      `SELECT * FROM settings WHERE id = 1`
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {
      site_name: "Cyprus Elite Estates",
      contact_email: "",
      contact_phone: "",
      address: "",
      meta_description: "",
      meta_keywords: "",
      maintenance_mode: true
    }
  }
}

export default async function MaintenancePage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {settings.site_name}
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Сайт находится в режиме обслуживания
          </h2>
          <p className="text-gray-500">
            В данный момент мы проводим технические работы. Пожалуйста, вернитесь позже.
          </p>
          {settings.contact_email && (
            <p className="mt-4 text-sm text-gray-500">
              По всем вопросам пишите на{" "}
              <a
                href={`mailto:${settings.contact_email}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {settings.contact_email}
              </a>
            </p>
          )}
          {settings.contact_phone && (
            <p className="mt-2 text-sm text-gray-500">
              или звоните{" "}
              <a
                href={`tel:${settings.contact_phone}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {settings.contact_phone}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 