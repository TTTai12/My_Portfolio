"use client";
import { useRouter } from "next/navigation";
import SkillsForm, { SkillFormData } from "@/components/forms/skillsForm";

export default function NewSkillPage() {
  const router = useRouter();

  const handleCreate = async (data: SkillFormData) => {
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Create failed");
    }
    router.push("/skills");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Skill</h1>
      <SkillsForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
}
