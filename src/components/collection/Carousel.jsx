import { useContext, useEffect, useRef } from "react";
import "../../Dashboard.css";
import PageDataElement from "../page/PageDataElement";
import { sendGAEvent } from "../../core/ga4";
import Context from "../../context";
import React from "react";
import { register } from "swiper/element/bundle";

register();

export default function Carousel({ book, isGrid }) {
  const { isPhone, isHorizPhone } = useContext(Context);
  const swiperElRef = useRef(null);

  useEffect(() => {
    const swiperEl = swiperElRef.current;
    if (!swiperEl) return;

    const onProgress = (e) => {
      const [swiper, progress] = e.detail;
      // console.log("progress", progress);
    };

    swiperEl.addEventListener("swiperprogress", onProgress);

    return () => {
      swiperEl.removeEventListener("swiperprogress", onProgress);
    };
  }, []);

  const description = (story) => {
    if (!story.description) return null;

    return (
      <div className="md:pt-4 p-1">
        {story.needsFeedback ? (
          <label className="text-emerald-800">Feedback Request:</label>
        ) : null}

        <h6
          className={`overflow-hidden ${
            isGrid
              ? isPhone
                ? "max-h-20 m-1 p-1 w-grid-mobile-content text-white"
                : isHorizPhone
                ? "w-page-mobile-content text-white"
                : "w-page-content text-emerald-700 text-white"
              : isHorizPhone
              ? "text-emerald-800"
              : ""
          }`}
        >
          {story.description}
        </h6>
      </div>
    );
  };
  if(!book || book &&(!book.storyIdList ||book.storyIdList.length==0)){
    return
  }
  return (
    <swiper-container
      ref={swiperElRef}
      slides-per-view="1"
      pagination="true"
      // navigation="true"
      style={{ width: "100vw",maxWidth:"50em" }}
    >
      {book.storyIdList?.map((stc) => {
        if (!stc?.story) return null;

        return (
          <swiper-slide className="w-[100%]  sm:max-h-[40em]" key={stc.id}>
            <div
              onTouchStartCapture={() => {
                sendGAEvent(
                  "Opened Page from Book",
                  `Saw ${JSON.stringify({
                    id: stc.story.id,
                    title: stc.story.title,
                  })} in book ${JSON.stringify({
                    id: book.id,
                    title: book.title,
                  })}`,
                  "",
                  0,
                  false
                );
              }}
              className="flex-col flex "
              id={stc.id}
            >
              <h5 className="min-h-10 pt-3 max-w-[15em] px-4 text-emerald-800 top-0 no-underline text-ellipsis whitespace-nowrap overflow-hidden text-left">
                {stc.story.title}
              </h5>

              {!isPhone && description(stc.story)}

             
                <PageDataElement isGrid={isGrid} page={stc.story} />
        
            </div>
          </swiper-slide>
        );
      })}
    </swiper-container>
  );
}

