import { useEffect, useRef, useState } from "react";
import Enviroment from "../../core/Enviroment";

const ORANGE = "#ff5500";

async function resolveUrl(url) {
  const res = await fetch(
    `${Enviroment.proxyUrl}/sc-resolve?url=${encodeURIComponent(url)}`
  );
  if (!res.ok) throw new Error("Could not resolve URL");
  const data = await res.json();
  const match = data.html?.match(/src="([^"]+)"/);
  if (!match) throw new Error("No embed src found");
  return decodeURIComponent(match[1].split("url=")[1].split("&")[0]);
}

function buildEmbedUrl(url) {
  const params = new URLSearchParams({
    url,
    color: "#ff5500",
    auto_play: "false",
    hide_related: "false",
    show_comments: "true",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "true",
    visual: "true",
  });
  return `https://w.soundcloud.com/player/?${params}`;
}

export default function SoundCloudEmbed({ url }) {
  const [src, setSrc] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url?.trim()) return;
    setError(null);
    setLoading(true);

    resolveUrl(url.trim())
      .then((resolved) => setSrc(buildEmbedUrl(resolved)))
      .catch(() => setError("Could not load track."))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) {
    return (
      <div className="w-full h-[300px] rounded-xl bg-base-bg dark:bg-base-bgDark border border-soft animate-pulse" />
    );
  }

  if (error) {
    return (
      <p className="text-[11px] text-red-400 px-3 py-2 border border-soft rounded-xl">
        {error}
      </p>
    );
  }

  if (!src) return null;

  return (
    <iframe
      src={src}
      width="100%"
      height="300"
      allow="autoplay"
      scrolling="no"
      frameBorder="no"
      title="SoundCloud"
      className="rounded-xl"
      style={{ display: "block" }}
    />
  );
}