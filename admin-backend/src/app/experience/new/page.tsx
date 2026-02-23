"use client";
import { useRouter } from "next/navigation";
import ExperienceForm, {
  ExperienceFormData,
} from "@/components/forms/ExperienceForm";

export default function NewExperiencePage() {
  const router = useRouter();

  const handleCreate = async (data: ExperienceFormData) => {
    const res = await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Create failed");
    }
    router.push("/experience");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Experience</h1>
      <ExperienceForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
}
