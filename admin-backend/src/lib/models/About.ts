import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name must be less than 100 characters"],
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
      maxlength: [1000, "Bio must be less than 1000 characters"],
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location must be less than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      maxlength: [20, "Phone must be less than 20 characters"],
    },
    experienceYears: {
      type: Number,
      required: [true, "Experience years is required"],
      min: [0, "Experience years must be at least 0"],
      max: [50, "Experience years must be less than 50"],
      default: 0,
    },
    projectsCompleted: {
      type: Number,
      required: [true, "Projects completed is required"],
      min: [0, "Projects completed must be at least 0"],
      max: [10000, "Projects completed must be less than 10000"],
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model("About", AboutSchema);
