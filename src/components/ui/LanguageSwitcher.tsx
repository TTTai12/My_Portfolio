import React from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "vi" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher"
      aria-label="Switch language"
      title={
        i18n.language === "en" ? "Chuyển sang Tiếng Việt" : "Switch to English"
      }
    >
      <span className="flag">{i18n.language === "en" ? "🇻🇳" : "🇬🇧"}</span>
      <span className="lang-code">{i18n.language === "en" ? "VI" : "EN"}</span>
    </button>
  );
};

export default LanguageSwitcher;
