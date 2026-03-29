// // import { useState, useEffect, useContext } from 'react';
// // import Enviroment from '../core/Enviroment';
// // import "../App.css";
// // import { initGA, sendGAEvent } from '../core/ga4';
// // import adjustScreenSize from '../core/adjustScreenSize';
// // import Context from '../context';
// // import SpotifyEmbed from './SpotifyEmbed';
// // import axios from 'axios';
// // import { IonImg } from '@ionic/react';
// // function LinkPreview({ url, isGrid }) {
// //   const { isPhone, isHorizPhone } = useContext(Context);
// //   const [previewData, setPreviewData] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   const size = "w-[100%] sm:max-w-[47em]"

// //   useEffect(() => {
// //     initGA();
// //   }, []);

// //   useEffect(() => {

// //     if (!url) return;

// //     const isSpotify = url.includes('https://open.spotify.com/');
// //     const isPlumbum = url.includes("plumubum.app");

// //     if (isSpotify) {
// //       setPreviewData({ title: "Spotify" });
// //       setLoading(false);
// //     } else {
// //       fetchPreview(url).catch(err => {
// //         console.error("Failed to fetch preview:", err);
// //         setLoading(false);
// //       });
// //     }
// //   }, []);


// // const fetchPreview = async (url) => {
// //   try {
// //     const response = await axios.get(
// //       `${Enviroment.proxyUrl}/preview?url=${encodeURIComponent(url)}`
// //     );

// //     const data = response.data; // ✅ axios already gives JSON

// //     // 
// //     setPreviewData(data);
// //   } catch (error) {
// //    } finally {
// //     setLoading(false);
// //   }
// // };



// //   const handleClick = () => {
// //     sendGAEvent("Click Link Preview", `Navigate to ${previewData?.title || ""}:${url}`);
// //     window.open(url, '_blank');
// //   };

// //   const isYouTubeURL = (url) => url.includes('youtube.com') || url.includes('youtu.be');

// //   const extractYouTubeVideoId = (url) => {
// //     const videoIdRegex = /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
// //     const match = url.match(videoIdRegex);
// //     return match ? match[1] : '';
// //   };


// //   if (url?.includes('https://open.spotify.com/')) {
// //     return <SpotifyEmbed url={url} />;
// //   }

// //   if (loading) return <div className={"skeleton " + size} />;

// //   if (!previewData) return <p onClick={handleClick}>Failed to fetch link preview.</p>;

// //   if (isYouTubeURL(url)) {
// //     const videoId = extractYouTubeVideoId(url);
// //     const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
// //     return <img onClick={handleClick} style={{ cursor: 'pointer' }} className={`rounded-lg p-1 ${size}`} src={videoThumbnail} alt="Video Thumbnail" />;
// //   }

// //   const imageView = () => {

// //       return previewData.image && (
// //         <a href={url}>
// //           <IonImg className='rounded-t-lg' src={previewData.image} alt={previewData.title} />
// //         </a>
// //       );
  
// //   };

// //   const previewTitle = () => {
// //     if (previewData?.title !== "Spotify") {
// //       return <h4 className={isGrid ? "" : 'text-slate-800 bg-emerald-200 text-[1rem] p-4'}>{previewData?.title}</h4>;
// //     }
// //     return null;
// //   };

// //   const previewDescription = () => {
// //     if (!isPhone && !isGrid &&previewData && previewData.title !== "Spotify") {
// //       return <h6 className={isGrid ? "overflow-scroll pt-2 px-1 mx-auto" : 'text-slate-800 p-3 bg-emerald-200 text-[0.8rem]'}>{previewData?.description}</h6>;
// //     }
// //     return null;
// //   };

// //   return (
// //     <div className=" w-[90vw] sm:w-[50em] sm:w-page mx-auto" onClick={handleClick} style={{ cursor: 'pointer' }}>
// //       {imageView()}
// //       <div className='text-left overflow-clip open-sans-medium'>
// //         {previewDescription()}
// //         {isGrid ? null : previewTitle()}
// //       </div>
// //     </div>
// //   );
// // }

// // export default LinkPreview;


// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { IonImg } from "@ionic/react";

// import Enviroment from "../core/Enviroment";
// import Context from "../context";
// import SpotifyEmbed from "./SpotifyEmbed";

// function LinkPreview({ url }) {
//   const { isPhone } = useContext(Context);

//   const [previewData, setPreviewData] = useState(null);
//   const [loading, setLoading] = useState(false);

// const normalizeUrl = (url) => {
//   if (!url) return "";
//   return url.startsWith("http") ? url : `https://${url}`;
// };

// // when saving:
// // handleChange("data", normalizeUrl(value));

//   const normalizedUrl = normalizeUrl(url);

//   const isYouTube = normalizedUrl.includes("youtube.com") || normalizedUrl.includes("youtu.be");
//   const isSpotify = normalizedUrl.includes("open.spotify.com");

//   useEffect(() => {
//     if (!normalizedUrl) return;

//     setLoading(true);

