import { AdminSidebar } from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutWrapper>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar isAuthenticated={true} />
        <div className="transition-all duration-500 ease-in-out">
          <AdminHeader />
          <main className="transition-all duration-500 ease-in-out">
            <div className="px-4 py-6 lg:ml-64 lg:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminLayoutWrapper>
  )
}
