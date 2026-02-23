"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AboutCard, { AboutItem } from "@/components/ui/AboutCard";

export default function AboutListPage() {
  const [items, setItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/about");
        const json = await res.json();
        // Handle both formats: direct array or { success, data }
        const data = json.data !== undefined ? json.data : json;
        setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.message || "Failed to load about items");
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this about entry?")) return;
    try {
      const res = await fetch(`/api/about/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x._id !== id));
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error || "Delete failed");
      }
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">About</h1>
        <Link
          href="/about/new"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          + Add New
        </Link>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <AboutCard key={item._id} item={item} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
