const TABS = [
  { key: "portfolio", label: "Portfolio" },
  { key: "archive", label: "Archive" },
  { key: "collections", label: "Collections" },
  { key: "events", label: "Events" },
  { key: "details", label: "Details" },
];

function ProfileSectionTabs({ active, onChange }) {
  return (
    <nav
      aria-label="Profile sections"
      className="
        w-[100%]
        border-b
        border-soft
      "
    >
      <div
        className="
          flex
          w-[100%]
          max-w-[48rem]
          items-center
          gap-5
          overflow-x-auto
          no-scrollbar
          sm:gap-6
          md:gap-7
        "
      >
        {TABS.map((item) => {
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              aria-current={isActive ? "page" : undefined}
              className={`
                relative
                shrink-0
                whitespace-nowrap
                px-0
                pb-3
                pt-1
                text-sm
                leading-none
                transition-colors
                duration-200
                ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-800"
                }
              `}
            >
              {item.label}

              <span
                aria-hidden="true"
                className={`
                  absolute
                  bottom-[-1px]
                  left-0
                  h-[2px]
                  bg-emerald-800
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "w-[100%] opacity-100"
                      : "w-0 opacity-0"
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default ProfileSectionTabs;
