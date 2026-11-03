
import styles from "../styles/style";

const TabBar = ({
  tabs = [],
  active,
  onChange,
  variant = "editorial",
  className = "",
  ariaLabel = "Section navigation",
}) => {
  const isEditorial = variant === "editorial";
  const tabStyles = 
     styles.tabs.pill;

  return (
    <nav
      aria-label={ariaLabel}
      className={`${tabStyles.container} ${className}`}
    >
      <div className={tabStyles.wrapper}>
        {tabs.map((tab) => {
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              aria-current={isActive ? "page" : undefined}
              aria-pressed={isActive}
              className={`
                ${tabStyles.button}
                ${isActive ? tabStyles.active : tabStyles.inactive}
              `}
            >
              {tab.label}

              {isEditorial && (
                <span
                  aria-hidden="true"
                  className={`
                    ${tabStyles.indicator}
                    ${isActive ? "opacity-100" : "opacity-0"}
                  `}
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