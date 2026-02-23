"use client";
import React, { useState } from "react";
import type { AboutFormData, AboutFormProps } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

export type { AboutFormData };

type Props = AboutFormProps;

export default function AboutForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: Props) {
  const [formData, setFormData] = useState<AboutFormData>({
    name: initialData?.name ?? "",
    bio: initialData?.bio ?? "",
    avatar: initialData?.avatar ?? "",
    location: initialData?.location ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    experienceYears: initialData?.experienceYears ?? 0,
    projectsCompleted: initialData?.projectsCompleted ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Basic validation
      if (!formData.name.trim()) throw new Error("Name is required");
      if (!formData.bio.trim()) throw new Error("Bio is required");
      if (!formData.email.trim()) throw new Error("Email is required");

      await onSubmit(formData);
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
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          className="border p-2 w-full rounded"
          disabled={disabled || loading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio *</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Write about yourself..."
          className="border p-2 w-full rounded"
          rows={6}
          disabled={disabled || loading}
          required
        />
      </div>

      <ImageUpload
        value={formData.avatar}
        onChange={(url) => {
          setFormData((prev) => {
            const updated = { ...prev, avatar: url };
            return updated;
          });
        }}
        onRemove={() => setFormData((prev) => ({ ...prev, avatar: "" }))}
        label="Avatar (Profile Photo)"
        aspectRatio="square"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="border p-2 w-full rounded"
            disabled={disabled || loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            className="border p-2 w-full rounded"
            disabled={disabled || loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, Country"
          className="border p-2 w-full rounded"
          disabled={disabled || loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            min="0"
            placeholder="3"
            className="border p-2 w-full rounded"
            disabled={disabled || loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Projects Completed
          </label>
          <input
            type="number"
            name="projectsCompleted"
            value={formData.projectsCompleted}
            onChange={handleChange}
            min="0"
            placeholder="50"
            className="border p-2 w-full rounded"
            disabled={disabled || loading}
          />
        </div>
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
