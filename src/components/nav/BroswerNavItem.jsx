
function BrowserNavItem({
  label,
  onClick,
  active = true,
}) {
  return (
    <div className='    "hover:bg-white/10 dark:hover:bg-plumb-mint/15 dark:bg-plumb-dark-surface bg-emerald-800 border-b border-1 border-plumb-darkText/30 py-2 text-plumb-ink w-[100%] hover:bg-plumb-mintHover'>
    <button
      type="button"
      onClick={onClick}
            // text-base
      className={`
 font-serif
        flex
        items-center
        px-2
     
        text-white
 bg-transparent
        leading-none
        text-left
        tracking-[-0.02em]
        transition-colors
        ${
          active
            ? 'text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }
      `}
      aria-current={active ? 'page' : undefined}
    >
      <h6 className='text-[1rem]'>{label}</h6>
    </button>
    </div>
  );
}
export default BrowserNavItem