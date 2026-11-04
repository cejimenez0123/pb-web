import styles from "../styles/style";
import InfoTooltip from "./InfoTooltip";

function SettingRow({
  id,
  title,
  description,
  checked,
  onChange,
  tooltip,
}) {
  return (
    <div
    className={styles.settingRow.container}

    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <label
            htmlFor={id}
            className={styles.settingRow.label}
       
          >
            {title}
          </label>

        
        </div>

        <p
          id={`${id}-description`}

        className={styles.settingRow.description}
        >
          {description}
        </p>
      </div>

      <label
      
        className="
          relative
          mt-0.5
          inline-flex
          shrink-0
          cursor-pointer
          items-center
        "
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={styles.settingRow.input+ "       bg-transparent"}
     
          aria-describedby={`${id}-description`}
        />

        <span
          aria-hidden="true"
          className={`
            h-6
            w-11
            rounded-full
            border
            ${checked?" border-2 ":""}
            border-gray-300
            bg-gray-200
            transition
            peer-checked:border-blueSea
            peer-checked:bg-blueSea
            peer-focus-visible:outline
            peer-focus-visible:outline-2
            peer-focus-visible:outline-offset-2
            peer-focus-visible:outline-blueSea
            dark:border-gray-600
            dark:bg-gray-700
          `}
        />

        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow-sm
            transition
            peer-checked:translate-x-5
          "
        />
      </label>
    </div>
  );
}

export default SettingRow