export default function BrandLogo() {
  return (
    <span className="mc-brand-logo" aria-hidden>
      <span className="mc-brand-logo-glow">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kangaroo-logo.png"
          alt=""
          className="mc-brand-logo-img"
          width={36}
          height={42}
        />
      </span>
    </span>
  );
}
