import isValidUrl from "../../core/isValidUrl";
import Paths from "../../core/paths";
import Enviroment from "../../core/Enviroment";
import { sendGAEvent } from "../../core/ga4";
import { useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import shortName from "../../core/shortName";

/*
 * ProfileCircle
 *
 * The avatar is metadata, not a hero element.
 *
 * HARD SIZE CONTRACT
 * ------------------
 * small  = 24px
 * medium = 32px
 * large  = 48px
 *
 * These sizes intentionally do NOT grow at larger breakpoints.
 * Desktop should not make a person's avatar visually dominant.
 */
const SIZES = {
  small: {
    width: 24,
    height: 24,
    text: "text-xs",
    gap: "gap-1.5",
  },

  medium: {
    width: 32,
    height: 32,
    text: "text-sm",
    gap: "gap-2",
  },

  large: {
    width: 48,
    height: 48,
    text: "text-sm",
    gap: "gap-2.5",
  },
};

function ProfileCircle({
  profile,
  className = "",
  fontSize = "",
  includeUsername = true,
  isGrid = false,
  size = "small",
}) {
  const router = useIonRouter();

  const sizeConfig = SIZES[size] || SIZES.small;

  const [pictureUrl, setPictureUrl] = useState(
    Enviroment.blankProfile
  );

  /*
   * Resolve profile image.
   */
  useEffect(() => {
    if (!profile?.profilePic) {
      setPictureUrl(Enviroment.blankProfile);
      return;
    }

    if (isValidUrl(profile.profilePic)) {
      setPictureUrl(profile.profilePic);
      return;
    }

    setPictureUrl(
      Enviroment.imageProxy(profile.profilePic)
    );
  }, [profile?.profilePic]);

  /*
   * Navigate to profile.
   */
  const handleNavigate = () => {
    if (!profile?.id) return;

    sendGAEvent(
      "Navigate",
      `Navigate to profile:${{
        id: profile.id,
        username: profile.username,
      }}`,
      profile.username,
      0,
      false
    );

    router.push(
      Paths.profile.createRoute(profile.id)
    );
  };

  /*
   * HARD DIMENSIONS
   *
   * Inline dimensions intentionally used here.
   *
   * This prevents global CSS, parent styles, image rules,
   * or responsive utilities from accidentally turning the
   * avatar into a large image.
   */
  const avatarStyle = {
    width: `${sizeConfig.width}px`,
    height: `${sizeConfig.height}px`,
    minWidth: `${sizeConfig.width}px`,
    minHeight: `${sizeConfig.height}px`,
    maxWidth: `${sizeConfig.width}px`,
    maxHeight: `${sizeConfig.height}px`,
  };

  /*
   * -------------------------------------------------------------------------
   * NO PROFILE
   * -------------------------------------------------------------------------
   */
  if (!profile) {
    return (
      <span
        className={[
          "inline-flex shrink-0 items-center",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        <span
          style={avatarStyle}
          className={[
            "block shrink-0 overflow-hidden rounded-full",
            "bg-base-soft/30",
            "ring-1 ring-border-soft",
          ].join(" ")}
        />
      </span>
    );
  }

  const username = profile.username || "Writer";

  const accessibleLabel = `View ${username}'s profile`;

  /*
   * -------------------------------------------------------------------------
   * PROFILE
   * -------------------------------------------------------------------------
   */
  return (
    <span
      className={[
        "inline-flex min-w-0 max-w-full shrink-0 items-center",
        sizeConfig.gap,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ----------------------------------------------------------------- */}
      {/* AVATAR                                                            */}
      {/* ----------------------------------------------------------------- */}

      <button
        type="button"
        onClick={handleNavigate}
        disabled={!profile.id}
        aria-label={accessibleLabel}
        style={avatarStyle}
        className={[
          "relative",
          "m-0",
          "block",
          "shrink-0",
          "overflow-hidden",
          "rounded-full",
          "border-0",
          "p-0",

          "bg-base-soft",

          /*
           * Keep the avatar visually quiet.
           */
          "ring-1 ring-border-soft",

          /*
           * Accessible keyboard focus.
           */
          "focus:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-border-focus",
          "focus-visible:ring-offset-1",

          /*
           * Very restrained interaction.
           */
          "hover:ring-2",
          "hover:ring-base-soft/50",

          "motion-reduce:transition-none",
          "disabled:cursor-default",
        ].join(" ")}
      >
        <img
          src={pictureUrl}
          alt=""
          aria-hidden="true"
          width={sizeConfig.width}
          height={sizeConfig.height}
          className="absolute inset-0 m-0 block h-full w-full max-h-full max-w-full object-cover"
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          onError={() => {
            setPictureUrl(Enviroment.blankProfile);
          }}
        />
      </button>

      {/* ----------------------------------------------------------------- */}
      {/* USERNAME                                                          */}
      {/* ----------------------------------------------------------------- */}

      {includeUsername && (
        <button
          type="button"
          onClick={handleNavigate}
          disabled={!profile.id}
          aria-label={accessibleLabel}
          className={[
            "min-w-0 max-w-full",
            "truncate",
            "bg-transparent",
            "p-0",
            "text-left",

            "text-text-primary",

            fontSize || sizeConfig.text,

            "hover:text-text-brand",

            "focus:outline-none",
            "focus-visible:underline",
            "focus-visible:underline-offset-2",

            "disabled:cursor-default",

            "motion-reduce:transition-none",
          ].join(" ")}
        >
          {shortName(username, 20)}
        </button>
      )}
    </span>
  );
}

export default ProfileCircle;