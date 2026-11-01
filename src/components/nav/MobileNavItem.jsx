export default function MobileNavItem({
  label,
  onClick,
  active = true
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`
        relative
        flex
        flex-1
        min-w-0
        min-h-16
        items-center
        justify-center
        px-1
        pt-2
        pb-3
        rounded-xl
        bg-transparent
        text-sm
        sm:text-base
        leading-none
        tracking-[-0.02em]
        font-medium
        transition-colors
        duration-200
        touch-manipulation
        pointer-events-auto
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-inset
        focus-visible:ring-plumb-mint
        ${
          active
            ? 'text-plumb-mint dark:text-mintLight'
            : 'text-plumb-text dark:text-plumb-darkText'
        }
      `}
    >
      {label}
    </button>
  );
}