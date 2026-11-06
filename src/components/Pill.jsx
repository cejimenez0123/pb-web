

import styles from "../styles/style";

export default function Pill({
  label,
  onClick,
  icon,
  baseClass="",
}) {
  const isInteractive = typeof onClick === "function";

  const className = baseClass


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
      <span className="">{label}</span>
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
    <div
      // type="button"
      onClick={onClick}
      className={className+" "+styles.pill.base+" "+styles.pill.interactive}
    >
      {content}
    </div>
  );
}
