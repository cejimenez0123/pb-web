import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { IonImg } from '@ionic/react';
import { useMediaQuery } from 'react-responsive';

export default function BookCarousel({ images = [] }) {
  const isPhone = useMediaQuery({ query: '(max-width: 750px)' });

  const defaultImages = [
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
      spaceBetween={4}
      slidesPerView={isPhone?1:2}
      centeredSlides
      navigation
      loop={true}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      className="w-[88vw] mx-auto sm:w-[90em] max-w-[1400px] "
    >
      {imagesToUse.map((imgSrc, idx) => (
        <SwiperSlide key={idx}>
         
            <IonImg
              src={imgSrc}
              style={{height:"30em"}}
              alt={`Book Carousel item ${idx + 1}`}
              className="w-full   mx-auto  object-fit object-[30%_10%] rounded-2xl"
            />
     
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { IonImg } from '@ionic/react';
// import { useContext } from 'react';
// import { Context } from 'react-responsive';
// import { useMediaQuery } from 'react-responsive';

// export default function BookCarousel({ images = [] }) {
//  const isPhone = useMediaQuery({ query: '(max-width: 750px)' });
//   let defaultImages = [
//     "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
//     "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
//     "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
//     "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
//     "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp",
//     "https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp",
//     "https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
//   ];

//   const imagesToUse = images.length > 0 ? images : defaultImages;
// return<Swiper
//   modules={[Navigation, Pagination, Autoplay]}
//   spaceBetween={16}
//   slidesPerView={1}
//   centeredSlides
//   navigation
//   pagination={{ clickable: true }}
//   autoplay={{ delay: 3500, disableOnInteraction: false }}
//   className={`${isPhone ? "h-[14rem]" : "h-[45rem]"} w-full`}
// >
//   {imagesToUse.map((imgSrc, idx) => (
//     <SwiperSlide key={idx}>
//       <div
//         className={`mx-auto overflow-hidden rounded-2xl ${
//           isPhone ? "h-[12rem] w-[98vw]" : "h-[98rem] w-[70vw]"
//         }`}
//       >
//         <IonImg
//   src={imgSrc}
//   alt={`Book Carousel item ${idx + 1}`}
//   className="w-full h-full object-cover rounded-lg object-[50%_35%]"
// />
//         {/* <IonImg
//           src={imgSrc}
//           alt={`Book Carousel item ${idx + 1}`}
//           className="w-full h-full object-cover"
//         /> */}
//       </div>
//     </SwiperSlide>
//   ))}
// </Swiper>

  // return (
  //   <Swiper
  //     modules={[Navigation, Pagination, Autoplay]}
  //     spaceBetween={16}
  //     slidesPerView={1}
  //     centeredSlides
  //     navigation
  //     pagination={{ clickable: true }}
  //     autoplay={{ delay: 3500, disableOnInteraction: false }}
  //     style={{ width: '100%' }}
  //   >
  //     {imagesToUse.map((imgSrc, idx) => (
  //       <SwiperSlide key={idx}>
  //         <IonImg
  //           src={imgSrc}
  //           alt={`Book Carousel item ${idx + 1}`}
  //           style={{
  //             maxHeight: isPhone?"10em":"50em", 
  //             width: isPhone?"96vw":"90em",
  //             objectFit: "cover",
  //             borderRadius: "1em",
  //           }}
  //         />
  //       </SwiperSlide>
  //     ))}
  //   </Swiper>
  // );
// }

