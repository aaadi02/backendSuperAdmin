import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stream",
    required: true,
  },
});

export default mongoose.model("Department", departmentSchema);
