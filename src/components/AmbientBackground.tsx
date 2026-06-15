export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="ambient-vanta absolute inset-0" />
      <div className="ambient-wash absolute inset-0" />
      <div className="ambient-vignette absolute inset-0" />
    </div>
  );
}
