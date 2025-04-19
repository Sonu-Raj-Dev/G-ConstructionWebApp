"use server"

import { revalidatePath } from "next/cache"
import connectToDatabase from "@/lib/mongodb"
import Employee from "@/models/Employee"
import EmployeeProjectHistory from "@/models/EmployeeProjectHistory"

// Generate a unique employee ID
async function generateEmployeeId() {
  await connectToDatabase()

  const count = await Employee.countDocuments()
  const nextNumber = count + 1
  return `EMP-${nextNumber.toString().padStart(3, "0")}`
}

// Create a new employee
export async function createEmployee(formData: FormData) {
  try {
    await connectToDatabase()

    const employeeId = await generateEmployeeId()
    debugger;
    const newEmployee = new Employee({
      employeeId,
      name: formData.get("name"),
      aadhar: formData.get("aadhar"),
      phone: formData.get("phone"),
      dailyWage: Number.parseFloat(formData.get("dailyWage") as string),
      status: "Active",
      currentProject: formData.get("projectId") || null,
    })

    await newEmployee.save()

    // If a project is assigned, create a history record
    if (formData.get("projectId")) {
      const history = new EmployeeProjectHistory({
        employee: newEmployee._id,
        project: formData.get("projectId"),
        assignedDate: new Date(),
      })
      await history.save()
    }

    revalidatePath("/dashboard/employees")
    revalidatePath("/dashboard")

    return { success: true, employeeId }
  } catch (error) {
    console.error("Error creating employee:", error)
    return { success: false, error: "Failed to create employee" }
  }
}

// Get all employees
export async function getEmployees() {
  try {
    await connectToDatabase()

    const employees = await Employee.find().populate("currentProject").sort({ createdAt: -1 })

    return { success: true, employees: JSON.parse(JSON.stringify(employees)) }
  } catch (error) {
    console.error("Error fetching employees:", error)
    return { success: false, error: "Failed to fetch employees" }
  }
}

// Get employee by ID
export async function getEmployeeById(id: string) {
  try {
    await connectToDatabase()

    const employee = await Employee.findById(id).populate("currentProject")

    if (!employee) {
      return { success: false, error: "Employee not found" }
    }

    return { success: true, employee: JSON.parse(JSON.stringify(employee)) }
  } catch (error) {
    console.error("Error fetching employee:", error)
    return { success: false, error: "Failed to fetch employee" }
  }
}

// Get employee count
export async function getEmployeeCount() {
  try {
    await connectToDatabase()

    const totalEmployees = await Employee.countDocuments()
    const activeEmployees = await Employee.countDocuments({ status: "Active" })

    return {
      success: true,
      totalEmployees,
      activeEmployees,
    }
  } catch (error) {
    console.error("Error fetching employee count:", error)
    return { success: false, error: "Failed to fetch employee count" }
  }
}

// Update an employee
export async function updateEmployee(id: string, formData: FormData) {
  try {
    await connectToDatabase()

    const employee = await Employee.findById(id)

    if (!employee) {
      return { success: false, error: "Employee not found" }
    }

    employee.name = formData.get("name") as string
    employee.aadhar = formData.get("aadhar") as string
    employee.phone = formData.get("phone") as string
    employee.dailyWage = Number.parseFloat(formData.get("dailyWage") as string)
    employee.status = formData.get("status") as "Active" | "Inactive" | "On Leave"

    await employee.save()

    revalidatePath("/dashboard/employees")
    revalidatePath(`/dashboard/employees/${id}`)
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating employee:", error)
    return { success: false, error: "Failed to update employee" }
  }
}

// Transfer an employee to a different project
export async function transferEmployee(id: string, formData: FormData) {
  try {
    await connectToDatabase()

    const employee = await Employee.findById(id)

    if (!employee) {
      return { success: false, error: "Employee not found" }
    }

    const newProjectId = formData.get("projectId") as string
    const oldProjectId = employee.currentProject

    // If the employee is currently assigned to a project, update the history record
    if (oldProjectId) {
      const history = await EmployeeProjectHistory.findOne({
        employee: id,
        project: oldProjectId,
        removedDate: null,
      })

      if (history) {
        history.removedDate = new Date()
        await history.save()
      }
    }

    // Update the employee's current project
    employee.currentProject = newProjectId || null

    // If a new project is assigned, create a history record
    if (newProjectId) {
      const history = new EmployeeProjectHistory({
        employee: id,
        project: newProjectId,
        assignedDate: new Date(),
      })
      await history.save()
    }

    await employee.save()

    revalidatePath("/dashboard/employees")
    revalidatePath(`/dashboard/employees/${id}`)
    revalidatePath("/dashboard/projects")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error transferring employee:", error)
    return { success: false, error: "Failed to transfer employee" }
  }
}
