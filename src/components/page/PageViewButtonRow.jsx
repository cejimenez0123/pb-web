import { useState, useLayoutEffect, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import bookmarkFill from "../../images/bookmark_fill_green.svg";
import bookmarkAdd from "../../images/bookmark_add.svg";
import { deletePageApproval } from "../../actions/PageActions.jsx";
import { addStoryListToCollection, deleteStoryFromCollection } from "../../actions/CollectionActions";
import { setEditingPage, setHtmlContent } from "../../actions/PageActions.jsx";
import Paths from "../../core/paths";
import checkResult from "../../core/checkResult";
import loadingGif from "../../images/loading.gif";
import Context from "../../context";
import { debounce } from "lodash";
import ShareList from "./ShareList.jsx";
import { RoleType } from "../../core/constants";
import Enviroment from "../../core/Enviroment.js";
import { initGA, sendGAEvent } from "../../core/ga4.js";
import ErrorBoundary from "../../ErrorBoundary.jsx";
import { createPageApproval } from "../../actions/PageActions";
import { Preferences } from "@capacitor/preferences";
import { IonImg,  IonList, IonItem, IonText } from "@ionic/react";
import { useSelector } from "react-redux";
import { setDialog } from "../../actions/UserActions.jsx";

export default function PageViewButtonRow({profile,archive, page, setCommenting }) {
  const { setSuccess, setError } = useContext(Context);
  const currentProfile = profile
//   const currentProfile = useSelector(state=>state.users.currentProfile)
  const dialog = useSelector(state=>state.users.dialog)
  const [likeFound, setLikeFound] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [canUserEdit, setCanUserEdit] = useState(false);
  const [canUserComment, setCanUserComment] = useState(false);
  const [archiveCol, setArchive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(null);
  const [comment, setComment] = useState(false);

  useLayoutEffect(() => {
    initGA();
  }, []);



  useEffect(() => {
    setCommenting(comment);
  }, [comment]);

  useEffect(() => {
checkLike(currentProfile)
  }, []);
  const checkLike=(profile)=>{
        if (profile && page && profile.likedStories) {
      let found = profile.likedStories.find((like) => like.storyId == page.id);
      if (profile.profileToCollections) {
        let marked = profile.profileToCollections.find((ptc) => ptc && ptc.type === "archive");
        setArchive(marked.collection);
      }
      setLikeFound(found);
      setLoading(false);
    } else {
      setLikeFound(null);
      setBookmarked(null);
      setLoading(false);
    }
  }
  const onClickShare=()=>{
    let dia = {...dialog}
    dia.text = <ShareList page={page} setArchive={setArchive}profile={currentProfile} archive={archiveCol}
      bookmark={bookmarked}
    setBookmarked={setBookmarked}/>
    dia.title="Share"
    dia.isOpen=true
    dia.onClose=()=>{
        dispatch(setDialog({...dialog,isOpen:false}))
    }
    dia.agreeText=null
    dia.agree=null
    dia.disagreeText="Close"
    dispatch(setDialog(dia))
  }


  const getArchive = () => {
    if (currentProfile && currentProfile.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      setArchive(ptc.collection);
    }
  };

  useEffect(() => {
    getArchive();
  }, []);

 



  const soCanUserComment = () => {
    const roles = [RoleType.commenter, RoleType.editor, RoleType.writer];
    if (currentProfile && page) {
      if (currentProfile.id === page.authorId) {
        setCanUserComment(true);
        return;
      }
      if (page.commentable) {
        setCanUserComment(true);
        return;
      }
      if (page.betaReaders) {
        const found = page.betaReaders.find((rTc) => rTc.profileId === currentProfile.id && roles.includes(rTc.role));
        setCanUserComment(found);
      }
    }
  };
  useLayoutEffect(() => {
    soCanUserComment();
    soCanUserEdit();
  }, [page, currentProfile]);
  function soCanUserEdit() {
    const roles = [RoleType.editor];
    if (currentProfile && page) {
      if (currentProfile.id === page.authorId) {
        setCanUserEdit(true);
        return;
      }
      if (page.betaReaders) {
        let found = page.betaReaders.find((rTc) => rTc.profileId === currentProfile.id && roles.includes(rTc.role));
        setCanUserEdit(found);
      }
    }
  }

  const handleApprovalClick = () => {
    if (currentProfile) {
      if (likeFound) {
        dispatch(deletePageApproval({ id: likeFound.id })).then((res) => {
          checkResult(
            res,
            ({profile}) => {
              checkLike(profile)
              setLoading(false);
              setLikeFound(null);
            },
            () => {
              setLoading(false);
            }
          );
        });
      } else if (page) {
        const params = { story: page, profile: currentProfile };
        dispatch(createPageApproval(params)).then((res) => {checkResult(res,({profile})=>{
          checkLike(profile)
        },err=>{

        })})}
    } else {
      setError("Please Sign Up");
    }
  };




  return (
    <ErrorBoundary>
      <div className="flex-row w-[95vw] rounded-b-lg overflow-clip sm:w-page mx-auto bg-emerald-200 flex text-white">
        {/* Approve / Yea */}
        <div
          onClick={handleApprovalClick}
          className={`${likeFound ? "bg-emerald-400" : "bg-emerald-200"} text-center grow flex-1/3`}
        >
          <div className="text-xl text-emerald-700 text-center mx-auto py-2 bg-transparent border-none">
            <h6 className="text-xl">Yea{likeFound ? "" : ""}</h6>
          </div>
        </div>

        {/* Discuss */}
        <div className="flex-1/3 grow bg-emerald-200 border-white border-l-2 border-r-2 text-center">
          <div
            className="text-emerald-700 py-2 border-none bg-transparent rounded-none"
            disabled={!canUserComment}
            onClick={() => {
              currentProfile ? setComment(!comment) : setError("Please Sign Up");
            }}
          >
            <h6 className="text-xl">Discuss</h6>
          </div>
        </div>

        {/* Share using Ionic Popover */}
        <div onClick={onClickShare} className="flex-1/3 grow bg-emerald-200 text-center flex justify-center items-center">
          {/* <IonButton  fill="clear" color="success"> */}
            <IonText className="text-xl text-emerald-700 m-0 p-0">Share</IonText>
          {/* </IonButton> */}

        
        </div>
      </div>
    </ErrorBoundary>
  );
}

