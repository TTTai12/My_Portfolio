"use client";
import React, { useState } from "react";
import type { EducationFormData, EducationFormProps } from "@/types";

type Props = EducationFormProps;

export default function EducationForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: Props) {
  const [form, setForm] = useState<EducationFormData>({
    school: initialData?.school ?? "",
    degree: initialData?.degree ?? "",
    field: initialData?.field ?? "",
    startDate: initialData?.startDate ?? "",
    endDate: initialData?.endDate ?? "",
    description: initialData?.description ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Basic validation
      if (!form.school.trim()) throw new Error("School is required");
      await onSubmit({
        ...form,
        school: form.school.trim(),
        degree: form.degree.trim(),
        field: form.field.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description?.trim() ?? "",
      });
    } catch (err: any) {
      setError(err?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}

      <input
        name="school"
        value={form.school}
        onChange={handleChange}
        placeholder="School"
        className="border p-2 w-full"
        disabled={disabled || loading}
        required
      />

      <input
        name="degree"
        value={form.degree}
        onChange={handleChange}
        placeholder="Degree"
        className="border p-2 w-full"
        disabled={disabled || loading}
      />

      <input
        name="field"
        value={form.field}
        onChange={handleChange}
        placeholder="Field of study"
        className="border p-2 w-full"
        disabled={disabled || loading}
      />

      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className="border p-2 w-full"
        disabled={disabled || loading}
      />

      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        className="border p-2 w-full"
        disabled={disabled || loading}
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full"
        rows={4}
        disabled={disabled || loading}
      />

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60"
        disabled={disabled || loading}
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
