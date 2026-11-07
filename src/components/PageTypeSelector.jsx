import styles from "../styles/style";

 const PAGE_TYPES = [
  {
    value: "html",
    label: "Text",
    icon: (
      <>
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </>
    ),
  },
  {
    value: "image",
    label: "Picture",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </>
    ),
  },
  // {
  //   value: "video",
  //   label: "Video",
  //   icon: (
  //     <>
  //       <rect x="3" y="5" width="18" height="14" rx="3" />
  //       <path d="m10 9 5 3-5 3z" />
  //     </>
  //   ),
  // },
  {
    value: "link",
    label: "Link",
    icon: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
  },
]; 
 function PageTypeSelector({ value, onChange }) {
  return (
    <section className="mb-5" aria-label="Page format">
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <span className="text-xs font-semibold tracking-[0.12em] text-plumb-muted dark:text-plumb-darkMuted">
          PAGE FORMAT
        </span>
        <span className="text-xs text-plumb-subtle dark:text-plumb-darkSubtle">
          Choose how to create
        </span>
      </div>

      <div
        role="group"
        aria-label="Choose page type"
        className="flex w-full gap-1 rounded-2xl   border-2 border border-plumb-blueSea/50 p-1 "
      >
        {PAGE_TYPES.map((item) => {
          const active = value === item.value;

          return (
            <div
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              aria-pressed={active}
              className={`
                flex min-w-0 flex-1 items-center justify-center gap-1.5
                rounded-xl px-2 py-3 text-xs font-semibold
                transition-all duration-200  sm:gap-2 sm:px-3 sm:text-sm
                active:scale-[0.97]
          
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-plumb-mint focus-visible:ring-offset-2
                dark:focus-visible:ring-offset-plumb-dark-surface
                ${
                  active
                    ? "  shadow-sm ring-1 ring-plumb-mint/20   dark:ring-plumb-mintLight/20"
                    : ""
                }
              `}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0"
              >
                {item.icon}
              </svg>
              <p  className={" dark:text-plumb-mintLight font-open-sans"+"truncate"}>{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default PageTypeSelector