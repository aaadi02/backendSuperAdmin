import mongoose from "mongoose";

const casteSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcastes: [{ type: String }],
});

export default mongoose.model("Caste", casteSchema);
