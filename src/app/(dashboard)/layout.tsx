import { Navbar } from '@/components/ui/navigation/Navbar'
import { Sidebar } from '@/components/ui/navigation/Sidebar'
import { RestaurantProvider } from '@/context/RestaurantContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RestaurantProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </RestaurantProvider>
  )
}
