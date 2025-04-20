"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import crypto from "crypto"

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// Register a new user
export async function registerUser(formData: FormData) {
  try {
    await connectToDatabase()

    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as "Admin" | "Manager" | "Supervisor"
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    // Check if username already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return { success: false, error: "Username already exists" }
    }

    // Create new user with hashed password
    const newUser = new User({
      username,
      password: hashPassword(password),
      name,
      role,
      email,
      phone,
    })

    await newUser.save()

    return { success: true }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, error: "Failed to register user" }
  }
}

// Login user
export async function loginUser(formData: FormData) {
  try {
    await connectToDatabase()

    const username = formData.get("username") as string
    const password = formData.get("password") as string

    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      return { success: false, error: "Invalid username or password" }
    }

    // Check password
    if (user.password !== hashPassword(password)) {
      return { success: false, error: "Invalid username or password" }
    }

    // Set session cookie
    const sessionId = crypto.randomUUID()
    cookies().set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Store user info in another cookie for easy access
    // Serialize the user object to avoid passing MongoDB objects
    const serializedUser = {
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      role: user.role,
    }

    cookies().set("user", JSON.stringify(serializedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, user: serializedUser }
  } catch (error) {
    console.error("Error logging in:", error)
    return { success: false, error: "Failed to log in" }
  }
}

// Logout user
export async function logoutUser() {
  cookies().delete("session")
  cookies().delete("user")
  redirect("/login")
}

// Check if user is authenticated
export async function getUser() {
  const userCookie = cookies().get("user")
  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch {
    return null
  }
}
