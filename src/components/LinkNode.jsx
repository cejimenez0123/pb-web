import { useState, useEffect, useContext } from "react";
import { IonImg } from "@ionic/react";
import Context from "../context";
import { initGA, sendGAEvent } from "../core/ga4";
import ErrorBoundary from "../ErrorBoundary";
import SpotifyEmbed from "./SpotifyEmbed";

function LinkNode({ title, description, image, links = [], isGrid }) {
  const { isTablet } = useContext(Context);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    initGA();
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
        rounded-2xl
        shadow-sm
        hover:shadow-md
        transition
        p-4
        my-4
        "
      >
        <div className="flex gap-4 flex-col sm:flex-row items-center">
          {image && (
            <div className="w-[70px] h-[70px] rounded-xl overflow-hidden flex-shrink-0 bg-emerald-50">
              <IonImg
                src={image}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="flex flex-col text-emerald-900">
            <h4 className="font-semibold text-sm">{title}</h4>

            {description && (
              <p className="text-xs text-emerald-700 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* PRIMARY LINK */}
        {links.length > 0 && (
          <button
            onClick={() => handleClick(links[0])}
            className="
            mt-3
            text-sm
            bg-emerald-500
            text-white
            px-3
            py-2
            rounded-lg
            hover:bg-emerald-600
            transition
            "
          >
            {links[0].name ?? "Open"}
          </button>
        )}

        {/* EXPAND BUTTON */}
        {links.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="
            mt-2
            text-xs
            text-emerald-600
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
