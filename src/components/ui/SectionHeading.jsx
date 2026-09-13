export function SectionHeading({
  eyebrow,
  title,
  description,
  titleSize = "md",
  className = "",
}) {
  const sizes = {
    sm: "text-3xl md:text-4xl",
    md: "text-4xl md:text-5xl",
    lg: "text-5xl md:text-7xl",
  };

  return (
    <header className={className}>
      {eyebrow && (
        <div className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-plumb-muted">
          {eyebrow}
        </div>
      )}
      <h1
        className={`font-display font-semibold leading-[0.98] text-plumb-ink ${sizes[titleSize]}`}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-4xl font-display text-xl leading-[1.55] text-plumb-muted md:text-2xl">
          {description}
        </p>
      )}
    </header>
  );
}