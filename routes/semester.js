import express from "express";
import Semester from "../models/Semester.js";
import Subject from "../models/subject.js";
import Student from "../models/StudentManagement.js";

const router = express.Router();

// GET all semesters
router.get("/", async (req, res) => {
  try {
    const semesters = await Semester.find()
      .sort({ number: 1 })
      .populate("subjects", "name department");
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch semesters" });
  }
});

// POST create a new semester
router.post("/", async (req, res) => {
  const { number, subjectIds } = req.body;

  if (!number || number < 1 || number > 9) {
    return res
      .status(400)
      .json({ error: "Semester number must be between 1 and 9" });
  }

  try {
    // Check if semester number already exists
    const existing = await Semester.findOne({ number });
    if (existing) {
      return res.status(409).json({ error: "Semester number already exists" });
    }

    // Validate subjectIds if provided
    let subjects = [];
    if (subjectIds && Array.isArray(subjectIds)) {
      if (subjectIds.length > 0) {
        const subjectDocs = await Subject.find({ _id: { $in: subjectIds } });
        if (subjectDocs.length !== subjectIds.length) {
          return res
            .status(400)
            .json({ error: "One or more subject IDs are invalid" });
        }
        subjects = subjectIds;
      }
    }

    const semester = new Semester({ number, subjects });
    await semester.save();
    const populatedSemester = await Semester.findById(semester._id).populate(
      "subjects",
      "name department"
    );
    res.status(201).json(populatedSemester);
  } catch (err) {
    res.status(500).json({ error: "Failed to create semester" });
  }
});

// PUT update semester
router.put("/:id", async (req, res) => {
  const { number, subjectIds } = req.body;

  if (!number || number < 1 || number > 9) {
    return res
      .status(400)
      .json({ error: "Semester number must be between 1 and 9" });
  }

  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    // Check if number is taken by another semester
    const existing = await Semester.findOne({
      number,
      _id: { $ne: req.params.id },
    });
    if (existing) {
      return res.status(409).json({ error: "Semester number already exists" });
    }

    // Validate subjectIds if provided
    let subjects = semester.subjects;
    if (subjectIds && Array.isArray(subjectIds)) {
      if (subjectIds.length > 0) {
        const subjectDocs = await Subject.find({ _id: { $in: subjectIds } });
        if (subjectDocs.length !== subjectIds.length) {
          return res
            .status(400)
            .json({ error: "One or more subject IDs are invalid" });
        }
        subjects = subjectIds;
      } else {
        subjects = [];
      }
    }

    semester.number = number;
    semester.subjects = subjects;
    await semester.save();
    const populatedSemester = await Semester.findById(semester._id).populate(
      "subjects",
      "name department"
    );
    res.json(populatedSemester);
  } catch (err) {
    res.status(500).json({ error: "Failed to update semester" });
  }
});

// DELETE semester
router.delete("/:id", async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    // Check if semester is referenced by any student
    const studentUsingSemester = await Student.findOne({
      $or: [
        { semester: req.params.id },
        { "semesterRecords.semester": req.params.id },
        { "backlogs.semester": req.params.id },
      ],
    });
    if (studentUsingSemester) {
      return res.status(400).json({
        error:
          "Cannot delete semester; it is referenced by one or more students",
      });
    }

    await semester.deleteOne();
    res.json({ message: "Semester deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete semester" });
  }
});

export default router;
