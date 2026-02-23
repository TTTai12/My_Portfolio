import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      minlength: [1, "Skill name cannot be empty"],
      maxlength: [50, "Skill name must be less than 50 characters"],
    },
    level: {
      type: Number,
      required: [true, "Skill level is required"],
      min: [0, "Level must be at least 0"],
      max: [100, "Level must be at most 100"],
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
