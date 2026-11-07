import styles from "../../styles/style"

function EmptyState({
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div
    className={styles.pageShell.body}
    //  className={styles.tabs.container+" text-center py-2"}
    >

      <h1      className={styles.tabs.text.heading}
  
      >
        {title}
      </h1>

      {description && (
        <p
          className={styles.tabs.text.body}
  
        >
          {description}
        </p>
      )}

      {action && onAction && (
        <div
          type="button"
          onClick={onAction}
          className={styles.button.primary + "  mb-4 px-6 py-3 " +styles.button.base}

        >
          {action}
        </div>
      )}
    </div>
  );
}
export default EmptyState