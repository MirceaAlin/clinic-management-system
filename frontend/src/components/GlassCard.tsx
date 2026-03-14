import React from "react";
import type { ReactNode } from "react";

interface GlassCardProps {
  title?: string;
  children: ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ title, children }) => {
  return (
    <div className="glass-card">
      {title && <h2 className="glass-title">{title}</h2>}
      {children}
    </div>
  );
};

export default GlassCard;
