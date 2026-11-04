
import { useContext, useLayoutEffect, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createHashtagCollection, createHashtagPage,
  deleteHashtagCollection, deleteHashtagStory,
  fetchCollectionHashtags, fetchStoryHashtags,
  searchHashtags, // <-- new action (see note below)
} from "../../actions/HashtagActions";
import checkResult from "../../core/checkResult";
const clear =(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#FFFFFF"><path d="M8.4,17L7,15.6L10.6,12L7,8.42l1.4-1.4l3.6,3.6l3.58-3.6l1.4,1.4L13.38,12l3.6,3.6L15.58,17L12,13.4L8.4,17Z"/></svg>)
import Context from "../../context";
import { IonImg, IonLabel } from "@ionic/react";
import ErrorBoundary from "../../ErrorBoundary";

export function HashtagForm({ item,effectiveId, type = "story" }) {
  const { setError } = useContext(Context);
  const isStory = type === "story";
  const dispatch = useDispatch();
  const currentProfile = useSelector(state => state.users.currentProfile);

  const [inputValue, setInputValue] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const fetchHashtags = (item) => {
    const action = isStory
      ? fetchStoryHashtags({ profile: currentProfile, storyId: effectiveId })
      : fetchCollectionHashtags({ profile: currentProfile, colId: effectiveId });
    dispatch(action).then(res =>
      checkResult(res, payload => setHashtags(payload.hashtags), () => {})
    );
  };

  // Single path used by both Enter and suggestion clicks
  const addHashtag = (name) => {
    const clean = (name || "").trim().toLowerCase();
    if (!clean) return;
    // already on this item? just clear and bail
    if (hashtags.some(h => h.hashtag?.name === clean)) {
      setInputValue("");
      setSuggestions([]);
      return;
    }

    if (!isStory) {
      dispatch(createHashtagCollection({ name: clean, colId:effectiveId, profile: currentProfile }))
        .then(res => {
          if (res && res.payload) {
            setHashtags(prev => [...prev, res.payload.hashtag]);
            setInputValue("");
            setSuggestions([]);
          } else {
            setError("Reached the max on hashtags");
          }
        });
    } else {
      dispatch(createHashtagPage({ name: clean, storyId: effectiveId, profile: currentProfile }))
        .then(res => checkResult(res, payload => {
          if (payload) setHashtags(prev => [...prev, payload.hashtag]);
          setInputValue("");
          setSuggestions([]);
        }));
    }
  };

  const deleteHashtag = (hash) => {
    const action = isStory
      ? deleteHashtagStory({ hashtagStoryId: hash.id })
      : deleteHashtagCollection({ colId: effectiveId, hashId: hash.id });
    dispatch(action).then(res =>
      checkResult(res, () => fetchHashtags(item), () => {})
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addHashtag(inputValue);
    }
  };

  // Debounced suggestion lookup against existing platform tags
  useEffect(() => {
    const q = inputValue.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      dispatch(searchHashtags({ query: q, profile: currentProfile })).then(res =>
        checkResult(res, payload => setSuggestions(payload.hashtags || []), () => setSuggestions([]))
      );
    }, 250);
    return () => clearTimeout(t);
  }, [inputValue, currentProfile, dispatch]);

  useLayoutEffect(() => {
    fetchHashtags(item);
  }, []);

  // hide ones already added, cap at 3
  const visibleSuggestions = suggestions
    .filter(s => !hashtags.some(h => h.hashtag?.name === s.name))
    .slice(0, 3);

  return (
    <ErrorBoundary>
      <form className="w-full flex flex-col dark:bg-transparent ">
        {visibleSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mx-auto w-[90%] md:w-[48em]">
            {visibleSuggestions.map((s) => (
              <button
                type="button"
                key={effectiveId ?? s.name}
                onClick={() => addHashtag(s.name)}
                className="px-2 py-1 text-sm rounded-lg border border-soft text-soft hover:bg-button-secondary-bg hover:text-white transition-colors"
              >
                #{s.name}
              </button>
            ))}
          </div>
        )}

        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a hashtag and press Enter"
          rows={4}
          cols={12}
          className="my-1 p-8 mx-4 rounded-xl w-[100%]  mx-auto border border-plumb-mintLight/50   placeholder:text-soft/50 focus:outline-none focus:ring-2 focus:ring-button-secondary-bg"
        />
        <button type="submit" className="hidden">Submit</button>

        <div className="text-left my-1">
          <IonLabel className="text-soft text-sm">Hashtags:</IonLabel>
          <ul className="flex flex-wrap p-4">
            {hashtags.map((hash, index) => (
              <li
              onClick={() => deleteHashtag(hash)}
              className="p-1 flex flex-row m-1 text-sm border-plumb-blueSea/50 border border-1 rounded-full  bg-button-secondary-bg text-white" key={index}>
                <h6 className="my-auto mx-2">#{hash.hashtag.name}</h6>
                {clear}
                {/* <IonImg className="my-auto" onClick={() => deleteHashtag(hash)} src={clear} /> */}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </ErrorBoundary>
  );
}

export default HashtagForm;

