"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectCard, { Project } from "@/components/ui/ProjectCard";
import { useListData, useAsync } from "@/hooks";
import { get, del } from "@/lib/api";
import {
  ErrorDisplay,
  EmptyState,
  LoadingState,
} from "@/components/ui/FeedbackComponents";
import type { ProjectDocument } from "@/types";

export default function ProjectsPage() {
  const router = useRouter();

  // Fetch projects with auto retry and error handling
  const {
    items: projects,
    isLoading,
    error,
    refetch,
  } = useListData<ProjectDocument>(async () => {
    const data = await get<
      ProjectDocument[] | { success: true; data: ProjectDocument[] }
    >("/api/projects");
    // Handle both formats: direct array or wrapped in { success, data }
    return Array.isArray(data) ? data : data.data;
  }, []);

  // Delete with loading state
  const { execute: deleteProject, isLoading: isDeleting } = useAsync(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this project?")) {
        return undefined;
      }
      await del(`/api/projects/${id}`);
      refetch(); // Reload list after delete
      return undefined;
    },
  );

  // Loading state
  if (isLoading) {
    return <LoadingState message="Loading projects..." />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/projects/new"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          + Add New
        </Link>
      </div>

      {/* Error Display with Retry */}
      {error && (
        <ErrorDisplay error={error} onRetry={refetch} className="mb-4" />
      )}

      {/* Empty State */}
      {!error && projects.length === 0 && (
        <EmptyState
          title="No projects yet"
          description="Get started by creating your first project."
          action={{
            label: "Create Project",
            onClick: () => router.push("/projects/new"),
          }}
          icon={
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
      )}

      {/* Projects Grid */}
      {!error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={() => deleteProject(project._id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}

//       {loading && <div>Loading...</div>}
//       {error && <div className="text-red-600 mb-4">{error}</div>}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {projects.map((p) => (
//           <ProjectCard key={p._id} project={p} onDelete={handleDelete} />
//         ))}
//       </div>
//   );
// }
