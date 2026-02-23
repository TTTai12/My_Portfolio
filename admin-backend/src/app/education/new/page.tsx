"use client";
import { useRouter } from "next/navigation";
import EducationForm, {
  EducationFormData,
} from "@/components/forms/EducationForm";

export default function NewEducationPage() {
  const router = useRouter();

  const handleCreate = async (data: EducationFormData) => {
    const res = await fetch("/api/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Create failed");
    }
    router.push("/education");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Education</h1>
      <EducationForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
}
