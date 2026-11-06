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
    <div className="mb-6 rounded-2xl border border-blueSea/20 bg-softBlue/20 p-3 dark:bg-plumb-surface Dark">
      <div className="mb-2 flex items-center justify-between">
        {/* <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blueSea"> */}
        <p className={styles.text.section}>
          Added
        </p>

        <span className="text-xs text-gray-500 dark:text-gray-400">
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
