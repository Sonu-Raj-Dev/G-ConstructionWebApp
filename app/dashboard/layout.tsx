
import type React from "react"
import { Suspense } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getUser } from "@/app/actions/auth"
import { Loader } from "@/components/ui/loader"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="flex flex-1 flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <Suspense fallback={<Loader className="py-10" text="Loading..." />}>{children}</Suspense>
        </main>
      </div>
      <Footer />
    </div>
  )
}
