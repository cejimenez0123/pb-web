export function EventDateBadge({ day, month }) {
  return (
    <div className="flex h-[78px] w-[80px] shrink-0 flex-col items-center justify-center rounded-[17px] border border-plumb-line bg-plumb-cream">
      <span className="text-[14px] font-medium tracking-[0.08em] text-plumb-muted">
        {month}
      </span>
      <span className="font-display text-[31px] font-semibold leading-none">
        {day}
      </span>
    </div>
  );
}
