// src/components/sections/Contact.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ContactForm from "../ui/ContactForm";
import ContactDetail from "../ui/ContactDetail";
import { getAbout } from "../../services/api";
import { About } from "../../types";
import "../css/sections css/Contact.css";

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [aboutData, setAboutData] = useState<About | null>(null);

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const data = await getAbout();
        setAboutData(Array.isArray(data) && data.length > 0 ? data[0] : null);
      } catch (err) {
        console.error("Failed to fetch contact info:", err);
      }
    }
    fetchContactInfo();
  }, []);

  const EmailIcon = "📧";
  const PhoneIcon = "📞";
  const LocationIcon = "📍";

  return (
    <section id="contact" className="contact-section">
      <div className="contact-info">
        <h2>{t("contact.title")}</h2>
        <p>{t("contact.subtitle")}</p>

        {aboutData && (
          <>
            {aboutData.email && (
              <ContactDetail
                icon={EmailIcon}
                value={aboutData.email}
                label={t("contact.email")}
              />
            )}
            {aboutData.phone && (
              <ContactDetail
                icon={PhoneIcon}
                value={aboutData.phone}
                label={t("contact.phone")}
              />
            )}
            {aboutData.location && (
              <ContactDetail
                icon={LocationIcon}
                value={aboutData.location}
                label={t("contact.location")}
              />
            )}
          </>
        )}
      </div>

      {/* Sử dụng Component ContactForm */}
      <ContactForm />
    </section>
  );
};

export default Contact;
