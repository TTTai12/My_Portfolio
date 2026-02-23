"use client";
import Link from "next/link";
import React from "react";

export type Education = {
  _id: string;
  school: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

type Props = {
  item: Education;
  onDelete?: (id: string) => Promise<void> | void;
  className?: string;
};

export default function EducationCard({ item, onDelete, className = "" }: Props) {
  return (
    <div className={`border p-4 rounded shadow ${className}`}>
      <h3 className="text-lg font-semibold">{item.school}</h3>
      <p className="text-sm text-gray-700">
        {item.degree ? `${item.degree}` : ""}{item.degree && item.field ? " - " : ""}{item.field ?? ""}
      </p>
      <p className="text-sm text-gray-500">
        {item.startDate?.slice(0, 10)}{item.startDate || item.endDate ? " → " : ""}{item.endDate?.slice(0, 10)}
      </p>
      {item.description && <p className="mt-2">{item.description}</p>}

      <div className="mt-3 flex gap-3 items-center">
        <Link href={`/education/${item._id}/edit`} className="bg-blue-600 text-white px-3 py-1 rounded">
          Edit
        </Link>

        <button
          onClick={() => onDelete && onDelete(item._id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
