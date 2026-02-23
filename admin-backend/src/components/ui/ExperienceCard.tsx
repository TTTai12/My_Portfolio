"use client";
import Link from "next/link";
import React from "react";

export type Experience = {
  _id: string;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  tags?: string[];
};

type Props = {
  item: Experience;
  onDelete?: (id: string) => Promise<void> | void;
  className?: string;
};

export default function ExperienceCard({
  item,
  onDelete,
  className = "",
}: Props) {
  return (
    <div className={`border p-4 rounded shadow ${className}`}>
      <h3 className="text-lg font-semibold">{item.position}</h3>
      <p className="text-sm text-gray-700">{item.company}</p>

      <p className="text-sm text-gray-500 mt-1">
        {item.startDate?.slice(0, 10) ?? ""}
        {item.startDate || item.endDate ? " → " : ""}
        {item.endDate?.slice(0, 10) ?? ""}
      </p>

      {item.description && <p className="mt-2">{item.description}</p>}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium border border-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-3 items-center">
        <Link
          href={`/experience/${item._id}/edit`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete && onDelete(item._id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
