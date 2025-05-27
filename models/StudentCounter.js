import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

export default mongoose.model("StudentCounter", counterSchema);
