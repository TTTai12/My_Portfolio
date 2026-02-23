// src/components/ui/ContactDetail.tsx
import React from 'react';
import '../css/ui css/ContactDetail.css';  

interface ContactDetailProps {
  icon: React.ReactNode; // Dùng ReactNode cho icon
  value: string;
  label: string;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ icon, value, label }) => {
  return (
    <div className="contact-detail">
      <i className="icon-placeholder">{icon}</i>
      <p>
        <span style={{ fontWeight: 600 }}>{label}: </span>
        {value}
      </p>
    </div>
  );
};

export default ContactDetail;