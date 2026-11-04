
import { useEffect, useState } from "react";
import fetchCity from "../../core/fetchCity";
import Paths from "../../core/paths";

import Pill from "../Pill";
import styles from "../../styles/style";
import SectionHeader from "../pieces/SectionHeader";

// ── About Panel ──────────────────────────────────────

const locationCache = new Map();

const AboutPanel = ({ profile, router }) => {
  const [locationName, setLocationName] = useState(
    "Location not specified"
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!profile) {
      setLocationName("Location not specified");
      setIsLoadingLocation(false);
      return undefined;
    }

    const location = profile.location;

    if (!location) {
      setLocationName("Location not specified");
      setIsLoadingLocation(false);
      return undefined;
    }

    if (location.city) {
      setLocationName(location.city);
      setIsLoadingLocation(false);
      return undefined;
    }

    const cacheKey = JSON.stringify(location);

    if (locationCache.has(cacheKey)) {
      setLocationName(locationCache.get(cacheKey));
      setIsLoadingLocation(false);
      return undefined;
    }

    const fetchLocation = async () => {
      try {
        setIsLoadingLocation(true);

        const address = await fetchCity(location);
        const resolvedName = address || "Unknown location";

        locationCache.set(cacheKey, resolvedName);

        if (!cancelled) {
          setLocationName(resolvedName);
        }
      } catch (err) {
        if (!cancelled) {
          setLocationName("Unknown location");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingLocation(false);
        }
      }
    };

    fetchLocation();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  if (!profile) return null;

  const hashtags = Array.isArray(profile.hashtags)
    ? profile.hashtags
    : Array.isArray(profile.tags)
      ? profile.tags
      : [];

  return (
    <div className={styles.profile.mine.about.content}>
  
        <SectionHeader title="Bio" />

        {(profile.bio || profile.selfStatement) && (
          <p className={styles.profile.mine.about.bio}>
            {profile.bio ?? profile.selfStatement}
          </p>
        )}
     
      <div>
        <SectionHeader title="Location" />

        {isLoadingLocation ? (
          <div
            aria-label="Loading location"
            role="status"
            className={styles.profile.mine.about.locationLoading}
          />
        ) : (
          <p className={styles.profile.mine.about.location}>
            {locationName}
          </p>
        )}
      </div>


      {hashtags.length > 0 && (
        <div>
          <p className={styles.profile.mine.about.interestsLabel}>
            Interests
          </p>

          <ul
            aria-label="Profile interests"
            className={styles.profile.mine.about.pillList}
          >
            {hashtags.slice(0, 5).map((tag, index) => {
              const isString = typeof tag === "string";
              const tagId = isString ? null : tag?.id;
              const tagName = isString
                ? tag
                : tag?.name ?? tag?.tag;

              if (!tagName) {
                return null;
              }

              return (
                <li key={tagId ?? `${tagName}-${index}`}>
                  <Pill
                    onClick={
                      tagId
                        ? () =>
                            router.push(
                              Paths.hashtag.createRoute(tagId)
                            )
                        : undefined
                    }
                    label={`#${tagName}`}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AboutPanel;