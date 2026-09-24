
const TabBar = ({
  tabs = [],
  active,
  onChange,
  variant = "pill",
  className = "",
}) => {
  const isEditorial = variant === "editorial";

  return (
    <nav
      className={`
        w-full
        ${isEditorial
          ? "overflow-x-auto no-scrollbar"
          : ""}
        ${className}
      `}
      aria-label="Section navigation"
    >
      <div
        className={`
          flex
          items-center

          ${
            isEditorial
              ? `
                min-w-max
                gap-6
                border-b
                border-soft
                sm:gap-8
                lg:gap-10
              `
              : `
                justify-center
                gap-1
                rounded-xl
                bg-gray-100
                p-1
                px-2
                dark:bg-base-bgDark
              `
          }
        `}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              aria-current={isActive ? "page" : undefined}
              className={
                isEditorial
                  ? `
                    relative
                    shrink-0
                    whitespace-nowrap
                    pb-4
                    text-sm
                    transition-colors
                    ${
                      isActive
                        ? "text-emerald-900"
                        : "text-gray-500 hover:text-emerald-800"
                    }
                  `
                  : `
                    shrink-0
                    rounded-lg
                    px-3
                    py-2
                    text-xs
                    transition
                    sm:text-sm
                    ${
                      isActive
                        ? "bg-soft text-cream shadow-sm"
                        : "bg-softBlue text-soft"
                    }
                  `
              }
            >
              {tab.label}

              {isEditorial && isActive && (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    bottom-[-1px]
                    left-0
                    right-0
                    h-[2px]
                    bg-emerald-800
                  "
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;