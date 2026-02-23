"use client";
import React, { useState } from "react";
import type { SkillFormData, SkillFormProps } from "@/types";

type Props = SkillFormProps;

export default function SkillsForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [levelText, setLevelText] = useState(
    initialData?.level !== undefined ? String(initialData.level) : "0",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseLevel = (text: string) => {
    const n = Number(text);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!name.trim()) throw new Error("Name is required");
      const payload: SkillFormData = {
        name: name.trim(),
        level: parseLevel(levelText),
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
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Skill Name"
        className="border p-2 w-full"
        disabled={disabled || loading}
        required
      />

      <input
        name="level"
        type="number"
        value={levelText}
        onChange={(e) => setLevelText(e.target.value)}
        placeholder="Level % (0-100)"
        className="border p-2 w-full"
        min={0}
        max={100}
        disabled={disabled || loading}
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
