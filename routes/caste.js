import express from "express";
import Caste from "../models/Caste.js";

const router = express.Router();

// Create caste (with optional initial subcastes)
router.post("/", async (req, res) => {
  try {
    const { name, subcastes = [] } = req.body;
    const caste = new Caste({ name, subcastes });
    await caste.save();
    res.status(201).json(caste);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all castes
router.get("/", async (req, res) => {
  try {
    const castes = await Caste.find();
    res.json(castes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update caste name
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const caste = await Caste.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json(caste);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update subcastes array
router.put("/:id/subcastes", async (req, res) => {
  try {
    const { subcastes } = req.body;
    const caste = await Caste.findByIdAndUpdate(
      req.params.id,
      { subcastes },
      { new: true }
    );
    res.json(caste);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete caste
router.delete("/:id", async (req, res) => {
  try {
    await Caste.findByIdAndDelete(req.params.id);
    res.json({ message: "Caste deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