//     // 🎧 Spotify
//     if (isSpotify) {
//       setPreviewData({ type: "spotify" });
//       setLoading(false);
//       return;
//     }

//     // 🎥 YouTube
//     if (isYouTube) {
//       setPreviewData({ type: "youtube" });
//       setLoading(false);
//       return;
//     }

//     fetchPreview(normalizedUrl);
//   }, [normalizedUrl]);

//   const fetchPreview = async (url) => {
//     try {
//       const res = await axios.get(
//         `${Enviroment.proxyUrl}/preview?url=${encodeURIComponent(url)}`
//       );

//       setPreviewData(res.data);
//     } catch (err) {
//       console.error(err);

//       // ✅ fallback instead of failing silently
//       setPreviewData({
//         title: url,
//         description: "Preview unavailable",
//         image: null,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClick = () => {
//     window.open(normalizedUrl, "_blank");
//   };

//   // ===== SPECIAL CASES =====
//   if (previewData?.type === "spotify") {
//     return <SpotifyEmbed url={normalizedUrl} />;
//   }

//   if (previewData?.type === "youtube") {
//     const id = normalizedUrl.split("v=")[1]?.split("&")[0] ||
//                normalizedUrl.split("youtu.be/")[1];

//     return (
//       <img
//         src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
//         className="rounded-xl w-full"
//         onClick={handleClick}
//       />
//     );
//   }

//   // ===== LOADING =====
//   if (loading) {
//     return <div className="h-32 rounded-xl bg-gray-100 animate-pulse" />;
//   }

//   if (!previewData) return null;

//   // ===== DEFAULT PREVIEW (Apple style) =====
//   return (
//     <div
//       onClick={handleClick}
//       className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden cursor-pointer transition active:scale-[0.98]"
//     >
//       {previewData.image && (
//         <IonImg
//           src={previewData.image}
//           className="w-full h-40 object-cover"
//         />
//       )}

//       <div className="p-3">
//         <h4 className="text-sm font-semibold text-black line-clamp-2">
//           {previewData.title || normalizedUrl}
//         </h4>

//         {!isPhone && previewData.description && (
//           <p className="text-xs text-gray-500 mt-1 line-clamp-2">
//             {previewData.description}
//           </p>
//         )}

//         <p className="text-xs text-gray-400 mt-1 truncate">
//           {new URL(normalizedUrl).hostname}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default LinkPreview;
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { IonImg } from "@ionic/react";

import Enviroment from "../core/Enviroment";
import Context from "../context";
import SpotifyEmbed from "./SpotifyEmbed";

export default function LinkPreview({ url }) {
  const { isPhone } = useContext(Context);

  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  const normalizeUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const normalizedUrl = normalizeUrl(url);

  const isSpotify = normalizedUrl.includes("open.spotify.com");
  const isYouTube =
    normalizedUrl.includes("youtube.com") ||
    normalizedUrl.includes("youtu.be");

  useEffect(() => {
    if (!normalizedUrl) return;

    setLoading(true);

    if (isSpotify) {
      setPreviewData({ type: "spotify" });
      setLoading(false);
      return;
    }

    if (isYouTube) {
      setPreviewData({ type: "youtube" });
      setLoading(false);
      return;
    }

    fetchPreview(normalizedUrl);
  }, [normalizedUrl]);

  const fetchPreview = async (url) => {
    try {
      const res = await axios.get(
        `${Enviroment.proxyUrl}/preview?url=${encodeURIComponent(url)}`,
        { timeout: 5000 }
      );

      setPreviewData({
        title: res.data?.title || url,
        description: res.data?.description || "",
        image: res.data?.image || null,
      });
    } catch (err) {
      console.error(err);

      // ✅ strong fallback
      setPreviewData({
        title: url,
        description: "Tap to open link",
        image: `https://www.google.com/s2/favicons?domain=${url}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    window.open(normalizedUrl, "_blank");
  };

  // ===== SPECIAL =====
  if (previewData?.type === "spotify") {
    return <SpotifyEmbed url={normalizedUrl} />;
  }

  if (previewData?.type === "youtube") {
    const id =
      normalizedUrl.split("v=")[1]?.split("&")[0] ||
      normalizedUrl.split("youtu.be/")[1];

    return (
      <img
        src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
        className="rounded-xl w-full"
        onClick={handleClick}
      />
    );
  }

  // ===== LOADING =====
  if (loading) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded-xl" />;
  }

  if (!previewData) return null;

  let hostname = "";
  try {
    hostname = new URL(normalizedUrl).hostname;
  } catch {
    hostname = normalizedUrl;
  }

  return (
    <div
      onClick={handleClick}
      className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden cursor-pointer active:scale-[0.98]"
    >
      {previewData.image && (
        <IonImg
          src={previewData.image}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-3">
        <h4 className="text-sm font-semibold text-black line-clamp-2">
          {previewData.title}
        </h4>

        {!isPhone && previewData.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {previewData.description}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-1 truncate">
          {hostname}
        </p>
      </div>
    </div>
  );
}