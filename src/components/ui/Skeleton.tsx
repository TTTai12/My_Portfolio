import React from "react";
import "../css/skeleton.css";

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="project-card">
      <div className="skeleton skeleton-image"></div>
      <div className="project-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text" style={{ width: "80%" }}></div>
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <div className="skeleton skeleton-button"></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      </div>
    </div>
  );
};

export const SkillBarSkeleton: React.FC = () => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div
        className="skeleton skeleton-text"
        style={{ width: "120px", marginBottom: "10px" }}
      ></div>
      <div className="skeleton" style={{ height: "24px", width: "100%" }}></div>
    </div>
  );
};
