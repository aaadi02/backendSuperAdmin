import express from "express";
import Stream from "../models/Stream.js";

const router = express.Router();

// Create Stream
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newStream = new Stream({ name, description });
    await newStream.save();
    res.status(201).json(newStream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Streams
router.get("/", async (req, res) => {
  try {
    const streams = await Stream.find();
    res.status(200).json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Stream
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    res.status(200).json(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Stream
router.delete("/:id", async (req, res) => {
  try {
    await Stream.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Stream deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
