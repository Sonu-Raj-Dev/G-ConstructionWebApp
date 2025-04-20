"use server"

import connectToDatabase from "@/lib/mongodb"
import Employee from "@/models/Employee"
import Project from "@/models/Project"
import Attendance from "@/models/Attendance"
import Payment from "@/models/Payment"

// Get employee reports
export async function getEmployeeReports() {
  try {
    await connectToDatabase()

    // Get all employees
    const employees = await Employee.find().populate("currentProject")

    // Get current month's date range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Prepare reports
    const reports = await Promise.all(
      employees.map(async (employee) => {
        // Get attendance records for this employee in the current month
        const attendanceRecords = await Attendance.find({
          employee: employee._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        })
        console.log("attendanceRecords", attendanceRecords);
        // Count days present, absent, and half days
        const daysPresent = attendanceRecords.filter((record) => record.status === "Present").length
        const daysAbsent = attendanceRecords.filter((record) => record.status === "Absent").length
        const halfDays = attendanceRecords.filter((record) => record.status === "Half Day").length

        // Get payments made to this employee in the current month
        const payments = await Payment.find({
          employee: employee._id,
          type: "Paid",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        })

        // Calculate total payments
        const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
        console.log("totalPayments", totalPayments);
        // Calculate average daily rate
        debugger;
        const workDays = daysPresent + halfDays / 2
        console.log("workDays", workDays);
        const avgDailyRate =  employee.dailyWage
        console.log("avgDailyRate", avgDailyRate);
        return {
          employee: JSON.parse(JSON.stringify(employee)),
          project: employee.currentProject ? JSON.parse(JSON.stringify(employee.currentProject)) : null,
          daysPresent,
          daysAbsent,
          halfDays,
          totalPayments,
          avgDailyRate,
        }
      }),
    )

    return { success: true, reports }
  } catch (error) {
    console.error("Error generating employee reports:", error)
    return { success: false, error: "Failed to generate employee reports" }
  }
}

// Get project reports
export async function getProjectReports() {
  try {
    await connectToDatabase()

    // Get all projects
    const projects = await Project.find()

    // Prepare reports
    const reports = await Promise.all(
      projects.map(async (project) => {
        // Count employees assigned to this project
        const employeeCount = await Employee.countDocuments({ currentProject: project._id })

        return {
          project: JSON.parse(JSON.stringify(project)),
          totalPaymentAgreed: project.totalPaymentAgreed,
          paymentReceived: project.paymentReceived,
          employeeCount,
        }
      }),
    )

    return { success: true, reports }
  } catch (error) {
    console.error("Error generating project reports:", error)
    return { success: false, error: "Failed to generate project reports" }
  }
}
