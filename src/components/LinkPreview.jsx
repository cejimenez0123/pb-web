
import { useEffect, useState } from "react";
import axios from "axios";

import Enviroment from "../core/Enviroment";

function normalizeUrl(value) {
  if (!value || typeof value !== "string") return "";

  try {
    const input = value.trim();

    if (!input) return "";

    const withProtocol = /^https?:\/\//i.test(input)
      ? input
      : `https://${input}`;

    const parsed = new URL(withProtocol);

    if (
      !["http:", "https:"].includes(parsed.protocol) ||
      !parsed.hostname ||
      parsed.username ||
      parsed.password
    ) {
      return "";
    }

    return parsed.href;
  } catch {
    return "";
  }
}

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function resolveImageUrl(image, pageUrl) {
  if (!image || typeof image !== "string") return null;

  try {
    const resolved = new URL(image, pageUrl);

    if (!["http:", "https:"].includes(resolved.protocol)) {
      return null;
    }

    return resolved.href;
  } catch {
    return null;
  }
}

function getFallbackData(url) {
  const hostname = getHostname(url);

  return {
    url,
    title: hostname || "External website",
    description: "",
    image: null,
  };
}

export default function LinkPreview({ url, compact = false }) {
  const normalizedUrl = normalizeUrl(url);

  const hostname = normalizedUrl
    ? getHostname(normalizedUrl)
    : "";

  const proxyBase = String(
    Enviroment.proxyUrl || ""
  ).replace(/\/+$/, "");

  const [previewData, setPreviewData] = useState(null);
  const [loadingUrl, setLoadingUrl] = useState(null);
  const [failedImageUrl, setFailedImageUrl] = useState(null);

  useEffect(() => {
    if (!normalizedUrl) {
      setPreviewData(null);
      setLoadingUrl(null);
      return undefined;
    }

    const controller = new AbortController();
    let active = true;

    // Always establish a usable fallback first.
    setPreviewData(getFallbackData(normalizedUrl));
    setFailedImageUrl(null);

    const fetchPreview = async () => {
      if (!proxyBase) return;

      setLoadingUrl(normalizedUrl);

      try {
        const response = await axios.get(
          `${proxyBase}/preview`,
          {
            params: { url: normalizedUrl },
            timeout: 8000,
            signal: controller.signal,
          }
        );

        if (!active) return;

        const metadata = response.data || {};
        const fallback = getFallbackData(normalizedUrl);

        setPreviewData({
          url: normalizedUrl,
          title:
            typeof metadata.title === "string" &&
            metadata.title.trim()
              ? metadata.title.trim()
              : fallback.title,

          description:
            typeof metadata.description === "string"
              ? metadata.description.trim()
              : "",

          image: resolveImageUrl(
            metadata.image,
            normalizedUrl
          ),
        });
      } catch (error) {
        if (
          !active ||
          controller.signal.aborted ||
          axios.isCancel(error)
        ) {
          return;
        }

        // Keep the hostname fallback.
        console.warn(
          "Unable to retrieve link metadata:",
          error?.message
        );

        setPreviewData(getFallbackData(normalizedUrl));
      } finally {
        if (active) {
          setLoadingUrl(null);
        }
      }
    };

    fetchPreview();

    return () => {
      active = false;
      controller.abort();
    };
  }, [normalizedUrl, proxyBase]);

  if (!normalizedUrl) return null;

  // Never display metadata belonging to a previous URL.
  const currentData =
    previewData?.url === normalizedUrl
      ? previewData
      : getFallbackData(normalizedUrl);

  const showImage = Boolean(
    currentData.image &&
    failedImageUrl !== normalizedUrl
  );

  const isLoading = loadingUrl === normalizedUrl;

  return (
    <a
      href={normalizedUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${hostname} in a new tab`}
      className={[
        "group block w-full overflow-hidden",
        "rounded-2xl border border-plumb-border",
        "bg-plumb-surface shadow-sm",
        "transition duration-200",
        "hover:border-plumb-mint/50 hover:shadow-md",
        "active:scale-[0.99]",
        "dark:border-plumb-dark-border",
        "dark:bg-plumb-dark-surface",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-plumb-mint",
        "focus-visible:ring-offset-2",
      ].join(" ")}
    >
      {/* Optional thumbnail */}
      {showImage && (
        <div
          className={[
            "relative w-full overflow-hidden",
            "bg-plumb-paper dark:bg-plumb-dark-canvas",
            compact ? "aspect-[16/5]" : "aspect-[16/9]",
          ].join(" ")}
        >
          <img
            src={currentData.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => {
              setFailedImageUrl(normalizedUrl);
            }}
          />
        </div>
      )}

      {/* Link information */}
      <div
        className={[
          "flex items-start gap-3",
          compact ? "p-3" : "p-4",
        ].join(" ")}
      >
        {/* Website identity */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-plumb-border bg-plumb-paper text-plumb-mint dark:border-plumb-dark-border dark:bg-plumb-dark-canvas">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3a15 15 0 0 1 0 18" />
            <path d="M12 3a15 15 0 0 0 0 18" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium tracking-wide text-plumb-muted dark:text-plumb-darkMuted">
            {hostname}
          </p>

          <h4
            className={[
              "mt-1 font-semibold leading-snug",
              "text-plumb-ink dark:text-plumb-darkText",
              compact ? "text-sm" : "text-base",
              "line-clamp-2",
            ].join(" ")}
          >
            {currentData.title}
          </h4>

          {!compact && currentData.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted">
              {currentData.description}
            </p>
          )}

          <p className="mt-2 truncate text-xs text-plumb-subtle dark:text-plumb-darkSubtle">
            {normalizedUrl}
          </p>
        </div>

        {/* External link indicator */}
        <div className="shrink-0 pt-1 text-plumb-muted transition group-hover:text-plumb-mint dark:text-plumb-darkMuted">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M14 4h6v6" />
            <path d="M20 4 10 14" />
            <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
          </svg>
        </div>
      </div>

      {/* Quiet metadata loading indicator */}
      {isLoading && (
        <div className="h-0.5 w-full overflow-hidden bg-plumb-paper dark:bg-plumb-dark-canvas">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-plumb-mint" />
        </div>
      )}
    </a>
  );
}
