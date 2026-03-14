import React from "react";

interface OptionTileProps {
  label: string;
  onClick?: () => void;
}

const OptionTile: React.FC<OptionTileProps> = ({ label, onClick }) => (
  <div className="option-tile" onClick={onClick} role="button" tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick?.()}>
    {label}
  </div>
);

export default OptionTile;
