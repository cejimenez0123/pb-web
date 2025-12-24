


import { AnimatePresence, motion } from "framer-motion";
export default function StoryCollectionTabs({ tab, setTab, storyList, colList }) {
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 20 : -20, // smaller distance for tighter slide
      opacity: 0,
      position: "absolute",
      width: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%",
    },
    exit: (direction) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
      position: "absolute",
      width: "100%",
    }),
  };

  const handleSwipe = (event, info) => {
    const swipe = info.offset.x;
    if (swipe < -50 && tab === "page") setTab("collection");
    if (swipe > 50 && tab === "collection") setTab("page");
  };

  return (
    <div className="flex h-full flex-col  sm:w-full">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="flex rounded-full border border-emerald-600 w-[90vw] sm:w-[40rem] justify-center overflow-hidden">
          <button
            className={`px-4 py-2 w-[45vw] sm:w-[20rem]  transition-colors ${
              tab === "page"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("page")}
          >
            Stories 
          </button>
          <button
            className={`px-4 py-2 w-[45vw]  sm:w-[20rem]  transition-colors ${
              tab === "collection"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("collection")}
          >
            Collections
          </button>
        </div>
      </div>

      {/* Animated, Swipeable Content */}
      <div className="relative overflow-hidden w-full">
        <AnimatePresence custom={tab === "collection" ? 1 : -1} mode="wait">
          <motion.div
            key={tab}
            custom={tab === "collection" ? 1 : -1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.26, // faster
              ease: "easeOut", // more responsive
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleSwipe}
            className="w-full"
          >
            {tab === "page" ? storyList() : colList()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

