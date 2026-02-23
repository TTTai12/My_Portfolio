"use client";
import React, { useState } from "react";
import type { ExperienceFormData, ExperienceFormProps } from "@/types";
import { TagInput } from "@/components/ui/TagInput";

type Props = ExperienceFormProps;

export default function ExperienceForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: Props) {
  const [company, setCompany] = useState(initialData?.company ?? "");
  const [position, setPosition] = useState(initialData?.position ?? "");
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [tags, setTags] = useState(initialData?.tags ?? []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!company.trim() || !position.trim()) {
        throw new Error("Company and position are required");
      }
      const payload: ExperienceFormData = {
        company: company.trim(),
        position: position.trim(),
        startDate,
        endDate,
        description: description.trim(),
        tags: tags,
      };
      await onSubmit(payload);
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
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        className="border p-2 w-full"
        disabled={disabled || loading}
        required
      />

      <input
        name="position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        placeholder="Position"
        className="border p-2 w-full"
        disabled={disabled || loading}
        required
      />

      <input
        type="date"
        name="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 w-full"
        disabled={disabled || loading}
      />

      <input
        type="date"
        name="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 w-full"
        disabled={disabled || loading}
      />

      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 w-full"
        rows={4}
        disabled={disabled || loading}
      />

      <TagInput
        value={tags}
        onChange={setTags}
        label="Skills/Technologies Used"
        placeholder="Type skill and press Enter"
        disabled={disabled || loading}
        maxTags={10}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        disabled={disabled || loading}
      >
        {loading ? `${submitLabel}...` : submitLabel}
      </button>
    </form>
  );
}
