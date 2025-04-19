"use server"

import { revalidatePath } from "next/cache"
import connectToDatabase from "@/lib/mongodb"
import Attendance from "@/models/Attendance"
import Payment from "@/models/Payment"
import mongoose from "mongoose"

// Mark attendance
export async function markAttendance(formData: FormData) {
  debugger;
  try {
    await connectToDatabase()
    debugger;
    const employeeId = formData.get("employeeId")
    const projectId = formData.get("projectId")
    const status = formData.get("status") as "Present" | "Absent" | "Half Day"
    const paymentGiven = formData.get("paymentGiven") === "true"
    const paymentAmount = paymentGiven ? Number.parseFloat(formData.get("paymentAmount") as string) : 0
    const paymentType = formData.get("paymentType") as "Cash" | "Bank Transfer" | "UPI" | "Other"
    const date = new Date(formData.get("date") as string)
    const markedBy = formData.get("markedBy") // This would be the user ID in a real auth system
   // const markedByObjectId = new mongoose.Types.ObjectId(markedById as string);
   
console.log("markedById",markedBy);
    // Create attendance record
    const newAttendance = new Attendance({
      employee: employeeId,
      project: projectId,
      date,
      status,
      paymentGiven,
      paymentAmount,
      paymentType: paymentGiven ? paymentType : undefined,
      markedby:markedBy
    })
console.log("newAttendance",newAttendance);
    await newAttendance.save()

    // If payment was given, create a payment record
    if (paymentGiven && paymentAmount > 0) {
      // Generate transaction ID
      const paymentCount = await Payment.countDocuments()
      const transactionId = `TRX-${(paymentCount + 1).toString().padStart(4, "0")}`

      const newPayment = new Payment({
        transactionId,
        type: "Paid",
        project: projectId,
        employee: employeeId,
        amount: paymentAmount,
        paymentMode: paymentType,
        description: `Daily wage payment for ${date.toISOString().split("T")[0]}`,
        date,
        status: "Completed",
      })

      await newPayment.save()
    }

    revalidatePath("/dashboard/attendance")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error marking attendance:", error)
    return { success: false, error: "Failed to mark attendance" }
  }
}

// Get attendance for a specific date
export async function getAttendanceByDate(date: string) {
  try {
    await connectToDatabase()

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("employee")
      .populate("project")
      .sort({ createdAt: -1 })

    return { success: true, attendance: JSON.parse(JSON.stringify(attendance)) }
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return { success: false, error: "Failed to fetch attendance" }
  }
}

// Get today's attendance count
export async function getTodayAttendanceCount() {
  try {
    await connectToDatabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const totalAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    })

    const presentAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: "Present",
    })

    const halfDayAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: "Half Day",
    })

    return {
      success: true,
      totalAttendance,
      presentAttendance,
      halfDayAttendance,
    }
  } catch (error) {
    console.error("Error fetching attendance count:", error)
    return { success: false, error: "Failed to fetch attendance count" }
  }
}

// Get recent attendance
export async function getRecentAttendance() {
  try {
    await connectToDatabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attendance = await Attendance.find({
      date: { $gte: today },
    })
      .populate("employee")
      .populate("project")
      .sort({ createdAt: -1 })
      .limit(10)

    return { success: true, attendance: JSON.parse(JSON.stringify(attendance)) }
  } catch (error) {
    console.error("Error fetching recent attendance:", error)
    return { success: false, error: "Failed to fetch recent attendance" }
  }
}
