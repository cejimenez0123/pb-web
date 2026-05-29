
import { useEffect, useRef } from "react";
import PageDataElement from "../page/PageDataElement";
import { register } from "swiper/element/bundle";
register();

const SLIDE_HEIGHT = "h-[200px]";

export default function Carousel({ book, compact }) {
  const swiperElRef = useRef(null);

  const validSlides = book?.storyIdList?.filter(
    stc => stc?.story && stc.story.data
  ) ?? [];

  useEffect(() => {
    const swiperEl = swiperElRef.current;
    if (!swiperEl || !validSlides.length) return;
    Object.assign(swiperEl, {
      slidesPerView: 1.08,
      spaceBetween: 10,
      centeredSlides: false,
      resistanceRatio: 0.85,
      speed: 300,
      pagination: { clickable: true, dynamicBullets: true },
      touchStartPreventDefault: false,
      simulateTouch: true,
    });
    swiperEl.initialize?.();
  }, [validSlides.length]);

  if (!validSlides.length) return null;

  return (
    <div
      className="w-full overflow-hidden"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <swiper-container ref={swiperElRef} className="w-full">
        {validSlides.map((stc) => (
          <swiper-slide
            key={stc.id}
            className="!w-auto rounded-xl overflow-hidden"
          >
            <div className="
              w-full rounded-xl overflow-hidden
              bg-base-bg dark:bg-base-bgDark
              border border-border-default dark:border-border-soft
              flex flex-col
            ">
              {/* Title row — fixed height */}
              <span className="
                flex-shrink-0
                px-3 pt-3 pb-1
                text-sm font-medium truncate
                text-text-primary dark:text-text-inverse
              ">
                {stc.story.title || "Untitled"}
              </span>

              {/* Content — fixed height, clipped */}
              <div className={`${SLIDE_HEIGHT} w-full overflow-hidden flex-shrink-0`}>
                <div className="w-full h-full overflow-hidden">
                  <PageDataElement page={stc.story} compact={true} truncateNumber={100} />
                </div>
              </div>
            </div>
          </swiper-slide>
        ))}
      </swiper-container>

      <style>{`
        swiper-container::part(pagination) { bottom: 6px; }
        swiper-container::part(bullet) { background: #0097b2; opacity: 0.3; }
        swiper-container::part(bullet-active) { opacity: 1; }
      `}</style>
    </div>
  );
}