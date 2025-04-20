"use server"

import connectToDatabase from "@/lib/mongodb"
import mongoose, { isValidObjectId } from "mongoose"
import Employee from "@/models/Employee" // Renamed to `Employee` for clarity
import EmployeeProjectHistory from "@/models/EmployeeProjectHistory";

export async function removeEmployeeFromProject(employeeId: string) {
    try {
        await connectToDatabase(); // Ideally called once at app startup
        console.log("Connected to DB");

        if (!isValidObjectId(employeeId)) {
            return { success: false, error: "Invalid employee ID" };
        }

        // Step 1: Find the employee to get the current project ID
        const employee = await Employee.findById(employeeId);
        console.log("Employee Details", employee);

        if (!employee || !employee.currentProject) {
            return { success: false, error: "Employee or current project not found." };
        }

        const projectObject = new mongoose.Types.ObjectId(employee.currentProject)
         const employeeObject = new mongoose.Types.ObjectId(employee._id)
        
        // console.log("projectObject", projectObject)
        
        // console.log("employeeObject", employeeObject)
        
        // // Step 2: Mark current project history as inactive
        // const historyUpdateResult = await EmployeeProjectHistory.updateOne(
        //     { employee: employeeObject, project: projectObject, isActive: true },
        //     {
        //         $set: {
        //             isActive: false,
        //             removedDate: new Date(),
        //         },
        //     }
        // );

        const history = new EmployeeProjectHistory({
            employee: employeeObject,
            project: projectObject,
            assignedDate: new Date(),
            removedDate: new Date(),
            isActive: false
        })
        console.log("History object before saving:", history);
        await history.save()

        // Step 3: Remove employee from the project
        const employeeUpdateResult = await Employee.updateOne(
            { _id: employeeId },
            { $set: { currentProject: null } }
        );

        // console.log("Employee update result:", employeeUpdateResult);
        // console.log("History update result:", historyUpdateResult);

        if (employeeUpdateResult.modifiedCount === 1) {
            return { success: true };
        } else {
            return { success: false, error: "Employee not found or not updated." };
        }
    } catch (error: any) {
        console.error("Error removing employee from project:", error.message);
        return { success: false, error: "Internal server error" };
    }
}


export async function employeeProjectMapping(employeeId: string, projectId: string) {
    try {
        await connectToDatabase()

        const employeeObjectId = new mongoose.Types.ObjectId(employeeId)
        const projectObjectId = new mongoose.Types.ObjectId(projectId)

        // Step 1: Update current project for the employee
        await Employee.updateOne(
            { _id: employeeObjectId },
            { $set: { currentProject: projectObjectId } }
        )

        // Step 2: Add history record
        const history = new EmployeeProjectHistory({
            employee: employeeObjectId,
            project: projectObjectId,
            assignedDate: new Date(),
            removedDate: null,
            isActive: true
        })
        console.log("History object before saving:", history);
        await history.save()

        return { success: true }
    } catch (error: any) {
        console.error("Error assigning employee to project:", error.message)
        return { success: false, error: "Internal server error" }
    }
}
