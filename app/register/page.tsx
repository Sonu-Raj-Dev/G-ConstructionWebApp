import { RegisterForm } from "@/components/auth/register-form"
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  // Check if user is already logged in
  const user = await getUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
