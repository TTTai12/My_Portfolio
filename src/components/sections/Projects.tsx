// src/components/sections/Projects.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ProjectCard } from "../ui/ProjectCard";
import { ProjectCardSkeleton } from "../ui/Skeleton";
import { getProjects } from "../../services/api";
import { Project } from "../../types";
import "../css/sections css/Projects.css";

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch projects from API when component mounts
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects();
        // Ensure data is always an array
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load projects";
        setError(errorMessage);
        // Fallback to empty array on error
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []); // Empty dependency array = run once on mount

  return (
    <section id="projects" className="projects-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {t("projects.title")}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {t("projects.subtitle")}
      </motion.p>

      <div className="projects-grid">
        {/* Loading state */}
        {loading && (
          <>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center col-span-full text-red-600">
            <p>⚠️ {t("projects.error")}</p>
            <p className="text-sm mt-2">{t("projects.checkBackend")}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center col-span-full">
            <p>{t("projects.noProjects")}</p>
          </div>
        )}

        {/* Success state - render projects */}
        {!loading &&
          !error &&
          projects.length > 0 &&
          projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default Projects;
