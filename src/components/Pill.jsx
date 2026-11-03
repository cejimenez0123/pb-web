

import styles from "../styles/style";

export default function Pill({
  label,
  onClick,
  icon,
  baseClass,
}) {
  const isInteractive = typeof onClick === "function";

  const className = [
    styles.pill.base,
    isInteractive
      ? styles.pill.interactive
      : styles.pill.static,
    baseClass || styles.pill.default,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && (
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className={styles.pill.icon}
        />
      )}
      <span className="dark:text-plumb-darkText">{label}</span>
    </>
  );

  if (!isInteractive) {
    return (
      <span className={className}>
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}
