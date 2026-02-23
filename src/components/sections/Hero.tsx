// src/components/sections/Hero.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "../css/sections css/Hero.css";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="hero-section">
      <div className="hero-background-art"></div>
      <div className="hero-content">
        <motion.span
          className="freelance-tag"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Available for freelance work
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Building digital <span className="highlight">experiences</span> that
          matter.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t("hero.description")}
        </motion.p>

        <motion.div
          className="cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a href="#projects" className="btn-secondary">
            {t("hero.cta.viewWork")}
          </a>
          <a href="#contact" className="btn-primary-icon">
            {t("hero.cta.contact")} →
          </a>
        </motion.div>

        <motion.div
          className="features-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Lưới các tính năng có thể là một component FeatureItem riêng */}
          {[
            {
              icon: "< >",
              title: "Clean Code",
              desc: "Maintainable, scalable architecture.",
            },
            {
              icon: "🖼️",
              title: "Modern Design",
              desc: "Aesthetic, intuitive interfaces.",
            },
            {
              icon: "📱",
              title: "Responsive",
              desc: "Flawless on every device.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <span className="icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
