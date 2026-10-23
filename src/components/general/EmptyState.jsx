import styles from "../../styles/style"

function EmptyState({
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div className={styles.tabs.container+" text-center py-2"}>

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
        <button
          type="button"
          onClick={onAction}
          className={styles.button.primary}

        >
          {action}
        </button>
      )}
    </div>
  );
}
export default EmptyState