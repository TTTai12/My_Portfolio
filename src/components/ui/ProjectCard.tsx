import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "../css/ui css/ProjectCard.css";

// Component con: ProjectCard
interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  image?: string;
  codeUrl: string;
  liveUrl: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tech,
  image,
  codeUrl,
  liveUrl,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="project-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="project-content">
        <h3>{title}</h3>
        <p className="project-description">{description}</p>

        {image && (
          <div className="project-image">
            <motion.img
              src={image}
              alt={title}
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="tags">
          {tech.map((tag) => (
            <motion.span
              key={tag}
              className="tag"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <div className="project-links">
          <motion.a
            href={codeUrl}
            className="link-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("projects.viewCode")}
          </motion.a>
          <motion.a
            href={liveUrl}
            className="link-btn btn-live-demo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("projects.viewLive")}
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};
