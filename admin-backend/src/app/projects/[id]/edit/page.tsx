"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProjectForm, { ProjectFormData } from "@/components/forms/ProjectForm";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [initial, setInitial] = useState<Partial<ProjectFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/projects/${id}`);
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || "Not found");
        const data = json.data || json;
        setInitial({
          title: data.title,
          description: data.description,
          tech: Array.isArray(data.tech) ? data.tech : [],
          image: data.image ?? "",
          codeUrl: data.codeUrl,
          liveUrl: data.liveUrl,
        });
      } catch (err: any) {
        setError(err?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleUpdate = async (payload: ProjectFormData) => {
    if (!id) throw new Error("Missing id");
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Update failed");
    }
    router.push("/projects");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!initial) return <div className="p-6">No data</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <ProjectForm
        initialData={initial}
        onSubmit={handleUpdate}
        submitLabel="Update"
      />
    </div>
  );
}
