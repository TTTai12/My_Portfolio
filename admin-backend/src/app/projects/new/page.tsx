"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ProjectForm, { ProjectFormData } from "@/components/forms/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();

  const handleCreate = async (data: ProjectFormData) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Create failed");
      }
      toast.success("Project created successfully!");
      router.push("/projects");
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
      throw error;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
      <ProjectForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
}
