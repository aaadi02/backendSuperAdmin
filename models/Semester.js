import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 9,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
});

export default mongoose.model("Semester", SemesterSchema);
