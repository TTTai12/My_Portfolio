"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ExperienceForm, {
  ExperienceFormData,
} from "@/components/forms/ExperienceForm";

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [initial, setInitial] = useState<Partial<ExperienceFormData> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/experience/${id}`);
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || "Not found");
        const data = json.data || json;
        setInitial({
          company: data.company,
          position: data.position,
          startDate: data.startDate ? data.startDate.slice(0, 10) : "",
          endDate: data.endDate ? data.endDate.slice(0, 10) : "",
          description: data.description,
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
      } catch (err: any) {
        setError(err?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleUpdate = async (payload: ExperienceFormData) => {
    if (!id) throw new Error("Missing id");
    const res = await fetch(`/api/experience/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Update failed");
    }
    router.push("/experience");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!initial) return <div className="p-6">No data</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Experience</h1>
      <ExperienceForm
        initialData={initial}
        onSubmit={handleUpdate}
        submitLabel="Update"
      />
    </div>
  );
}
