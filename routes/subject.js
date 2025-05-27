import express from "express";
import Subject from "../models/Subject.js";

const router = express.Router();

// Create Subject
router.post("/", async (req, res) => {
  try {
    const { name, department } = req.body;
    if (!name || !department) {
      return res
        .status(400)
        .json({ error: "Name and department are required." });
    }
    const subject = new Subject({ name, department });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all subjects by department
router.get("/", async (req, res) => {
  try {
    const { departmentId } = req.query;
    const filter = departmentId ? { department: departmentId } : {};
    const subjects = await Subject.find(filter).populate("department");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Subject
router.put("/:id", async (req, res) => {
  try {
    const { name, department } = req.body;
    const updatedData = {};
    if (name) updatedData.name = name;
    if (department) updatedData.department = department;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Subject
router.delete("/:id", async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
