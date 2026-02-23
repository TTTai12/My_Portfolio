// src/components/sections/About.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { SkillBar } from "../ui/SkillBar";
import { SkillBarSkeleton } from "../ui/Skeleton";
import { getAbout, getSkills } from "../../services/api";
import { About as AboutType, Skill } from "../../types";
import "../css/sections css/About.css";

const About: React.FC = () => {
  const { t } = useTranslation();
  const [aboutData, setAboutData] = useState<AboutType | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both About and Skills in parallel
        const [aboutResponse, skillsResponse] = await Promise.all([
          getAbout(),
          getSkills(),
        ]);

        // About API returns array, we take the first one
        setAboutData(
          Array.isArray(aboutResponse) && aboutResponse.length > 0
            ? aboutResponse[0]
            : null,
        );

        // Ensure skills is always an array
        setSkills(Array.isArray(skillsResponse) ? skillsResponse : []);
      } catch (err) {
        console.error("Failed to fetch about/skills:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
        // Set empty array on error to prevent .map crash
        setSkills([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // No fallback defaults - always use real backend data

  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t("about.title")}
        </motion.h2>

        {loading ? (
          <p>{t("about.loading")}</p>
        ) : error ? (
          <p className="text-red-600">⚠️ {error}</p>
        ) : aboutData ? (
          <>
            {/* Avatar + Name/Location */}
            {aboutData?.avatar && (
              <motion.div
                className="about-header"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.img
                  src={aboutData.avatar}
                  alt={aboutData.name || "Profile"}
                  className="about-avatar"
                  loading="lazy"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="about-info">
                  {aboutData?.name && <h3>{aboutData.name}</h3>}
                  {aboutData?.location && (
                    <p className="location">📍 {aboutData.location}</p>
                  )}
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {aboutData.bio}
            </motion.p>
          </>
        ) : (
          <p>
            No about data available. Please add your profile in the admin panel.
          </p>
        )}

        {aboutData && (
          <motion.div
            className="stats-group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.p whileHover={{ scale: 1.05 }}>
              <strong>{aboutData.experienceYears}+</strong>{" "}
              {t("about.yearsExperience")}
            </motion.p>
            <motion.p whileHover={{ scale: 1.05 }}>
              <strong>{aboutData.projectsCompleted}+</strong>{" "}
              {t("about.projectsCompleted")}
            </motion.p>
          </motion.div>
        )}
      </div>

      <div className="technical-proficiency">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t("about.technicalProficiency")}
        </motion.h2>

        {loading ? (
          <>
            <SkillBarSkeleton />
            <SkillBarSkeleton />
            <SkillBarSkeleton />
            <SkillBarSkeleton />
          </>
        ) : error ? (
          <p className="text-red-600">{t("about.errorLoading")}</p>
        ) : skills.length === 0 ? (
          <p>{t("about.noSkills")}</p>
        ) : (
          skills.map((skill, index) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SkillBar name={skill.name} level={skill.level} />
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default About;
