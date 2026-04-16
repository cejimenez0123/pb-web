
import { useEffect, useRef } from "react";
import "../../Dashboard.css";
import PageDataElement from "../page/PageDataElement";
import { register } from "swiper/element/bundle";

register();

export default function Carousel({ book }) {
  const swiperElRef = useRef(null);

  useEffect(() => {
    const swiperEl = swiperElRef.current;
    if (!swiperEl) return;

    // Set Swiper props directly
    Object.assign(swiperEl, {
      slidesPerView: 1.05,      // peek next slide
      spaceBetween: 10,
      centeredSlides: false,
      resistanceRatio: 0.85,
      speed: 280,
      pagination: {
        clickable: true,
        dynamicBullets: true,
      },
      touchStartPreventDefault: false, // important for iOS + Ionic
      simulateTouch: true,             // ensure swipe works on touch devices
    });

    // ✅ auto-initialize after assigning props
    swiperEl.initialize?.();
  }, []);

  if (!book?.storyIdList?.length) return null;

  return (
    <div className="w-full overflow-hidden">
      <swiper-container ref={swiperElRef} className="w-full">
        {book.storyIdList.map((stc) => {
          if (!stc?.story) return null;

          return (
            <swiper-slide key={stc.id} className="!w-auto rounded-xl overflow-hidden">
              <div className="w-full  rounded-xl overflow-hidden bg-base-bg border border-[#bae6fe]/40 shadow-sm">
              {/* <div className="w-full h-full rounded-xl overflow-hidden bg-base-bg border border-[#bae6fe]/40 shadow-sm"> */}
                <div className="flex flex-col h-full">
                  {/* Title */}
                  <h5 className="px-3 pt-2 text-sm font-semibold text-[#003b44] truncate">
                    {stc.story.title || "Untitled"}
                  </h5>

                  {/* Purpose */}
            

                  {/* Media */}
                <div className="flex-1 rounded-xl min-h-0 overflow-hidden">
  <PageDataElement page={stc.story} compact={true} />
</div>
                </div>
              </div>
            </swiper-slide>
          );
        })}
      </swiper-container>

      <style>
        {`
          swiper-container::part(pagination) {
            bottom: 6px;
          }

          swiper-container::part(bullet) {
            background: #0097b2;
            opacity: 0.3;
          }

          swiper-container::part(bullet-active) {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
}