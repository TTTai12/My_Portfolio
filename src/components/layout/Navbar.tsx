// src/components/layout/Navbar.tsx
import React from "react";
import "../css/Layout css/Navbar.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { useRef } from "react";
const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const threshold = 24; // px: điều chỉnh nếu muốn
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

    // set initial state (trường hợp load trang đã cuộn)
    if (window.scrollY > threshold) el.classList.add("scrolled");
    else el.classList.remove("scrolled");

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="navbar">
      <div className="logo">Dev.TIEN TAN TAI</div>
      <nav className="nav-links">
        <a href="#about">{t("nav.about")}</a>
        <a href="#experience">{t("nav.experience")}</a>
        <a href="#projects">{t("nav.projects")}</a>
        <a href="#contact">{t("nav.contact")}</a>
        {/* Trong React, bạn thường dùng component Icon thay vì emoji thuần */}

        <ThemeToggle />
        <LanguageSwitcher />

        <a href="#" className="btn-primary">
          {t("hero.cta.contact")}
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
