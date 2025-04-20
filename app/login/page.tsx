import { Suspense } from "react"
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage() {
  // Check if user is already logged in
  const user = await getUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
