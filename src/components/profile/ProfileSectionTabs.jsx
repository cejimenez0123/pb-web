import styles from "../../styles/style";

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
      className={`${
        styles.tabs.container
      }  border-b border-plumb-border bg-transparent`}
  

    >
      <div
        className={styles.tabs.wrapper}

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
                px-3
                py-3
                rounded-t-lg
                text-sm
                leading-none
                transition-colors
                bg-plumb-tag-blue/30
                duration-200
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-plumb-focus
                focus-visible:ring-offset-2
                focus-visible:ring-offset-plumb-surface
                dark:focus-visible:ring-offset-plumb-dark-canvas
                ${
                  isActive
                    ? styles.text.section
                    : `
                      text-plumb-muted
                      hover:text-plumb-ink
                      dark:text-plumb-darkMuted
                      dark:hover:text-plumb-darkText
                    `
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
                  rounded-full
               
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