import { useState, useEffect, useContext } from "react";
import { IonImg } from "@ionic/react";
import Context from "../context";
// import { initGA, sendGAEvent } from "../core/ga4";
import ErrorBoundary from "../ErrorBoundary";
import SpotifyEmbed from "./SpotifyEmbed";

function LinkNode({ title, description, image, links = [], isGrid }) {
  const { isTablet } = useContext(Context);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // initGA();
  }, []);

  const handleClick = (link) => {
    sendGAEvent("outbound_click", {
      destination: link.name ?? link.url,
      link_title: title,
      link_type: link.url.includes("youtube")
        ? "youtube"
        : link.url.includes("spotify")
        ? "spotify"
        : "external",
      source: "link_node",
      layout: isGrid ? "grid" : "list",
    });

    window.open(link.url, "_blank");
  };

  return (
    <ErrorBoundary>
      <div
        className="
        bg-[#FFFFFF]
        border border-emerald-100
        dark:bg-transparent
        rounded-2xl
        shadow-sm
        hover:shadow-md
        transition
        p-4
        my-4
        "
      >
        <div className="max-w-2xl flex gap-4 flex-col sm:flex-row items-center">
          {image && (
            <div className="w-[70px] h-[70px] rounded-xl overflow-hidden flex-shrink-0 bg-emerald-50">
              <img
                src={image}
                className="object-cover p-2 w-full h-full"
              />
            </div>
          )}

          <div className="flex flex-col dark:text-plumb-surface text-plumb-ink">
            <h4 className="font-semibold dark:text-plumb-surface text-plumb-ink text-sm">{title}</h4>

            {description && (
              <p className="text-xs dark:text-plumb-surface text-plumb-ink mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* PRIMARY LINK */}
        {links.length > 0 && (
          <div
            onClick={() => handleClick(links[0])}
            className="
            mt-3
            text-sm
            bg-emerald-500
            dark:bg-emerald-50/30
            dark:border-emerald-500/40
            border border-1 border-emerald-500
            text-white
            px-3
            py-2
            rounded-2xl
            hover:bg-emerald-600
            transition
            btn
            "
          >
            {links[0].name ?? "Open"}
          </div>
        )}

        {/* EXPAND BUTTON */}
        {links.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="
            mt-2
            text-xs
           dark:text-plumb-surface text-plumb-ink
            hover:underline
            "
          >
            {expanded ? "Hide links" : "More links"}
          </button>
        )}

        {/* EXPANDED LINKS */}
        {expanded && (
          <div className="mt-3 flex flex-col gap-2">
            {links.slice(1).map((link, i) => (
              <button
                key={i}
                onClick={() => handleClick(link)}
                className="
                text-left
                text-sm
                border
                border-emerald-100
                rounded-lg
                px-3
                py-2
                hover:bg-emerald-50
                transition
                "
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default LinkNode;
