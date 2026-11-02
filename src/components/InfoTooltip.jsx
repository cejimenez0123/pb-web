import { useState, useEffect, useRef } from "react";
const infoIcon = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px" fill="#FFFFFF"><path d="M10.59,6.41Q10,5.82 10,5q0-0.83 0.59-1.41T12,3t1.41,0.59T14,5q0,0.82-0.59,1.41T12,7T10.59,6.41ZM10.5,21V9h3V21h-3Z"/></svg>);
function InfoTooltip({ text = "This is a tooltip" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation(); // prevent triggering outside click
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      onClick={handleToggle}
      className="relative h-fit my-auto   group"
    >
 
{infoIcon}
      <div
        className={`absolute bg-slate-100 z-[100] open-sans-medium text-sm text-black p-2 bottom-full mb-2 rounded-lg min-w-24 shadow-lg transition-opacity duration-200 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default InfoTooltip;