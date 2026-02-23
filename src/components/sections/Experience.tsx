// src/components/sections/Experience.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getExperience, getEducation } from "../../services/api";
import {
  Experience as ExperienceType,
  Education as EducationType,
} from "../../types";
import "../css/sections css/Experience.css";

// Component cho Work Experience (match với Experience model)
interface WorkExperienceItemProps {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  tags?: string[];
}

const WorkExperienceItem: React.FC<WorkExperienceItemProps> = ({
  company,
  position,
  startDate,
  endDate,
  description,
  tags,
}) => {
  // Format yearRange từ startDate và endDate
  const yearRange = `${new Date(startDate).getFullYear()} - ${endDate ? new Date(endDate).getFullYear() : "Present"}`;

  return (
    <div className="timeline-item">
      <span className="year">{yearRange}</span>
      <h4>{position}</h4>
      <p className="company">{company}</p>
      <p className="description">{description}</p>

      {tags && tags.length > 0 && (
        <div className="tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Component cho Education (match với Education model)
interface EducationItemProps {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

const EducationItem: React.FC<EducationItemProps> = ({
  school,
  degree,
  field,
  startDate,
  endDate,
  description,
}) => {
  // Format yearRange từ startDate và endDate
  const yearRange = `${new Date(startDate).getFullYear()} - ${new Date(endDate).getFullYear()}`;

  return (
    <div className="timeline-item">
      <span className="year">{yearRange}</span>
      <h4>{school}</h4>
      <p className="degree">
        {degree} - {field}
      </p>
      <p className="description">{description}</p>
    </div>
  );
};

const Experience: React.FC = () => {
  const { t } = useTranslation();
  const [workExperience, setWorkExperience] = useState<ExperienceType[]>([]);
  const [education, setEducation] = useState<EducationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both Experience and Education in parallel
        const [experienceData, educationData] = await Promise.all([
          getExperience(),
          getEducation(),
        ]);

        // Ensure data is always an array
        setWorkExperience(Array.isArray(experienceData) ? experienceData : []);
        setEducation(Array.isArray(educationData) ? educationData : []);
      } catch (err) {
        console.error("Failed to fetch experience/education:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
        // Set empty arrays on error
        setWorkExperience([]);
        setEducation([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <section id="experience" className="experience-education-section">
      <h2>{t("experience.title")}</h2>
      <p className="section-subtitle">{t("experience.subtitle")}</p>

      {loading && (
        <div className="text-center">
          <p>{t("experience.loading")}</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center text-red-600">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="content-columns">
          <div className="work-experience-col">
            <h3>💼 {t("experience.workExperience")}</h3>
            {workExperience.length === 0 ? (
              <p>{t("experience.noWorkExperience")}</p>
            ) : (
              workExperience.map((item) => (
                <WorkExperienceItem key={item._id} {...item} />
              ))
            )}
          </div>

          <div className="education-col">
            <h3>🎓 {t("experience.education")}</h3>
            {education.length === 0 ? (
              <p>{t("experience.noEducation")}</p>
            ) : (
              education.map((item) => (
                <EducationItem key={item._id} {...item} />
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Experience;
