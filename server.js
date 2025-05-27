import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
import authRoutes from "./routes/auth.js";
import superAdminRoutes from "./routes/superAdmin.js";
import casteRoutes from "./routes/caste.js";
import departmentRoutes from "./routes/department.js";
import subjectRoutes from "./routes/subject.js";
import eventRoutes from "./routes/event.js";
import facultyRoutes from "./routes/faculty.js";
import facultyAuthRoutes from "./routes/facultyAuth.js";
import semesterRoutes from "./routes/semester.js";
import streamRoutes from "./routes/stream.js";
import studentManagementRoutes from "./routes/StudentManagement.js";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/superadmin/students", studentManagementRoutes);
app.use("/api/superadmin/faculties", facultyRoutes);
app.use("/api/superadmin/streams", streamRoutes);
app.use("/api/superadmin/castes", casteRoutes);
app.use("/api/superadmin/departments", departmentRoutes);
app.use("/api/superadmin/subjects", subjectRoutes);
app.use("/api/superadmin/events", eventRoutes);
app.use("/api/superadmin/semesters", semesterRoutes);
app.use("/api/faculty", facultyAuthRoutes);
app.use("/api/streams", streamRoutes);
app.use("/api/students", studentManagementRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
