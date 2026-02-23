import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
      maxlength: [200, "School name must be less than 200 characters"],
    },
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
      maxlength: [100, "Degree must be less than 100 characters"],
    },
    field: {
      type: String,
      required: [true, "Field of study is required"],
      trim: true,
      maxlength: [100, "Field must be less than 100 characters"],
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
      maxlength: [1000, "Description must be less than 1000 characters"],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Education ||
  mongoose.model("Education", EducationSchema);
