import React from "react";

export default function WriteLanding({
  stories = [],
  loading = false,
  onBegin,
  onSelectStory,
}) {
  return (
    <main className="min-h-[100dvh] bg-cream text-soft dark:bg-base-bgDark dark:text-cream">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <header>
          <p className="text-sm uppercase tracking-[0.12em] text-soft/80 dark:text-cream/70">
            Write
          </p>

          <h1 className="mt-4 max-w-2xl font-serif text-[2.75rem] font-bold leading-[1.05] tracking-tight sm:text-[4rem]">
            What are you working on?
          </h1>
        </header>

        <button
          type="button"
          onClick={onBegin}
          className="mt-10 rounded-full bg-soft px-7 py-4 text-base font-medium text-cream transition-colors hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-soft focus:ring-offset-2 focus:ring-offset-cream dark:focus:ring-offset-base-bgDark"
        >
          Begin something new
        </button>

        <section className="mt-20">
          <h2 className="font-serif text-[1.75rem] font-bold leading-tight sm:text-[2rem]">
            Pick up where you left off
          </h2>

          {loading ? (
            <p className="mt-5 font-serif text-muted-foreground">
              Loading...
            </p>
          ) : stories.length > 0 ? (
            <ul className="mt-6 border-t border-black/10 dark:border-white/10">
              {stories.map((story) => (
                <li
                  key={story.id}
                  className="border-b border-black/10 dark:border-white/10"
                >
                  <button
                    type="button"
                    onClick={() => onSelectStory(story)}
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left transition-opacity hover:opacity-70"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-lg">
                        {story.title || "Untitled"}
                      </span>

                      {story.status && (
                        <span className="mt-1 block text-xs uppercase tracking-[0.08em] text-muted-foreground">
                          {formatStatus(story.status)}
                        </span>
                      )}
                    </span>

                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl text-muted-foreground"
                    >
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 font-serif text-lg text-muted-foreground">
              Nothing yet. Begin anywhere.
            </p>
          )}
        </section>
      </div>
    </main>
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