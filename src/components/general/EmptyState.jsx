import styles from "../../styles/style"

function EmptyState({
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div
    className={styles.pageShell.body+" flex flex-col"}
    //  className={styles.tabs.container+" text-center py-2"}
    >

      <h1      className={styles.tabs.text.heading+" mx-auto"}
  
      >
        {title}
      </h1>

      {description && (
        <p
        
          className={styles.tabs.text.body+" mx-auto"}
  
        >
          {description}
        </p>
      )}

      {action && onAction && (
        <div
          type="button"
          onClick={onAction}
          className={styles.button.accent + "       mx-auto " +styles.button.base}

        >
          <span className="mx-auto my-auto">{action}</span>
        </div>
      )}
    </div>
  );
}
export default EmptyState