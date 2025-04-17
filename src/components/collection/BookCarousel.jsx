import { useLocation } from "react-router-dom"




export default function BookCarousel({images=[]}){
    let location = useLocation()

    let isAbout = location.pathname=="/"
    if(images.length>0){
        return(
            // <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
         <div className="carousel md:carousel-center rounded-box "> 
        {images.map(imgSrc=>{
            return(  <div className="carousel-item  max-w-100% md:max-w-[100%]  w-full">
            <img
              src={imgSrc}
              className=" max-h-[15.5em] sm:max-h-[24em] md:max-h-[33em] "
        />
          </div>)})}
      </div>)
    }


    return(<div className="carousel rounded-box w-64">
  <div className="carousel-item w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
      className="w-full"
      alt="Tailwind CSS Carousel component" />
  </div>
  <div className="carousel-item w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
      className="w-full"
      alt="Tailwind CSS Carousel component" />
  </div>
  <div className="carousel-item w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
      className="w-full"
      alt="Tailwind CSS Carousel component" />
  </div>
  <div className="carousel-item w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
      className="w-full"
      alt="Tailwind CSS Carousel component" />
  </div>
  <div className="carousel-item w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
      className="w-full"
      alt="Tailwind CSS Carousel component" />
  </div>
  <div className="carousel-item w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
      className="w-full"
    />
  </div>
  <div className="carousel-item w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
      className="w-full"
      />
  </div>
</div>)
}