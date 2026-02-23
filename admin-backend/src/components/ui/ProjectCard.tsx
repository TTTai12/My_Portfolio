"use client";
import Link from "next/link";
import React from "react";

export type Project = {
  _id: string;
  title: string;
  description?: string;
  tech?: string[];
  codeUrl?: string;
  liveUrl?: string;
};

type Props = {
  project: Project;
  onDelete?: (id: string) => Promise<void> | void;
  isDeleting?: boolean;
  className?: string;
};

export default function ProjectCard({
  project,
  onDelete,
  isDeleting = false,
  className = "",
}: Props) {
  return (
    <div
      className={`border p-4 rounded shadow ${isDeleting ? "opacity-50" : ""} ${className}`}
    >
      <h3 className="text-xl font-semibold">{project.title}</h3>
      {project.description && <p className="mt-2">{project.description}</p>}

      {project.tech && project.tech.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tech.map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium border border-purple-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-4 items-center">
        <Link
          href={`/projects/${project._id}/edit`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete && onDelete(project._id)}
          disabled={isDeleting}
          className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Delete ${project.title}`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>

        {project.codeUrl && (
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-sm text-gray-500 hover:underline"
          >
            Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-500 hover:underline"
          >
            Live
          </a>
        )}
      </div>
    </div>
  );
}
