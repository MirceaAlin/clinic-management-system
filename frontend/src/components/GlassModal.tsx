import React from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface GlassModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  menu?: ReactNode;
}

const GlassModal: React.FC<GlassModalProps> = ({ title, children, onClose, menu }) => {
  return (
    <div className="glass-modal-overlay">
      <div className="glass-modal">
        <div className="glass-modal-header">
          <h2>{title}</h2>
          <div className="modal-actions-right">
            {menu && <div className="menu-wrapper">{menu}</div>}
            <button className="close-btn" onClick={onClose} aria-label="Închide">
              <X size={22} />
            </button>
          </div>
        </div>
        <div className="glass-modal-content">{children}</div>
      </div>
    </div>
  );
};

export default GlassModal;
