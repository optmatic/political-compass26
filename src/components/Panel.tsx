import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Panel({ children, className = "", glow = false }: PanelProps) {
  return (
    <div
      className={`mc-panel relative ${glow ? "mc-panel-glow" : ""} ${className}`}
    >
      <span className="mc-corner mc-corner-tl" />
      <span className="mc-corner mc-corner-tr" />
      <span className="mc-corner mc-corner-bl" />
      <span className="mc-corner mc-corner-br" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
