import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name must be less than 100 characters"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: [100, "Position must be less than 100 characters"],
    },
    startDate: {
      type: String,
      required: [true, "Start date is required"],
      match: [/^\d{4}-\d{2}(-\d{2})?$/, "Start date must be in YYYY-MM or YYYY-MM-DD format"],
    },
    endDate: {
      type: String,
      required: [true, "End date is required"],
      validate: {
        validator: function (value: string) {
          return /^\d{4}-\d{2}(-\d{2})?$/.test(value) || /^Present$/i.test(value);
        },
        message: "End date must be in YYYY-MM, YYYY-MM-DD format, or 'Present'",
      },
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2000, "Description must be less than 2000 characters"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr: string[]) {
          return arr.length <= 10;
        },
        message: "Maximum 10 tags allowed",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Experience ||
  mongoose.model("Experience", ExperienceSchema);
