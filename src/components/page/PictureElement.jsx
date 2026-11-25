
import { useEffect, useState } from "react";

import { useIonRouter } from "@ionic/react";

import { getPhoto } from "../../domain/usecases/useUploadPicture.jsx";
import Paths from "../../core/paths";
import { useDispatch } from "react-redux";

export default function PictureElement({
  page,
  fit = "fill",
}) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const [src, setSrc] = useState(null);
  const [imgError, setImgError] = useState(false);

  // page.data contains /api/photos/:id
  const photoId = page?.data?.match(/\/api\/photos\/([^/?#]+)/)?.[1];

  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;

    setSrc(null);
    setImgError(false);

    if (!photoId) {
      setImgError(true);
      return;
    }

    const loadPhoto = async () => {
      try {
        const result = await dispatch(
          getPhoto({ id: photoId })
        ).unwrap();

        // Supports either a direct Blob or a { blob } result.
        const blob = result?.blob ?? result;

        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setSrc(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch (error) {
        console.error("[PictureElement] Unable to load photo:", error);

        if (!cancelled) {
          setImgError(true);
        }
      }
    };

    loadPhoto();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [dispatch, photoId]);

  const openPicture = () => {
    const route = Paths.page.createRoute(page.id);

    if (router.routeInfo?.pathname !== route) {
      router.push(route);
    }
  };

  if (imgError) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center gap-2 text-plumb-muted dark:text-plumb-darkMuted">
        <svg
          className="h-10 w-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 15l5-5 4 4 3-3 4 4" />
          <circle cx="8.5" cy="8.5" r="1.5" />
        </svg>

        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  if (!src) {
    return <div className="h-48 w-full" />;
  }

  return (
    <img
      id="page-data-pic"
      src={src}
      alt={page?.title || "Story image"}
      onClick={openPicture}
      className={`block w-[100%] rounded-[10px] h-full object-${fit} transition active:scale-[0.98]`}
    //   className={`h-full w-full object-${fit} transition active:scale-[0.98]`}
      style={{ WebkitTapHighlightColor: "transparent" }}
      onError={() => setImgError(true)}
    />
  );
}
