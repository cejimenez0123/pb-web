

import Paths from "../../core/paths";
import { clearPagesInView } from "../../actions/PageActions.jsx";
import { setCollectionInView, setCollections } from "../../actions/CollectionActions";
import { useDispatch } from "react-redux";
import { useLayoutEffect } from "react";
import { initGA, sendGAEvent } from "../../core/ga4.js";
import { useIonRouter } from "@ionic/react";
import shortName from "../../core/shortName.jsx";

function BookListItem({ book }) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  useLayoutEffect(() => {
    initGA();
  }, []);
console.log("BOOK ITEM", book)
  const navigateToBook = async () => {
    if (!book) return;
    await dispatch(clearPagesInView());
    await dispatch(setCollections({ collections: [] }));
    await dispatch(setCollectionInView({ collection: book }));
    router.push(Paths.collection.createRoute(book.id), "forward");
    sendGAEvent(
      "Navigate",
      `Navigate to Collection ${JSON.stringify({ id: book.id, title: book?.title })}`
    );
  };

  if (!book) return <BookListItemShadow />;

  return (
    <div
      onClick={navigateToBook}
 className={[
        // Fixed golden ratio dimensions — 16rem wide, 10rem tall (1:1.618)
        "w-[16rem] h-[10rem]",
        "flex-shrink-0",          // prevents squishing in horizontal scroll
        "flex flex-col justify-between",
        "rounded-xl border border-purple dark:border-purple",
        "bg-base-bg dark:bg-base-bgDark",
        "shadow-md mx-2 p-4",
        "cursor-pointer transition-all duration-200",
        "active:scale-[0.98] hover:shadow-lg",
      ].join(" ")}  style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <h3 className="font-bold text-soft dark:text-cream text-lg truncate">
        {shortName(book.title, 30)}
      </h3>
      <p className="text-sm text-soft dark:text-cream opacity-80 line-clamp-3">
        {book?.purpose?.length <= 65
          ? book.purpose
          : book.purpose.slice(0, 65) + "..."}
      </p>
    </div>
  );
}

function BookListItemShadow() {
  return (
    <div  className={[
        // Fixed golden ratio dimensions — 16rem wide, 10rem tall (1:1.618)
        "w-[16rem] h-[10rem]",
        "flex-shrink-0",          // prevents squishing in horizontal scroll
        "flex flex-col justify-between",
        "rounded-xl border border-purple dark:border-purple",
        "bg-base-bg dark:bg-base-bgDark",
        "shadow-md mx-2 p-4",
        "cursor-pointer transition-all duration-200",
        "active:scale-[0.98] hover:shadow-lg",
      ].join(" ")}> <div className="h-6 w-3/4 bg-base-bg rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-base-bg rounded" />
        <div className="h-3 w-5/6 bg-base-bg rounded" />
      </div>
    </div>
  );
}

export { BookListItem, BookListItemShadow };