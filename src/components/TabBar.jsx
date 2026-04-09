const TabBar = ({ tabs,active, onChange }) => (
  <div className="flex items-center flex-row justify-center  gap-1 bg-gray-100 rounded-xl p-1 px-2 sm:px-4">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key.toLowerCase())}
        className={`
          text-center 
          px-3 py-2 
          text-[1.2em]
          text-xs sm:text-sm 
          rounded-lg transition 
          whitespace-nowrap
          ${active === tab.key
            ? "text-white bg-soft shadow-sm"
            : "bg-softBlue text-soft"}
        `}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
export default TabBar;