// src/components/ui/ContactForm.tsx
"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../css/ui css/ContactForm.css";

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert(t("contact.form.successMessage"));
        setForm({ name: "", email: "", subject: "", content: "" });
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error || t("contact.form.errorMessage"));
      }
    } catch (err) {
      alert(t("contact.form.networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder={t("contact.form.namePlaceholder")}
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder={t("contact.form.emailPlaceholder")}
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="subject"
        placeholder={t("contact.form.subjectPlaceholder")}
        value={form.subject}
        onChange={handleChange}
      />
      <textarea
        name="content"
        rows={5}
        placeholder={t("contact.form.messagePlaceholder")}
        value={form.content}
        onChange={handleChange}
        required
      ></textarea>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? t("sending") : t("send")}
      </button>
    </form>
  );
};

export default ContactForm;
