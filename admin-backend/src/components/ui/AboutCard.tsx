"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export type AboutItem = {
  _id: string;
  name: string;
  bio: string;
  avatar?: string;
  location?: string;
  email?: string;
  phone?: string;
  experienceYears?: number;
  projectsCompleted?: number;
};

type Props = {
  item: AboutItem;
  onDelete?: (id: string) => Promise<void> | void;
  className?: string;
};

export default function AboutCard({ item, onDelete, className = "" }: Props) {
  return (
    <div className={`border p-4 rounded shadow ${className}`}>
      <div className="flex gap-4 items-start mb-4">
        {item.avatar && (
          <div className="flex-shrink-0">
            <Image
              src={item.avatar}
              alt={item.name}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{item.name}</h3>
          {item.location && (
            <p className="text-sm text-gray-600 mb-2">📍 {item.location}</p>
          )}
        </div>
      </div>

      <p className="whitespace-pre-wrap mb-4 text-gray-700">{item.bio}</p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        {item.email && (
          <div>
            <span className="font-semibold">Email:</span>
            <p className="text-gray-600">{item.email}</p>
          </div>
        )}
        {item.phone && (
          <div>
            <span className="font-semibold">Phone:</span>
            <p className="text-gray-600">{item.phone}</p>
          </div>
        )}
        {item.experienceYears !== undefined && (
          <div>
            <span className="font-semibold">Experience:</span>
            <p className="text-gray-600">{item.experienceYears} years</p>
          </div>
        )}
        {item.projectsCompleted !== undefined && (
          <div>
            <span className="font-semibold">Projects:</span>
            <p className="text-gray-600">{item.projectsCompleted} completed</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-3 items-center pt-3 border-t">
        <Link
          href={`/about/${item._id}/edit`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete && onDelete(item._id)}
          className="text-red-600 hover:underline"
          aria-label={`Delete about ${item._id}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
