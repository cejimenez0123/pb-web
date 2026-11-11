import Paths from "../../core/paths";
import styles from "../../styles/style";
import EmptyState from "../general/EmptyState";
import PaginatedList from "../page/PaginatedList";

export default function CollectionsSection({
  profile,
  router,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  resource,
}) {
 



  return (
    
    <section aria-labelledby="collections-heading">
      <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="collections-heading"
            className={styles.profile.mine.sectionTitle}
          >
          Rooms
          </h2>

          <p className={styles.profile.mine.sectionDescription}>
            Places and groups of work I'm part of.
          </p>
        </div>

        <label className="w-full sm:max-w-[18rem]">
          <span className="sr-only">
            Search collections
          </span>

          <input
            type="search"
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              setSearch(value);
            }}
            placeholder="Search"
            aria-label="Search collections"
            className={styles.profile.mine.search}
          />
        </label>
      </div>

      <div className="mt-6">
        <PaginatedList
        items={resource?.items}
  resource={resource}
   emptyState={ <EmptyState
              text={
                search
                  ? "No matching room."
                  : "No rooms yet."
              }
            />}
//   emptyState={<EmptyState title={"No Rooms"} description={"Join or create rooms"}/>}
  renderItem={(item) => (
    <CollectionRoomCard
      item={item}
      profile={profile}
      onClick={() =>
        router.push(
          Paths.collection.createRoute(item.id)
        )
      }
    />
  )}
/>

      </div>
    </section>
  );
}

function CollectionRoomCard({
  item,
  profile,
  onClick,
}) {
  const title =
    item?.title?.trim() || "Untitled";

  const purpose =
    item?.purpose?.trim() || "";

  const isWorkshop =
    item?.isWorkshop === true ||
    item?.type === "feedback";

  const role = getCollectionRole({
    item,
    profile,
  });

  const stories = Array.isArray(item?.storyIdList)
    ? item.storyIdList
    : [];

  const roles = Array.isArray(item?.roles)
    ? item.roles
    : [];

  const writerCount = roles.filter(
    (membership) =>
      membership?.role === "writer"
  ).length;

  const memberCount = roles.filter(
    (membership) =>
      membership?.role !== "owner"
  ).length;

  const visibleStories = stories
    .filter((storyLink) => storyLink?.story)
    .slice(0, 2);

  const hasMoreStories =
    stories.length > visibleStories.length;

  const contentCount = stories.length;

  const isOwner = role === "owner";

  const isNew =
    item?.updated &&
    profile?.lastNotified &&
    new Date(item.updated).getTime() >
      new Date(profile.lastNotified).getTime();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${title}${
        isWorkshop ? " workshop" : " collection"
      }`}
      className={styles.profile.mine.collectionItem}
    >
      <div className="flex w-[100%] items-start gap-4">
        {/* Updated indicator */}
        <div
          className="w-2 shrink-0 pt-2.5"
          aria-hidden={!isNew}
        >
          {isNew && (
            <span
              aria-label="Updated since your last visit"
              className={styles.profile.mine.updated}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Type + role */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={styles.profile.mine.type}>
              {isWorkshop
                ? "Workshop"
                : "Collection"}
            </span>

            {role && (
              <>
                <span
                  aria-hidden="true"
                  className="text-plumb-border dark:text-plumb-darkBorder"
                >
                  ·
                </span>

                <span className={styles.profile.mine.role}>
                  {formatCollectionRole(role)}
                </span>
              </>
            )}
          </div>

          <h3 className={styles.profile.mine.title}>
            {title}
          </h3>

          {purpose && (
            <p className={styles.profile.mine.purpose}>
              {purpose}
            </p>
          )}

          {isWorkshop ? (
            <WorkshopMeta
              role={role}
              writerCount={writerCount}
              memberCount={memberCount}
              contentCount={contentCount}
              isOwner={isOwner}
            />
          ) : (
            <CollectionMeta
              role={role}
              contentCount={contentCount}
              childCollectionCount={
                Array.isArray(item?.childCollections)
                  ? item.childCollections.length
                  : 0
              }
              updated={item?.updated}
            />
          )}

          {/* Content preview */}
          {visibleStories.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {visibleStories.map(
                  (storyLink, index) => {
                    const story = storyLink?.story;

                    const storyTitle =
                      story?.title?.trim() ||
                      "Untitled";

                    return (
                      <span
                        key={
                          storyLink?.id ||
                          story?.id ||
                          index
                        }
                        className={styles.profile.mine.storyTag}
                        title={storyTitle}
                      >
                        {storyTitle}
                      </span>
                    );
                  }
                )}

                {hasMoreStories && (
                  <span
                    className={
                      styles.profile.mine.metaSecondary
                    }
                  >
                    +{contentCount -
                      visibleStories.length}{" "}
                    more
                  </span>
                )}
              </div>
            </div>
          )}

          {contentCount === 0 && (
            <p className={styles.profile.mine.activity}>
              {isWorkshop
                ? role === "writer"
                  ? "Your piece will appear here."
                  : "No pieces in this room yet."
                : "No pieces in this collection yet."}
            </p>
          )}

          {item?.updated && (
            <p className={styles.profile.mine.activity}>
              {isWorkshop
                ? `Active ${formatRelativeDate(
                    item.updated
                  )}`
                : `Updated ${formatDate(
                    item.updated
                  )}`}
            </p>
          )}
        </div>

        <span
          aria-hidden="true"
          className={styles.profile.mine.arrow}
        >
          →
        </span>
      </div>
    </button>
  );
}

function getCollectionRole({
  item,
  profile,
}) {
  if (!item || !profile?.id) {
    return null;
  }

  if (
    item.profileId &&
    item.profileId === profile.id
  ) {
    return "owner";
  }

  const membership =
    Array.isArray(item.roles)
      ? item.roles.find(
          (role) =>
            role?.profileId === profile.id
        )
      : null;

  return membership?.role || null;
}

function formatCollectionRole(role) {
  const labels = {
    owner: "Owner",
    writer: "Writer",
    commenter: "Commenter",
    editor: "Editor",
    reader: "Reader",
  };

  return labels[role] || role;
}
function CollectionMeta({
  role,
  contentCount,
  childCollectionCount,
  updated,
}) {
  const parts = [];

  parts.push(
    `${contentCount} ${
      contentCount === 1
        ? "piece"
        : "pieces"
    }`
  );

  if (childCollectionCount > 0) {
    parts.push(
      `${childCollectionCount} ${
        childCollectionCount === 1
          ? "collection"
          : "collections"
      }`
    );
  }

  return (
    <div className={styles.profile.mine.meta}>
      <span className={styles.profile.mine.metaText}>
        {parts.join(" · ")}
      </span>

      {role && (
        <>
          <span
            aria-hidden="true"
            className="text-plumb-border dark:text-plumb-darkBorder"
          >
            ·
          </span>

          <span
            className={
              styles.profile.mine.metaSecondary
            }
          >
            {getCollectionRoleDescription(role)}
          </span>
        </>
      )}

      {updated && (
        <span
          className={
            styles.profile.mine.metaSecondary
          }
        >
          · Updated {formatDate(updated)}
        </span>
      )}
    </div>
  );
}

function formatRelativeDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const diff =
    Date.now() - parsed.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(
      diff / minute
    );

    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (diff < day) {
    const hours = Math.floor(
      diff / hour
    );

    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  if (diff < 7 * day) {
    const days = Math.floor(
      diff / day
    );

    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } ago`;
  }

  return formatDate(date);
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(parsed);
}

