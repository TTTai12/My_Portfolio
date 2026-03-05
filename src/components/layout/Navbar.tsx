// src/components/layout/Navbar.tsx
import React, { useState, useEffect, useRef } from "react";
import "../css/Layout css/Navbar.css";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../ui/LanguageSwitcher";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const navRef = useRef<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const threshold = 24;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > threshold) el.classList.add("scrolled");
          else el.classList.remove("scrolled");
          ticking = false;
        });
        ticking = true;
      }
    };

    if (window.scrollY > threshold) el.classList.add("scrolled");
    else el.classList.remove("scrolled");

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const NavLinks = () => (
    <>
      <a href="#about" onClick={closeMobileMenu}>{t("nav.about")}</a>
      <a href="#experience" onClick={closeMobileMenu}>{t("nav.experience")}</a>
      <a href="#projects" onClick={closeMobileMenu}>{t("nav.projects")}</a>
      <a href="#contact" onClick={closeMobileMenu}>{t("nav.contact")}</a>
      <ThemeToggle />
      <LanguageSwitcher />
      <a href="#contact" className="btn-primary" onClick={closeMobileMenu}>
        {t("hero.cta.contact")}
      </a>
    </>
  );

  return (
    <header className="navbar" ref={navRef}>
      <div className="logo">Dev.TIEN TAN TAI</div>
      <nav className="nav-links">
        <NavLinks />
      </nav>
      <button
        type="button"
        className="hamburger-btn"
        aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`} />
        <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`} />
        <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`} />
      </button>
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "open" : ""}`}
        aria-hidden={!mobileMenuOpen}
        onClick={closeMobileMenu}
      >
        <nav className="mobile-nav-links">
          <a href="#about">{t("nav.about")}</a>
          <a href="#experience">{t("nav.experience")}</a>
          <a href="#projects">{t("nav.projects")}</a>
          <a href="#contact">{t("nav.contact")}</a>
          <div className="mobile-menu-actions">
            <ThemeToggle />
            <LanguageSwitcher />
            <a href="#contact" className="btn-primary" onClick={closeMobileMenu}>
              {t("hero.cta.contact")}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
