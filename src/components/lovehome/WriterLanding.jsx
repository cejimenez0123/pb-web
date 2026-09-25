
import React, { useState } from "react";

export default function WriteLanding({
  stories = [],
  loading = false,
  search = "",
  onSearch,
  onBegin,
  onSelectStory,
}) {
  const [view, setView] = useState("grid");

  return (
    <main className="min-h-[100dvh] bg-cream text-soft dark:bg-base-bgDark dark:text-cream">
      <div className="mx-auto w-[100%] max-w-5xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">

        {/* Header */}
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.12em] text-soft/75 dark:text-cream/65">
            Write
          </p>

          <h1 className="mt-5 max-w-2xl font-serif text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-[4rem] lg:text-[4.5rem]">
            What are you working on?
          </h1>

          <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-soft/65 dark:text-cream/65 sm:text-xl">
            Start something new, or return to something already taking shape.
          </p>
        </header>

        {/* Begin */}
        <button
          type="button"
          onClick={onBegin}
          className="
            mt-10
            rounded-full
            bg-soft
            px-7
            py-4
            text-base
            font-medium
            text-cream
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-emerald-900
            focus:outline-none
            focus:ring-2
            focus:ring-soft
            focus:ring-offset-2
            focus:ring-offset-cream
            dark:focus:ring-offset-base-bgDark
          "
        >
          Begin something new
        </button>

        {/* Existing work */}
        <section className="mt-28 sm:mt-32">

          {/* Section heading */}
          <div className="flex flex-col gap-7 border-b border-soft/15 pb-7">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-soft/55">
                  Your work
                </p>

                <h2 className="mt-2 font-serif text-[1.9rem] font-bold leading-tight sm:text-[2.25rem]">
                  Pick up where you left off
                </h2>
              </div>

              {/* View toggle */}
              {stories.length > 0 && (
                <div
                  className="
                    flex
                    w-fit
                    items-center
                    rounded-full
                    border
                    border-soft/15
                    bg-cream/70
                    p-1
                    dark:bg-base-bgDark/60
                  "
                >
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                    className={`
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      uppercase
                      tracking-[0.08em]
                      transition-colors
                      ${
                        view === "grid"
                          ? "bg-soft text-cream"
                          : "text-soft/55 hover:text-soft dark:text-cream/55 dark:hover:text-cream"
                      }
                    `}
                  >
                    Grid
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    aria-pressed={view === "list"}
                    className={`
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      uppercase
                      tracking-[0.08em]
                      transition-colors
                      ${
                        view === "list"
                          ? "bg-soft text-cream"
                          : "text-soft/55 hover:text-soft dark:text-cream/55 dark:hover:text-cream"
                      }
                    `}
                  >
                    List
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative w-[100%] max-w-2xl">
              <label
                htmlFor="story-search"
                className="sr-only"
              >
                Search your writing
              </label>

              <div
                className="
                  flex
                  w-[100%]
                  items-center
                  rounded-full
                  border
                  border-soft/15
                  bg-cream/50
                  transition-colors
                  focus-within:border-soft/40
                  focus-within:bg-cream
                  dark:bg-base-bgDark/40
                  dark:focus-within:bg-base-bgDark/70
                "
              >
                <span
                  aria-hidden="true"
                  className="pl-5 text-soft/45 dark:text-cream/40"
                >
                  ⌕
                </span>

                <input
                  id="story-search"
                  type="search"
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search your writing..."
                  className="
                    w-[100%]
                    bg-transparent
                    px-3
                    py-3.5
                    text-sm
                    text-soft
                    placeholder:text-soft/40
                    focus:outline-none
                    dark:text-cream
                    dark:placeholder:text-cream/35
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => onSearch("")}
                    aria-label="Clear search"
                    className="
                      mr-2
                      shrink-0
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      text-soft/50
                      transition-colors
                      hover:bg-soft/10
                      hover:text-soft
                      dark:text-cream/45
                      dark:hover:text-cream
                    "
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="mt-10 grid w-[100%] grid-cols-1 gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="
                    h-52
                    w-[100%]
                    animate-pulse
                    rounded-2xl
                    border
                    border-soft/10
                    bg-soft/5
                  "
                />
              ))}
            </div>
          ) : stories.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "mt-10 grid w-[100%] grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-7"
                  : "mt-10 flex w-[100%] flex-col gap-4"
              }
            >
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  view={view}
                  onSelect={onSelectStory}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 max-w-xl py-8">
              {search ? (
                <>
                  <p className="font-serif text-xl leading-relaxed text-soft/65 dark:text-cream/65">
                    Nothing found for “{search}”.
                  </p>

                  <button
                    type="button"
                    onClick={() => onSearch("")}
                    className="
                      mt-6
                      text-sm
                      text-soft
                      underline
                      underline-offset-4
                      decoration-soft/30
                      transition-colors
                      hover:decoration-soft
                    "
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="font-serif text-xl leading-relaxed text-soft/65 dark:text-cream/65">
                    Nothing yet. Begin anywhere.
                  </p>

                  <button
                    type="button"
                    onClick={onBegin}
                    className="
                      mt-6
                      text-sm
                      text-soft
                      underline
                      underline-offset-4
                      decoration-soft/30
                      transition-colors
                      hover:decoration-soft
                    "
                  >
                    Start a new piece
                  </button>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StoryCard({
  story,
  view,
  onSelect,
}) {
  const isGrid = view === "grid";

  return (
    <button
      type="button"
      onClick={() => onSelect(story)}
      className={`
        group
        w-[100%]
        text-left
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-soft/40
        focus:ring-offset-2
        focus:ring-offset-cream
        dark:focus:ring-offset-base-bgDark

        ${
          isGrid
            ? `
              min-h-[210px]
              rounded-2xl
              border
              border-soft/15
              bg-cream/45
              p-6
              sm:p-7
              hover:-translate-y-1
              hover:border-soft/30
              hover:bg-cream
            `
            : `
              rounded-2xl
              border
              border-soft/15
              bg-cream/45
              px-6
              py-5
              sm:px-7
              hover:border-soft/30
              hover:bg-cream
            `
        }

        dark:bg-base-bgDark/40
        dark:hover:bg-base-bgDark/70
      `}
    >
      <div
        className={
          isGrid
            ? "flex h-[100%] flex-col justify-between gap-10"
            : "flex w-[100%] items-center justify-between gap-6"
        }
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {story.status && (
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-soft/55 dark:text-cream/50">
                {formatStatus(story.status)}
              </span>
            )}

            {story.isPrivate && (
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-soft/40 dark:text-cream/40">
                Private
              </span>
            )}
          </div>

          <h3
            className={`
              mt-3
              truncate
              font-serif
              font-bold
              leading-tight
              text-soft
              dark:text-cream
              ${
                isGrid
                  ? "text-[1.45rem] sm:text-[1.6rem]"
                  : "text-lg sm:text-xl"
              }
            `}
          >
            {story.title || "Untitled"}
          </h3>

          {story.description && (
            <p
              className={`
                mt-2
                font-serif
                leading-relaxed
                text-soft/55
                dark:text-cream/55
                ${
                  isGrid
                    ? "line-clamp-2 text-sm"
                    : "hidden max-w-xl text-sm sm:block"
                }
              `}
            >
              {story.description}
            </p>
          )}
        </div>

        <div
          className={
            isGrid
              ? "flex items-end justify-between"
              : "flex shrink-0 items-center gap-5"
          }
        >
          <span className="text-xs text-soft/45 dark:text-cream/40">
            {formatDate(story.updated || story.created)}
          </span>

          <span
            aria-hidden="true"
            className="
              text-xl
              text-soft/45
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:text-soft
              dark:text-cream/40
              dark:group-hover:text-cream
            "
          >
            →
          </span>
        </div>
      </div>
    </button>
  );
}

function formatStatus(status) {
  const labels = {
    draft: "Draft",
    fragment: "Fragment",
    workshop: "Workshop",
    finished: "Published",
  };

  return labels[status] || status;
}

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

