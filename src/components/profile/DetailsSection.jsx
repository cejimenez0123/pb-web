
import styles from "../../styles/style";
import Paths from "../../core/paths";
import Pill from "../Pill";
import AboutPanel from "./AboutPanel";

export default function DetailsSection({
  profile,
  router,
  communities,
}) {
  const hashtags = Array.isArray(profile?.hashtag)
    ? profile.hashtag.slice(0, 10)
    : [];

  const profileCommunities = Array.isArray(communities)
    ? communities.slice(0, 10)
    : [];

  return (
    <section aria-labelledby="details-heading">
      {/* <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="details-heading"
            className={styles.profile.mine.sectionTitle}
          >
            Details
          </h2>

          <p className={styles.profile.mine.sectionDescription}>
            A little more about me.
          </p>
        </div>
      </div> */}
    <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="archive-heading"
            className={styles.profile.mine.sectionTitle}
          >
           Details
          </h2>

          <p className={styles.profile.mine.sectionDescription}>
           A little more about me.
          </p>
        </div>

          {/* <input
            id="portfolio-search"
            type="search"
            value={searchInput ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              setSearch(value);
            }}
            placeholder="Search portfolio"
            className={styles.profile.portfolio.searchInput}
          /> */}
        </div>
      <div className={styles.profile.mine.details.content}>
        <AboutPanel
          router={router}
          profile={profile}
        />

        {hashtags.length > 0 && (
          <div className={styles.profile.mine.details.group}>
            <p className={styles.profile.mine.details.groupLabel}>
              Hashtags
            </p>

            <ul
              aria-label="Profile hashtags"
              className={styles.profile.mine.details.pillList}
            >
              {hashtags.map((tag, index) => {
                const hashtag = tag?.hashtag;
                const hashtagId = hashtag?.id;
                const hashtagName = hashtag?.name ?? tag?.tag;

                if (!hashtagName) {
                  return null;
                }

                return (
                  <li key={hashtagId ?? `${hashtagName}-${index}`}>
                    <Pill
                      onClick={
                        hashtagId
                          ? () =>
                              router.push(
                                Paths.hashtag.createRoute(
                                  hashtagId
                                )
                              )
                          : undefined
                      }
                      label={`#${hashtagName}`}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {profileCommunities.length > 0 && (
          <div className={styles.profile.mine.details.group}>
            <p className={styles.profile.mine.details.groupLabel}>
              Communities
            </p>

            <ul
              aria-label="Profile communities"
              className={styles.profile.mine.details.pillList}
            >
              {profileCommunities.map((community) => {
                if (!community?.id || !community?.title) {
                  return null;
                }

                return (
                  <li key={community.id}>
                    <Pill
                      baseClass={
                        styles.profile.mine.details.communityPill
                      }
                      onClick={() =>
                        router.push(
                          Paths.collection.createRoute(
                            community.id
                          )
                        )
                      }
                      label={community.title}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}