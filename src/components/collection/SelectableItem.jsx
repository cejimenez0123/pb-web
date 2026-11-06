import styles from "../../styles/style";
import Pill from "../Pill";

export default function SelectableItem({
  title,
  subtitle,
  actionLabel,
  onAction,
  onOpen,
  accent = "blue",
}) {


  return (
    <div
 className={styles.pageShell.row.outer+" bg-transparent"} >
  

  
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate text-sm font-medium dark:text-plumb-surface text-plumb-ink">
          {title || "Untitled"}
        </p>

        {subtitle ? (
          <p className="mt-1 truncate text-xs text-ink dark:text-plumb-darkSurface">
            {subtitle}
          </p>
        ) : null}
      </button>

      <Pill
        label={actionLabel}
        baseClass={styles.pill.interactive}
        onClick={onAction}
        
       
      
      />
    </div>
  );
}
