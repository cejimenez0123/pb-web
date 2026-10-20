import styles from "../../styles/style"

function EmptyState({
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div className={styles.tabs.container}>
      {/* <div
        className="
          flex
          min-h-44
          flex-col
    //     items-center
    //     justify-center
    //     border
    //     border-dashed
    //     border-border-soft
    //     bg-base-bg
    //     px-6
        
    //     py-10
    //     text-center
    //     sm:min-h-48
    //   "
    // >*/}

      <h1      className={styles.tabs.text.heading}
        // className="
        //   font-serif
        //   text-xl
        //   font-semibold
        //   text-text-primary
        // "
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