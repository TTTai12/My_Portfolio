"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AboutForm from "@/components/forms/AboutForm";
import type { AboutFormData } from "@/types";

export default function EditAboutPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [initial, setInitial] = useState<Partial<AboutFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/about/${id}`);
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || "Not found");
        const data = json.data || json;
        setInitial({
          name: data.name ?? "",
          bio: data.bio ?? "",
          avatar: data.avatar ?? "",
          location: data.location ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          experienceYears: data.experienceYears ?? 0,
          projectsCompleted: data.projectsCompleted ?? 0,
        });
      } catch (err: any) {
        setError(err?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleUpdate = async (payload: AboutFormData) => {
    if (!id) throw new Error("Missing id");
    const res = await fetch(`/api/about/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Update failed");
    }
    router.push("/about");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!initial) return <div className="p-6">No data</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit About</h1>
      <AboutForm
        initialData={initial}
        onSubmit={handleUpdate}
        submitLabel="Update"
      />
    </div>
  );
}
