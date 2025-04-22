import { getUser } from "@/app/actions/auth"
import { UserProfile } from "@/components/profile/user-profile"
import { redirect } from "next/navigation"
import { getUserDetails } from "@/app/actions/user"

export default async function ProfilePage() {
  const user = await getUser()
  
  if (!user) {
    redirect("/login")
  }
  
  // Get detailed user information from the database
  const userDetails = await getUserDetails(user.id)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
      </div>
      {userDetails.success ? (
        <UserProfile user={userDetails.user} />
      ) : (
        <p className="text-red-500">Error loading user profile: {userDetails.error}</p>
      )}
    </div>
  )
}
