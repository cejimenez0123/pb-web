import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { IonImg } from "@ionic/react";

import Enviroment from "../core/Enviroment";
import Context from "../context";
import SpotifyEmbed from "./SpotifyEmbed";
export default function LinkPreview({ url,compact }) {
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
    return <SpotifyEmbed url={normalizedUrl} compact={compact}/>;
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
      className="rounded-xl border border-gray-200 bg-base-bg shadow-sm overflow-hidden cursor-pointer active:scale-[0.98]"
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