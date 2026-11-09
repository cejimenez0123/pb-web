
import { useState } from "react";
import styles from "../../styles/style";
import StoryCard from "./StoryCard";
import SectionHeader from "../pieces/SectionHeader";

export default function WriteLanding({
  stories = [],
  loading = false,
  search = "",
  onSearch,
  onBegin,
  onSelectStory,
    onFileSelected,
  onGoogleFilePicked,
}) {


  return (
    <div className="">
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
        <div
          type="button"
          onClick={onBegin}
           
          className={`
            mt-10
          
         
            px-7
            py-4
         ${styles.button.primary}
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
          `}
        >
          Begin something new
        </div>
{/* <ImportWorkSection
  onFileSelected={onFileSelected}
  onGoogleFilePicked={onGoogleFilePicked}
/> */}
        {/* Existing work */}
        <section className="mt-28 sm:mt-32">

          {/* Section heading */}
          <div className="flex flex-col gap-7 border-b border-soft/15 pb-7">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
               
                <SectionHeader eyebrow={"Your work"}
                title={"Pick up where you left off"}/>
              </div>

              {/* View toggle */}
           
         </div>

            {/* Search */}
            {/* <div className="relative w-[100%] max-w-2xl"> */}
          
<div>
             <label className="w-full sm:max-w-[18rem]">
          <span className="sr-only">
            Search
          </span>
              
                <input
                  id="story-search"
                  type="search"
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search your writing..."
                  className={styles.profile.mine.search+" "}
          
                />

              
                </label>
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
              className={" w-[100%] mt-8 flex flex-col gap-4"
          
              }
            >
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  view={""}
                  // view={view}
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
  </div>
  );
}







