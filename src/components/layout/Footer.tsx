// src/components/layout/Footer.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import "../css/Layout css/Footer.css";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <p>
        Dev. © 2025 Portfolio. {t("footer.rights")}
        {" · "}
        <a
          href={import.meta.env.VITE_ADMIN_URL || "http://localhost:3000/auth/login"}
          style={{
            color: "inherit",
            opacity: 0.5,
            textDecoration: "none",
            fontSize: "0.9em",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          {t("footer.admin")}
        </a>
      </p>
      <div className="social-links">
        {/* Placeholder cho Social Icons, nên dùng Component Tag hoặc Icon */}
        <a href="#">in</a>
        <a href="#">TW</a>
        <a href="#">GH</a>
      </div>
    </footer>
  );
};

export default Footer;
