"use server"

import { revalidatePath } from "next/cache"
import connectToDatabase from "@/lib/mongodb"
import Payment from "@/models/Payment"
import Project from "@/models/Project"

// Generate a unique transaction ID
async function generateTransactionId() {
  await connectToDatabase()

  const count = await Payment.countDocuments()
  const nextNumber = count + 1
  return `TRX-${nextNumber.toString().padStart(4, "0")}`
}

// Create a new payment
export async function createPayment(formData: FormData) {
  try {
    await connectToDatabase()

    const transactionId = await generateTransactionId()
    const type = formData.get("type") as "Received" | "Paid"
    const projectId = formData.get("projectId") as string
    const amount = Number.parseFloat(formData.get("amount") as string)

    const newPayment = new Payment({
      transactionId,
      type,
      project: projectId || null,
      employee: formData.get("employeeId") || null,
      amount,
      paymentMode: formData.get("paymentMode"),
      description: formData.get("description"),
      date: new Date(formData.get("date") as string),
      status: "Completed",
    })

    await newPayment.save()

    // If it's a payment received for a project, update the project's paymentReceived
    if (type === "Received" && projectId) {
      const project = await Project.findById(projectId)
      if (project) {
        project.paymentReceived += amount
        await project.save()
      }
    }

    revalidatePath("/dashboard/reports")
    revalidatePath("/dashboard")

    return { success: true, transactionId }
  } catch (error) {
    console.error("Error creating payment:", error)
    return { success: false, error: "Failed to create payment" }
  }
}

// Get all payments
export async function getPayments() {
  try {
    await connectToDatabase()

    const payments = await Payment.find().populate("project").populate("employee").sort({ date: -1 })

    return { success: true, payments: JSON.parse(JSON.stringify(payments)) }
  } catch (error) {
    console.error("Error fetching payments:", error)
    return { success: false, error: "Failed to fetch payments" }
  }
}
