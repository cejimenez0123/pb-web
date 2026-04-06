import Paths from "../core/paths";
import { clearPagesInView } from "../actions/PageActions.jsx";
import { setCollectionInView, setCollections } from "../actions/CollectionActions";
import { useDispatch } from "react-redux";
import { useLayoutEffect } from "react";
import { initGA, sendGAEvent } from "../core/ga4.js";
import { useIonRouter } from "@ionic/react";
import { IonSkeletonText } from "@ionic/react";

function BookListItem({ book }) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  useLayoutEffect(() => {
    initGA();
  }, []);

  const navigateToBook = async () => {
    if (!book) return;
    await dispatch(clearPagesInView());
    await dispatch(setCollections({ collections: [] }));
    await dispatch(setCollectionInView({ collection: book }));
    router.push(Paths.collection.createRoute(book.id), "forward", "replace");
    sendGAEvent(
      "Navigate",
      `Navigate to Collection ${JSON.stringify({ id: book.id, title: book?.title })}`
    );
  };

  if (!book) return <BookListItemShadow />;

  return (
    <div
      onClick={navigateToBook}
      className="min-h-[10rem] min-w-[16rem] mx-4 flex flex-col justify-between rounded-xl bg-emerald-50 text-emerald-900 cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 p-4 space-y-3"
    >
      {/* Title */}
      <h3 className="font-bold text-lg truncate">
        {book?.title?.slice(0, 30) || "Untitled"}
        {book?.title?.length > 30 && "..."}
      </h3>

      {/* Description */}
      <p className="text-sm text-emerald-800 line-clamp-3">
        {book?.purpose?.length <= 65
          ? book.purpose
          : book.purpose.slice(0, 65) + "..."}
      </p>
    </div>
  );
}

function BookListItemShadow() {
  return (
    <div className="min-h-[10rem] w-[16rem] flex flex-col justify-between rounded-xl bg-emerald-50 text-emerald-900 animate-pulse shadow-sm p-4 space-y-3">
      <div className="h-6 w-3/4 bg-emerald-200 rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-emerald-100 rounded" />
        <div className="h-3 w-5/6 bg-emerald-100 rounded" />
      </div>
    </div>
  );
}

export { BookListItem, BookListItemShadow };
