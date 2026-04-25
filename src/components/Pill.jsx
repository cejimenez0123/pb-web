
export default function Pill({
  label,
  onClick,
  icon,
  baseClass = "bg-gray-100",
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 text-xs px-4 py-3 shadow-sm rounded-full ${baseClass} text-soft transition active:scale-[0.97]`}
    >
      {icon && <img src={icon} className="w-4 h-4" />}
      {label}
    </div>
  );
}