import mongoose, { Schema, type Document } from "mongoose";

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  date: Date;
  status: "Present" | "Absent" | "Half Day";
  paymentGiven: boolean;
  paymentAmount: number;
  paymentType: "Cash" | "Bank Transfer" | "UPI" | "Other";
  markedBy?: String;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day"],
      required: true,
    },
    paymentGiven: { type: Boolean, default: false },
    paymentAmount: { type: Number, default: 0 },
    paymentType: {
      type: String,
      enum: ["Cash", "Bank Transfer", "UPI", "Other"],
      default: "Cash",
    },
    markedBy: {
      type:String,
      default: "Admin",
      // No required: true here, making it optional
    },
  },
  { timestamps: true },
);

export default mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
