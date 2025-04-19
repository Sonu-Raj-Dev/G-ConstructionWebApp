"use server"

import { revalidatePath } from "next/cache"
import connectToDatabase from "@/lib/mongodb"
import Project from "@/models/Project"

// Generate a unique project ID
async function generateProjectId() {
  await connectToDatabase()

  const count = await Project.countDocuments()
  const nextNumber = count + 1
  return `PRJ-${nextNumber.toString().padStart(4, "0")}`
}

// Create a new project
export async function createProject(formData: FormData) {
  try {
    await connectToDatabase()

    const projectId = await generateProjectId()

    const newProject = new Project({
      projectId,
      siteName: formData.get("siteName"),
      siteAddress: formData.get("siteAddress"),
      clientName: formData.get("clientName"),
      clientContact: formData.get("clientContact"),
      totalPaymentAgreed: Number.parseFloat(formData.get("totalPaymentAgreed") as string),
      startDate: formData.get("startDate") ? new Date(formData.get("startDate") as string) : null,
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : null,
      status: "Pending",
    })

    await newProject.save()

    revalidatePath("/dashboard/projects")
    revalidatePath("/dashboard")

    return { success: true, projectId }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: "Failed to create project" }
  }
}

// Get all projects
export async function getProjects() {
  try {
    await connectToDatabase()

    const projects = await Project.find().sort({ createdAt: -1 })

    return { success: true, projects: JSON.parse(JSON.stringify(projects)) }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return { success: false, error: "Failed to fetch projects" }
  }
}

// Get a project by ID
export async function getProjectById(id: string) {
  try {
    await connectToDatabase()

    const project = await Project.findById(id)

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    return { success: true, project: JSON.parse(JSON.stringify(project)) }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { success: false, error: "Failed to fetch project" }
  }
}

// Get dashboard stats
export async function getDashboardStats() {
  try {
    await connectToDatabase()

    const totalProjects = await Project.countDocuments()
    const activeProjects = await Project.countDocuments({ status: "Active" })
    const completedProjects = await Project.countDocuments({ status: "Completed" })
    const pendingProjects = await Project.countDocuments({ status: "Pending" })

    // Calculate total payments
    const projects = await Project.find()
    const totalPaymentReceived = projects.reduce((sum, project) => sum + (project.paymentReceived || 0), 0)

    return {
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        pendingProjects,
        totalPaymentReceived,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return { success: false, error: "Failed to fetch dashboard stats" }
  }
}

// Update a project
export async function updateProject(id: string, formData: FormData) {
  try {
    await connectToDatabase()

    const project = await Project.findById(id)

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    project.siteName = formData.get("siteName") as string
    project.siteAddress = formData.get("siteAddress") as string
    project.clientName = formData.get("clientName") as string
    project.clientContact = formData.get("clientContact") as string
    project.totalPaymentAgreed = Number.parseFloat(formData.get("totalPaymentAgreed") as string)
    project.startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : null
    project.endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : null
    project.status = formData.get("status") as "Pending" | "Active" | "Completed" | "Cancelled"

    await project.save()

    revalidatePath("/dashboard/projects")
    revalidatePath(`/dashboard/projects/${id}`)
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: "Failed to update project" }
  }
}
