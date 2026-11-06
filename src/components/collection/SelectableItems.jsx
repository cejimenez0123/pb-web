import shortName from "../../core/shortName";
import styles from "../../styles/style";
import Pill from "../Pill";
import SelectableItem from "./SelectableItem";

function SelectedItems({
  items,
  type,
  onUndo,
  onOpen,
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="mb-6 border-b  border-plumb-muted p-3 dark:bg-transparent ">
      <div className="mb-2 flex items-center justify-between">
     
        <p className={styles.text.section}>
          Added
        </p>

        <span className="text-sm  text-plumb-ink/50 dark:text-plumb-surface/40">
          {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <SelectableItem
            key={item.id}
            title={
              shortName(item.title, 60) ||
              "Untitled"
            }
            subtitle={
              type === "story"
                ? item.status
                : item.purpose || item.type || "Room"
            }
            actionLabel="Undo"
            onAction={() => onUndo(item)}
            onOpen={() => onOpen(item)}
            accent={type === "story" ? "blue" : "purple"}
          />
        ))}
      </div>
    </div>
  );
}
export default SelectedItems
