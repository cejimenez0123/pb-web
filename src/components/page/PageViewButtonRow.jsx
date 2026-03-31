
import { IonImg, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import bookmarkfill from "../../images/bookmarkfill.svg"
import bookmarkoutline from "../../images/bookmarkadd.svg"
import Paths from "../../core/paths";
export default function PageViewButtonRow({ page, profile, setCommenting }) {
  const [likeFound, setLikeFound] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const router = useIonRouter();
  const handleApprovalClick = () => setLikeFound(!likeFound);
  const handleClickComment = () => setCommenting(true);
  const onClickShare = () => alert("Shared!");
  const handleBookmark = () => setBookmarked(!bookmarked);
  const [canUserEdit, setCanUserEdit] = useState(false);

  useEffect(()=>{

      const roles = ["editor"];
      console.log("Checking edit permissions for profile:", profile, "on page:", page);
      if (profile && page) {
        if (profile.id === page.authorId) {
          setCanUserEdit(true);
          return;
        }
        if (page?.betaReaders) {
          let found = page?.betaReaders?.find((rTc) => rTc.profileId === profile.id && roles.includes(rTc.role));
          setCanUserEdit(!!found);
        }
      }
    
  },[page,profile])
if(!page || !profile) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex gap-4">
        <button
          onClick={handleApprovalClick}
          className={`rounded-full px-4 py-2 transition active:scale-95 ${
            likeFound ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          Yea
        </button>
        <button
          onClick={handleClickComment}
          className="rounded-full px-3 py-2 bg-sky-50 text-sky-700 transition active:scale-95"
        >
          💬
        </button>
        <button
          onClick={onClickShare}
          className="rounded-full px-3 py-2 bg-sky-50 text-sky-700 transition active:scale-95"
        >
          ⤴
        </button>
      </div>
      {page.author.id === profile?.id  && (
  <button
    onClick={() => router.push(Paths.editPage.createRoute(page.id), "forward")}
    className="rounded-full px-3 py-2 bg-emerald-200 text-emerald-800 hover:bg-emerald-300 transition"
  >
    ✏️ Edit
  </button>
)}
      <button
        onClick={handleBookmark}
        className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition"
      >
        <IonImg className="w-5 h-5" src={bookmarked ? bookmarkfill: bookmarkoutline} />
      </button>
    </div>
  );
}