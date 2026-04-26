const TabBar = ({ tabs,active, onChange }) => (
  <div className="flex items-center flex-row justify-center  gap-1 dark:bg-base-bgDark dark:border-cream bg-gray-100 rounded-xl p-1 px-2 sm:px-4">
    {tabs.map((tab) => (
      <div
        key={tab.key}
        onClick={() => onChange(tab.key.toLowerCase())}
        className={`
          text-center 
          px-2 py-1 rounded-full
          btn
          text-[1.2em]
          text-xs sm:text-sm 
          rounded-lg transition 
          whitespace-nowrap
          ${active === tab.key
            ? "text-cream bg-soft shadow-sm"
            : "bg-softBlue  dark:bg-base-bgDark dark:border-softBlue dark:text-cream text-soft"}
        `}
      >
        {tab.label}
      </div>
    ))}
  </div>
);
export default TabBar;