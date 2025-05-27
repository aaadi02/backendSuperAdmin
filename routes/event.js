import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// Create event
router.post("/", async (req, res) => {
  try {
    const { title, date, startTime, endTime, type } = req.body;

    if (!title || !date || !type) {
      return res
        .status(400)
        .json({ error: "Event title, date, and type are required." });
    }

    const event = new Event({
      title,
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      type,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    const { title, date, startTime, endTime, type } = req.body;

    if (!title || !date || !type) {
      return res
        .status(400)
        .json({ error: "Event title, date, and type are required." });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date,
        startTime: startTime || null,
        endTime: endTime || null,
        type,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
