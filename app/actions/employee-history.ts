"use server"

import connectToDatabase from "@/lib/mongodb"
import EmployeeProjectHistory from "@/models/EmployeeProjectHistory"

// Get employee work history
export async function getEmployeeWorkHistory(employeeId: string) {
  try {
    await connectToDatabase()

    const history = await EmployeeProjectHistory.find({ employee: employeeId })
      .populate("project")
      .sort({ assignedDate: -1 })

    return { success: true, history: JSON.parse(JSON.stringify(history)) }
  } catch (error) {
    console.error("Error fetching employee work history:", error)
    return { success: false, error: "Failed to fetch employee work history" }
  }
}
