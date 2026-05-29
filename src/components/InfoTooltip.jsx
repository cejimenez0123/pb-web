import { useState, useEffect, useRef } from "react";
import info from "../images/icons/info.svg";
import { IonImg } from "@ionic/react";

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
      className="relative h-fit w-fit mx-2 group"
    >
      <IonImg
        className="h-10 w-10"
        alt="info"
        style={{ filter: "invert(1)" }}
        src={info}
      />

      <div
        className={`absolute bg-slate-100 open-sans-medium text-sm text-black p-2 bottom-full mb-2 rounded-lg min-w-24 shadow-lg transition-opacity duration-200 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default InfoTooltip;