import styles from "../../styles/style";
import Pill from "../Pill";
import AboutPanel from "./AboutPanel";

export default function DetailsSection({
  profile,
  router,
  communities,
}) {

  return (
    <section aria-labelledby="details-heading">
      <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="details-heading"
            className={styles.profile.mine.sectionTitle}
          >
            Details
          </h2>

          <p
            className={
              styles.profile.mine.sectionDescription
            }
          >
            A little more about me.
          </p>
        </div>
      </div>

      <div className="mt-6 max-w-[48rem]">
        <AboutPanel
          router={router}
          profile={profile}
        />

        {profile?.hashtag?.length > 0 && (
          <div className="mt-10">
            <p
              className={
                styles.profile.mine.hashtagLabel
              }
            >
              Hashtags
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {[...profile.hashtag]
                .slice(0, 10)
                .map((tag, index) => (
                  <Pill
                    key={index}
                    onClick={() =>
                      router.push(
                        Paths.hashtag.createRoute(
                          tag.hashtag.id
                        )
                      )
                    }
                    label={`#${
                      tag.hashtag.name ?? tag.tag
                    }`}
                  />
                ))}
            </div>
          </div>
        )}

        {communities?.length > 0 && (
          <div className="mt-10">
            <p
              className={
                styles.profile.mine.hashtagLabel
              }
            >
              Communities
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {communities
                .slice(0, 10)
                .map((community) => (
                  <Pill
                    key={community.id}
                    baseClass="
                      border-plumb-blueSea
                      bg-transparent
                      dark:border-plumb-softBlue/60
                    "
                    onClick={() =>
                      router.push(
                        Paths.collection.createRoute(
                          community.id
                        ),
                        "forward"
                      )
                    }
                    label={community.title}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}