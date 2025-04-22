import { getUser } from "@/app/actions/auth"
import { UserSettings } from "@/components/settings/user-settings"
import { redirect } from "next/navigation"
import { getUserDetails } from "@/app/actions/user"

export default async function SettingsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  // Get detailed user information from the database
  const userDetails = await getUserDetails(user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
      </div>
      {userDetails.success ? (
        <UserSettings user={userDetails.user} />
      ) : (
        <p className="text-red-500">Error loading user settings: {userDetails.error}</p>
      )}
    </div>
  )
}
