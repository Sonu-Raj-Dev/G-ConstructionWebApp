"use server"

import { cookies } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import crypto from "crypto"

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// Get user details from database
export async function getUserDetails(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Convert to plain object and serialize
    const userObj = JSON.parse(JSON.stringify(user))

    return { success: true, user: userObj }
  } catch (error) {
    console.error("Error fetching user details:", error)
    return { success: false, error: "Failed to fetch user details" }
  }
}

// Update user profile
export async function updateUserProfile(formData: FormData) {
  try {
    await connectToDatabase()

    const userId = formData.get("userId") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    const user = await User.findById(userId)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Update user fields
    user.name = name
    user.email = email
    user.phone = phone

    await user.save()

    // Update user cookie with new information
    const userCookie = cookies().get("user")
    if (userCookie) {
      const userData = JSON.parse(userCookie.value)
      userData.name = name

      cookies().set("user", JSON.stringify(userData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update user profile" }
  }
}

// Update user password
export async function updateUserPassword(currentPassword: string, newPassword: string) {
  try {
    await connectToDatabase()

    // Get user ID from cookie
    const userCookie = cookies().get("user")
    if (!userCookie) {
      return { success: false, error: "User not authenticated" }
    }

    const userData = JSON.parse(userCookie.value)
    const userId = userData.id

    const user = await User.findById(userId)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Verify current password
    if (user.password !== hashPassword(currentPassword)) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Update password
    user.password = hashPassword(newPassword)
    await user.save()

    return { success: true }
  } catch (error) {
    console.error("Error updating user password:", error)
    return { success: false, error: "Failed to update password" }
  }
}
