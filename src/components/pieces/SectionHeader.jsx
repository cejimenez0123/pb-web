
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
    <div className={s.container}>
      <div className={s.layout}>
        <div className={s.content}>
          {eyebrow && (
            <p className={s.eyebrow}>
              {eyebrow}
            </p>
          )}

          <h2 className={s.title}>
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
            className={styles.button.base+` ${buttonClass}`}
            
          >
            {actionLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export default SectionHeader;
