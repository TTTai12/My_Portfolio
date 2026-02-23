"use client";
import React, { useState } from "react";
import type { ProjectFormData, ProjectFormProps } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TagInput } from "@/components/ui/TagInput";

type Props = ProjectFormProps;

export default function ProjectForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: Props) {
  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    tech: initialData?.tech ?? [],
    image: initialData?.image ?? "",
    codeUrl: initialData?.codeUrl ?? "",
    liveUrl: initialData?.liveUrl ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }

      const payload: ProjectFormData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tech: formData.tech,
        image: formData.image.trim(),
        codeUrl: formData.codeUrl.trim(),
        liveUrl: formData.liveUrl.trim(),
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
      {error && (
        <div className="text-red-600 p-3 bg-red-50 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project title"
          className="border p-2 w-full rounded"
          disabled={disabled || loading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project description..."
          className="border p-2 w-full rounded"
          rows={4}
          disabled={disabled || loading}
        />
      </div>

      <TagInput
        value={formData.tech}
        onChange={(tags) => setFormData((prev) => ({ ...prev, tech: tags }))}
        label="Technologies"
        placeholder="Type technology name and press Enter"
        disabled={disabled || loading}
        maxTags={20}
      />

      <ImageUpload
        value={formData.image}
        onChange={(url) => {
          setFormData((prev) => {
            const updated = { ...prev, image: url };
            return updated;
          });
        }}
        onRemove={() => setFormData((prev) => ({ ...prev, image: "" }))}
        label="Project Image"
        aspectRatio="landscape"
      />

      <div>
        <label className="block text-sm font-medium mb-1">Code URL</label>
        <input
          type="url"
          name="codeUrl"
          value={formData.codeUrl}
          onChange={handleChange}
          placeholder="https://github.com/username/repo"
          className="border p-2 w-full rounded"
          disabled={disabled || loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Live URL</label>
        <input
          type="url"
          name="liveUrl"
          value={formData.liveUrl}
          onChange={handleChange}
          placeholder="https://yourproject.com"
          className="border p-2 w-full rounded"
          disabled={disabled || loading}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={disabled || loading}
      >
        {loading ? `${submitLabel}...` : submitLabel}
      </button>
    </form>
  );
}
