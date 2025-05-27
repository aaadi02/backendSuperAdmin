import mongoose from "mongoose";
import Department from "./Department.js";
import Stream from "./Stream.js";
import StudentCounter from "./StudentCounter.js";

const studentSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    fatherName: String,
    unicodeFatherName: String,
    motherName: String,
    unicodeMotherName: String,
    unicodeName: String,
    enrollmentNumber: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Transgender"],
    },
    mobileNumber: {
      type: String,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: (props) =>
          `${props.value} is not a valid 10-digit mobile number!`,
      },
    },
    casteCategory: String,
    subCaste: String,
    email: {
      type: String,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    section: String,
    admissionType: {
      type: String,
      enum: ["Regular", "Direct Second Year", "Lateral Entry"],
      required: true,
    },
    admissionThrough: String,
    remark: String,
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    semesterRecords: [
      {
        semester: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Semester",
          required: true,
        },
        subjects: [
          {
            subject: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Subject",
              required: true,
            },
            status: {
              type: String,
              enum: ["Passed", "Failed", "Pending"],
              default: "Pending",
            },
            marks: Number,
          },
        ],
        isBacklog: {
          type: Boolean,
          default: false,
        },
      },
    ],
    backlogs: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
        semester: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Semester",
        },
        status: {
          type: String,
          enum: ["Pending", "Cleared"],
          default: "Pending",
        },
      },
    ],
    stream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
    ],
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    studentId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate studentId
studentSchema.pre("save", async function (next) {
  if (this.isNew && !this.studentId) {
    try {
      const department = await Department.findById(this.department);
      const stream = await Stream.findById(this.stream);

      if (!department || !stream) {
        throw new Error("Invalid department or stream reference");
      }

      const deptName = department.name.replace(/\s+/g, "").toUpperCase();
      const streamName = stream.name.replace(/\s+/g, "").toUpperCase();
      const key = `${deptName}-${streamName}`;

      const counter = await StudentCounter.findOneAndUpdate(
        { key },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );

      const paddedCount = String(counter.count).padStart(3, "0");
      this.studentId = `${deptName}${streamName}${paddedCount}`;

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model("Student", studentSchema);
