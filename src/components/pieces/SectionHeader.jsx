
import styles from "../../styles/style";

function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  buttonClass
}) {
  const s = styles.sectionHeader;

  return (
    <div 
    className={styles.pageShell.body+" mt-8 px-2"}
  
    >
      <div className={s.layout}>
        <div className={s.content+" h-[100%]"}>
          {eyebrow && (
            <p className={s.eyebrow}>
              {eyebrow}
            </p>
          )}

          <h2 className={s.title+" my-auto"}>
            {title}
          </h2>

          {description && (
            <p className={s.description}>
              {description}
            </p>
          )}
        </div>

        {actionLabel && onAction && (
          <div
            type="button"
            onClick={onAction}
            className={[styles.button.base, "rounded-full ",buttonClass].join(" ")}
   
            
          >
            <h6 className="my-auto   ">{actionLabel}</h6>
          </div>
        )}
      </div>
    </div>
  );
}

export default SectionHeader;
