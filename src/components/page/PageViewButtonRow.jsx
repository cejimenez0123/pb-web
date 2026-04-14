
import { IonImg, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import bookmarkfill from "../../images/bookmarkfill.svg"
import bookmarkoutline from "../../images/bookmarkadd.svg"
import Paths from "../../core/paths";
import { useDialog } from "../../domain/usecases/useDialog";
import ShareList from "./ShareList";
export default function PageViewButtonRow({ page, profile, setCommenting }) {
  const [likeFound, setLikeFound] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const router = useIonRouter();
  const handleApprovalClick = () => setLikeFound(!likeFound);
  const handleClickComment = () => setCommenting(true);
  const {openDialog,dialog,resetDialog}=useDialog()
  const handleBookmark = () => setBookmarked(!bookmarked);
  
  const [archiveCol,setArchiveCol]=useState(null)
  useEffect(()=>{
    if(profile?.profileToCollections){
      let ptc =profile?.profileToCollections.find(ptc => ptc.type === "archive");
      ptc && ptc.collection && setArchiveCol(ptc.collection)
    }
  },[profile])
  const onClickShare = () => {
  openDialog({
      isOpen: true,
      title: null,
      height:50,
      scrollY:false,
      text: (
        <ShareList
          page={page}
          profile={profile}
          archive={archiveCol}
          bookmark={bookmarked}
          setArchive={setArchiveCol}
          setBookmarked={setBookmarked}
        />
      ),
      agree: null,
      agreeText: null,
     
      breakpoint: .95
    })
  };

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

      <button
        onClick={handleBookmark}
        className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition"
      >
        <IonImg className="w-5 h-5" src={bookmarked ? bookmarkfill: bookmarkoutline} />
      </button>
    </div>
  );
}