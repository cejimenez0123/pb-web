

// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { IonImg } from "@ionic/react";
// import Enviroment from "../core/Enviroment";
// import Context from "../context";
// import SpotifyEmbed from "./SpotifyEmbed";
// import SoundCloudEmbed from "./page/SoundcloudEmbed";

// function normalizeUrl(url) {
//   if (!url) return "";
//   try {
//     const fixed = url.startsWith("http") ? url : `https://${url}`;
//     return new URL(fixed).href;
//   } catch {
//     return "";
//   }
// }

// function getHostname(url) {
//   try {
//     return new URL(url).hostname;
//   } catch {
//     return url;
//   }
// }

// export default function LinkPreview({ url, compact }) {
//   const { isPhone } = useContext(Context);
//   const [previewData, setPreviewData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const normalizedUrl = normalizeUrl(url);
//   const isSpotify = normalizedUrl.includes("open.spotify.com");
//   const isSoundCloud = normalizedUrl.includes("soundcloud.com");
//   const isYouTube =
//     normalizedUrl.includes("youtube.com") ||
//     normalizedUrl.includes("youtu.be");

//   useEffect(() => {
//     if (!normalizedUrl) return;
//     if (isSpotify) { setPreviewData({ type: "spotify" }); return; }
//     if (isSoundCloud) { setPreviewData({ type: "soundcloud" }); return; }
//     if (isYouTube) { setPreviewData({ type: "youtube" }); return; }
//     fetchPreview(normalizedUrl);
//   }, [normalizedUrl]);

//   const fetchPreview = async (url) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${Enviroment.proxyUrl}/preview?url=${encodeURIComponent(url)}`,
//         { timeout: 8000 }
//       );
//       setPreviewData({
//         title: res.data?.title || url,
//         description: res.data?.description || "",
//         image: res.data?.image || null,
//       });
//     } catch (err) {
//       const hostname = getHostname(url);
//       setPreviewData({
//         title: hostname,
//         description: "Tap to open link",
//         image: `https://www.google.com/s2/favicons?domain=${hostname}`,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClick = () => window.open(normalizedUrl, "_blank");

//   if (previewData?.type === "spotify") {
//     return <SpotifyEmbed url={normalizedUrl} compact={compact} />;
//   }

//   if (previewData?.type === "soundcloud") {
//     return <SoundCloudEmbed url={normalizedUrl} />;
//   }

//   if (previewData?.type === "youtube") {
//     const id =
//       normalizedUrl.split("v=")[1]?.split("&")[0] ||
//       normalizedUrl.split("youtu.be/")[1];
//     return (
//       <img
//         src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
//         className="rounded-xl w-full cursor-pointer active:scale-[0.98] transition"
//         onClick={handleClick}
//         alt="YouTube thumbnail"
//       />
//     );
//   }

//   if (loading) {
//     return (
//       <div className="h-32 bg-base-bg dark:bg-base-bgDark animate-pulse rounded-xl border border-soft" />
//     );
//   }

//   if (!previewData) return null;

//   const hostname = getHostname(normalizedUrl);

//   return (
//     <div
//       onClick={handleClick}
//       className="rounded-xl border border-soft bg-base-surface dark:bg-base-bgDark shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition"
//     >
//       {previewData.image && (
//         <IonImg
//           src={previewData.image}
//           className="w-full h-40 object-cover"
//           alt="Link preview"
//         />
//       )}
//       <div className="p-3">
//         <h4 className="text-sm font-medium text-soft dark:text-cream line-clamp-2">
//           {previewData.title}
//         </h4>
//         {!isPhone && previewData.description && (
//           <p className="text-xs text-soft dark:text-cream opacity-60 mt-1 line-clamp-2">
//             {previewData.description}
//           </p>
//         )}
//         <p className="text-xs text-soft dark:text-cream opacity-40 mt-1 truncate">
//           {hostname}
//         </p>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { IonImg } from "@ionic/react";
import Enviroment from "../core/Enviroment";
import Context from "../context";
import SpotifyEmbed from "./SpotifyEmbed";
import SoundCloudEmbed from "./page/SoundcloudEmbed";

function normalizeUrl(url) {
  if (!url) return "";
  try {
    const fixed = url.startsWith("http") ? url : `https://${url}`;
    return new URL(fixed).href;
  } catch {
    return "";
  }
}

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function LinkPreview({ url, compact }) {
  const { isPhone } = useContext(Context);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guard: no url at all
  if (!url) return null;

  const normalizedUrl = normalizeUrl(url);

  // Guard: url couldn't be normalized
  if (!normalizedUrl) return null;

  const isSpotify    = normalizedUrl.includes("open.spotify.com");
  const isSoundCloud = normalizedUrl.includes("soundcloud.com");
  const isYouTube    = normalizedUrl.includes("youtube.com") || normalizedUrl.includes("youtu.be");

  useEffect(() => {
    if (!normalizedUrl) return;
    if (isSpotify)    { setPreviewData({ type: "spotify" });    return; }
    if (isSoundCloud) { setPreviewData({ type: "soundcloud" }); return; }
    if (isYouTube)    { setPreviewData({ type: "youtube" });    return; }
    fetchPreview(normalizedUrl);
  }, [normalizedUrl]);

  const fetchPreview = async (targetUrl) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${Enviroment.proxyUrl}/preview?url=${encodeURIComponent(targetUrl)}`,
        { timeout: 8000 }
      );
      setPreviewData({
        title:       res.data?.title       || targetUrl,
        description: res.data?.description || "",
        image:       res.data?.image       || null,
      });
    } catch {
      const hostname = getHostname(targetUrl);
      setPreviewData({
        title:       hostname,
        description: "Tap to open link",
        image:       `https://www.google.com/s2/favicons?domain=${hostname}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => window.open(normalizedUrl, "_blank");

  if (previewData?.type === "spotify") {
    return <SpotifyEmbed url={normalizedUrl} compact={compact} />;
  }

  if (previewData?.type === "soundcloud") {
    return <SoundCloudEmbed url={normalizedUrl} />;
  }

  if (previewData?.type === "youtube") {
    const id =
      normalizedUrl.split("v=")[1]?.split("&")[0] ||
      normalizedUrl.split("youtu.be/")[1];
    if (!id) return null;
    return (
      <img
        src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
        className="rounded-xl w-full cursor-pointer active:scale-[0.98] transition"
        onClick={handleClick}
        alt="YouTube thumbnail"
      />
    );
  }

  if (loading) {
    return <div className="h-32 bg-base-bg dark:bg-base-bgDark animate-pulse rounded-xl border border-soft" />;
  }

  if (!previewData) return null;

  const hostname = getHostname(normalizedUrl);

  return (
    <div
      onClick={handleClick}
      className="rounded-xl border border-soft bg-base-surface dark:bg-base-bgDark shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition"
    >
      {previewData.image && (
        <IonImg src={previewData.image} className="w-full h-40 object-cover" alt="Link preview" />
      )}
      <div className="p-3">
        <h4 className="text-sm font-medium text-soft dark:text-cream line-clamp-2">
          {previewData.title}
        </h4>
        {!isPhone && previewData.description && (
          <p className="text-xs text-soft dark:text-cream opacity-60 mt-1 line-clamp-2">
            {previewData.description}
          </p>
        )}
        <p className="text-xs text-soft dark:text-cream opacity-40 mt-1 truncate">
          {hostname}
        </p>
      </div>
    </div>
  );
}