function getCollectionRoleDescription(role) {
  const descriptions = {
    owner: "You created this",
    writer: "You contribute work",
    commenter: "You give feedback",
    editor: "You help shape this",
    reader: "You can read this",
  };

  return descriptions[role] || "";
}

function WorkshopMeta({
  role,
  writerCount,
  memberCount,
  contentCount,
  isOwner,
}) {
  const parts = [];

  if (contentCount > 0) {
    parts.push(
      `${contentCount} ${
        contentCount === 1
          ? "piece"
          : "pieces"
      }`
    );
  } else {
    parts.push("No pieces");
  }

  if (writerCount > 0) {
    parts.push(
      `${writerCount} ${
        writerCount === 1
          ? "writer"
          : "writers"
      }`
    );
  }

  return (
    <div className={styles.profile.mine.meta}>
      <span className={styles.profile.mine.metaText}>
        {parts.join(" · ")}
      </span>

      {role === "commenter" && (
        <>
          <span
            aria-hidden="true"
            className="text-plumb-border dark:text-plumb-darkBorder"
          >
            ·
          </span>

          <span
            className={
              styles.profile.mine.metaSecondary
            }
          >
            You’re here to read and respond
          </span>
        </>
      )}

      {role === "writer" && (
        <>
          <span
            aria-hidden="true"
            className="text-plumb-border dark:text-plumb-darkBorder"
          >
            ·
          </span>

          <span
            className={
              styles.profile.mine.metaSecondary
            }
          >
            You’re writing here
          </span>
        </>
      )}

      {isOwner && (
        <>
          <span
            aria-hidden="true"
            className="text-plumb-border dark:text-plumb-darkBorder"
          >
            ·
          </span>

          <span
            className={
              styles.profile.mine.metaSecondary
            }
          >
            You created this room
          </span>
        </>
      )}
    </div>
  );
}
