import { useMemo } from "react";
import { useSelector } from "react-redux";
import Paths from "../../core/paths";
import styles from "../../styles/style";
import SectionHeader from "../pieces/SectionHeader";
import RoomPreview from "../room/RoomPreview";
const PENCIL=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="18px" width="18px" fill="currentColor"><path d="M5,19H6.43L16.2,9.23L14.78,7.8L5,17.58V19ZM3,21V16.75L16.2,3.57q0.3-0.28 0.66-0.43T17.63,3q0.4,0 0.78,0.15T19.05,3.6L20.43,5q0.3,0.27 0.44,0.65T21,6.4q0,0.4-0.14,0.76T20.43,7.82L7.25,21H3ZM19,6.4L17.6,5L19,6.4ZM15.48,8.52L14.78,7.8L16.2,9.23l-0.72-0.7Z"/></svg>)

const PRIMARY_BUTTON = [styles.button.base,styles.button.primary].join(" ")
function InsideRoom({

  router,
  
  collection,

       canAdd,
             canEdit
}) {
  const currentProfileId = useSelector(
    (state) => state.users.currentProfile?.id
  );
  
const rooms = collection.childCollections.map(c=>c.childCollection)
const works =  collection.storyIdList.map(c=>c.story)
  const orderedContent = useMemo(() => {
    const pages = (
      collection?.storyIdList ?? []
    )
      .filter((item) => item?.story)
      .map((item, index) => ({
        kind: "page",
        content: item.story,
        index: item.index ?? index,
      }));

    const rooms = (
      collection?.childCollections ?? []
    )
      .filter((item) => item?.childCollection)
      .map((item, index) => ({
        kind: "room",
        content: item.childCollection,
        index: item.index ?? index,
      }));

    return [...pages, ...rooms].sort((a, b) => {
      const aIndex =
        a.index == null
          ? Number.POSITIVE_INFINITY
          : a.index;

      const bIndex =
        b.index == null
          ? Number.POSITIVE_INFINITY
          : b.index;

      return aIndex - bIndex;
    });
  }, [collection]);

  const isOwner =
    collection?.profileId === currentProfileId;

  const canModify =
    canEdit ||
    isOwner ||
    collection?.isOpenCollaboration;

  const hasContent = orderedContent.length > 0;

  return (
    <div className={"pt-8 " + styles.pageShell.body}>

      <RoomIntroduction collection={collection} />

      {hasContent ? (
        <>
          <SectionHeader
            eyebrow="Inside"
            title="What's here"
            description="Explore the writing and spaces collected in this room."
          />

          <div className="mt-8">
            <RoomContents
   
            collection={collection}
         
            
              orderedContent={orderedContent}
              router={router}
            />
          </div>
        </>
      ) : (
        <div className="
          rounded-2xl
          border
          border-dashed
          border-card-border
          p-8
          text-center
          dark:border-white/10
          sm:p-12
        ">
          <p className="font-serif text-2xl text-text-primary dark:text-cream">
            Nothing lives here yet.
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary dark:text-gray-300">
            A room can hold individual works,
            other rooms, or both. Start somewhere.
          </p>
        </div>
      )}

      {(canModify || canAdd) && (
        <RoomAddContent
          collection={collection}
          router={router}
        />
      )}

    </div>
  );
}
export default InsideRoom
function RoomIntroduction({ collection }) {
  const purpose = collection?.roomPurpose || "general";

  const statusLabels = {
    draft: "Draft",
    "in-progress": "In progress",
    completed: "Completed",
  };

  const purposeLabels = {
    feedback: "Feedback room",
    project: "Project",
    general: "Collection",
  };

  const orientation = collection?.orientation;

  const projectStatus = collection?.projectStatus;

  if (
    purpose === "general" &&
    !collection?.description
  ) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-7 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-gray-400">
            {purposeLabels[purpose] || "Collection"}
          </span>

          {purpose === "project" && projectStatus && (
            <span className="rounded-full bg-base-200 px-3 py-1 text-xs text-text-secondary dark:bg-white/10 dark:text-gray-300">
              {statusLabels[projectStatus] || projectStatus}
            </span>
          )}
        </div>

        {collection?.description && (
          <p className="mt-3 text-sm leading-relaxed text-text-primary dark:text-gray-200">
            {collection.description}
          </p>
        )}

        {purpose === "feedback" && orientation && (
          <div className="mt-6 border-t border-card-border pt-5 dark:border-white/10">
            <h3 className="font-serif text-lg text-text-primary dark:text-cream">
              Before you begin
            </h3>

            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary dark:text-gray-300">
              {orientation}
            </p>
          </div>
        )}

        {purpose === "project" && (
          <div className="mt-5 border-t border-card-border pt-4 dark:border-white/10">
            <p className="text-xs text-text-secondary dark:text-gray-400">
              Explore the rooms and writing that make up this project.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
function RoomContents({ collection, router }) {
  const rooms = (collection?.childCollections ?? [])
    .map((item) => item?.childCollection)
    .filter(Boolean);

  const works = (collection?.storyIdList ?? [])
    .map((item) => item?.story)
    .filter(Boolean);

  return (
    <div className="space-y-12">

      {/* Individual works */}
      {works.length > 0 && (
        <section>
          <SectionHeader
            eyebrow="Writing"
            title="Works"
            description="Individual pieces of writing collected here."
          />

          <div className="mt-6 grid grid-cols-1 gap-3">
            {works.map((work) => (
              <WorkPreview
                key={work.id}
                work={work}
                router={router}
              />
            ))}
          </div>
        </section>
      )}

      {/* Nested rooms */}
      {rooms.length > 0 && (
        <section>
          <SectionHeader
            eyebrow="Spaces"
            title="Rooms"
            description="Enter another room to explore what's inside."
          />

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {rooms.map((room) => (
              <RoomPreview
                key={room.id}
                room={room}
                router={router}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
function WorkPreview({ work, router }) {
  if (!work) return null;

  return (
    <article
    onClick={()=>router.push(Paths.page.createRoute(work.id))}
      className="
        rounded-xl
        border border-plumb-mint/70
        bg-card
        p-4 sm:p-5
        transition-colors
        hover:border-primary/40
        dark:border-white/10
        dark:hover:border-primary/50
      "
    >
      <div className="flex items-start gap-3">
        <div className="
       my-auto
        ">
        {PENCIL}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="
            font-serif text-lg
            text-text-primary
            dark:text-cream
            my-auto
          ">
            {work.title || "Untitled"}
          </h3>

          {work.description && (
            <p className="
              mt-1 line-clamp-2
              text-sm leading-relaxed
              text-text-secondary
              dark:text-gray-300
            ">
              {work.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function RoomAddContent({
  collection,
  router,
}) {
  if (!collection?.id) return null;

  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        onClick={() =>
          router.push(
            Paths.addToCollection.createRoute(
              collection.id
            )
          )
        }
        className={PRIMARY_BUTTON}
      >
        Add something
      </button>
    </div>
  );
}