import '../css/ui css/SkillBar.css';    

// Component con: SkillBar
import React from 'react';
interface SkillBarProps {
  name: string;
  level: number;
}

export const SkillBar: React.FC<SkillBarProps> = ({ name, level }) => {
  return (
    <div className="skill-bar">
      <label>{name}</label>
      <div className="bar-container">
        {/* Style inline tạm thời cho phần trăm, nên dùng class hoặc CSS Modules */}
        <div className="bar" style={{ width: `${level}%` }}></div>
        <span>{level}%</span>
      </div>
    </div>
  );
};