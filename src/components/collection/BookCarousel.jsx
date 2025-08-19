// import { useLocation } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { IonImg } from '@ionic/react';

export default function BookCarousel({ images = [] }) {
  let defaultImages = [
    "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
    "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
    "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
    "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
    "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp",
    "https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp",
    "https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
  ];

  const imagesToUse = images.length > 0 ? images : defaultImages;

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={16}
      slidesPerView={1}
      centeredSlides
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      style={{ width: '100%' }}
    >
      {imagesToUse.map((imgSrc, idx) => (
        <SwiperSlide key={idx}>
          <IonImg
            src={imgSrc}
            alt={`Book Carousel item ${idx + 1}`}
            style={{
              maxHeight: "24em", // adjust as needed
              width: "100%",
              objectFit: "cover",
              borderRadius: "1em",
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

