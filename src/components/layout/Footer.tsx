// src/components/layout/Footer.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import "../css/Layout css/Footer.css";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <p>
        <strong>Tien Tran</strong> · Full‑Stack Developer {"  ·  "}
        <a
          href={
            import.meta.env.VITE_ADMIN_URL || "http://localhost:3000/auth/login"
          }
          style={{
            color: "inherit",
            opacity: 0.65,
            textDecoration: "none",
            fontSize: "0.85em",
            borderBottom: "1px dashed rgba(255,255,255,0.3)",
            paddingBottom: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.65")}
        >
          {t("footer.admin")} panel
        </a>
      </p>
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/tai-tien-tan-a2227b323/"
          aria-label="LinkedIn"
        >
          in
        </a>
        <a href="https://github.com/TTTai12" aria-label="GitHub">
          GH
        </a>
        <a href="mailto:tientantai12@gmail.com" aria-label="Email">
          @
        </a>
      </div>
    </footer>
  );
};

export default Footer;
