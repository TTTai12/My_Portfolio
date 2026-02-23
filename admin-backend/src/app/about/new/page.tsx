"use client";
import { useRouter } from "next/navigation";
import AboutForm from "@/components/forms/AboutForm";
import type { AboutFormData } from "@/types";

export default function NewAboutPage() {
  const router = useRouter();

  const handleCreate = async (data: AboutFormData) => {
    const res = await fetch("/api/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Create failed");
    }
    router.push("/about");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add About</h1>
      <AboutForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
}
