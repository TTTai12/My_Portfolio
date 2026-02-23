"use client";
import Link from "next/link";
import React from "react";

export type Skill = {
  _id: string;
  name: string;
  level: number;
};

type Props = {
  skill: Skill;
  onDelete?: (id: string) => Promise<void> | void;
  className?: string;
};

export default function SkillCard({ skill, onDelete, className = "" }: Props) {
  return (
    <div className={`border p-4 rounded shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{skill.name}</h3>
          <p className="text-sm text-gray-500">Level: {skill.level}%</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/skills/${skill._id}/edit`} className="text-blue-600 hover:underline">
            Edit
          </Link>
          <button
            onClick={() => onDelete && onDelete(skill._id)}
            className="text-red-600 hover:underline"
            aria-label={`Delete ${skill.name}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
