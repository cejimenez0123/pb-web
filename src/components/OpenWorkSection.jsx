

import formatStatus from "../core/formatStatus";
import styles, { shared } from "../styles/style";
import FeaturedEventCard from "./events/FeaturedEventCard";

import EmptyState from "./general/EmptyState";
import SectionHeader from "./pieces/SectionHeader";

function OpenWorkSection({
  stories = [],
  hasRecentOpenStory,
  suggestedEvent,
  onWrite,
  onSelectStory,
  onSelectEvent,
}) {
  const hasStories = stories.length > 0;

  return (
    <section className={`mt-14 `}>
      <SectionHeader
        title="Open Work"
        eyebrow="Still open"
        description="Drafts and fragments you're still finding your way through."
        onAction={onWrite}
      />

      {hasRecentOpenStory ? (
        <WorkList
          stories={stories}
          onSelectStory={onSelectStory}
        />
      ) : suggestedEvent ? (
  <div className="mt-4">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-plumb-mintHover dark:text-plumb-mintLight">
      A little nudge
    </p>

    <p className="mb-4 text-sm leading-relaxed text-text-secondary">
      Take yourself somewhere! There's always something outhere, you don't need to wait for others.
    </p>

    <FeaturedEventCard
      event={suggestedEvent}
      onClick={() => onSelectEvent?.(suggestedEvent)}
    />
  </div>
) : hasStories ? (
        <WorkList
          stories={stories}
          onSelectStory={onSelectStory}
        />
      ) : (
        <EmptyState
          title="Nothing in progress just yet."
          description="Start with a line, a fragment, or whatever is on your mind."
          action="Start writing"
          onAction={onWrite}
        />
      )}
    </section>
  );
}
export default OpenWorkSection


function WorkList({ stories, onSelectStory }) {
  return (
    <div
      className={styles.pageShell.body+`
        mt-4 space-y-1
        border-y border-plumb-border
        dark:border-plumb-darkBorder
      `}
    >
      {stories.map((story) => (
        <WorkRow
          key={story.id}
          story={story}
          onClick={() => onSelectStory(story)}
        />
      ))}
    </div>
  );
}

function WorkRow({ story, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${story?.title || "untitled story"}`}
      className="
        group flex min-h-16 w-[100%] min-w-0
        items-center justify-between gap-5
        border-b border-plumb-border
        py-4 text-left transition-colors
        last:border-b-0
        hover:bg-plumb-surface/70
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-inset
        focus-visible:ring-plumb-focus
        dark:border-plumb-darkBorder
        dark:hover:bg-plumb-dark-surface
        motion-reduce:transition-none
      "
    >
      <div className="min-w-0">
        <h3
          className={`
            ${styles.text.subheading}
            truncate font-serif
          `}
        >
          {story?.title || "Untitled"}
        </h3>

        {story?.status && (
          <p
            className={`
              ${styles.text.metadata}
              mt-1 uppercase tracking-[0.08em]
            `}
          >
            {formatStatus(story.status)}
          </p>
        )}
      </div>

      <span
        aria-hidden="true"
        className="
          shrink-0 text-xl
          text-plumb-muted transition-transform
          group-hover:translate-x-1
          dark:text-plumb-darkMuted
          motion-reduce:transform-none
        "
      >
        →
      </span>
    </button>
  );
}