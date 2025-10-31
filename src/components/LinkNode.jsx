import { useState, useLayoutEffect,useContext } from 'react';
import Enviroment from '../core/Enviroment';
import "../App.css"
import ErrorBoundary from '../ErrorBoundary';
import { initGA,sendGAEvent } from '../core/ga4';
import SpotifyEmbed from './SpotifyEmbed';
import { IonImg } from '@ionic/react';
function LinkNode({ url,image,description,title,isGrid}) {

  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {

    if(!url.includes("plumbum")&&!url.includes('https://open.spotify.com/')){  
    fetchData(url).then(data=>{

    })
    return 
}else{
  setLoading(false);
}}, [url]);
useLayoutEffect(()=>{
  initGA()
},[])
const fetchData = async (url) => {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const response = await fetch(`${Enviroment.proxyUrl}${url}`, {
      headers: headers,

    }
    )
    ;
    
    const data = await response.text();
    
    const isYouTubeVideo = isYouTubeURL(url);
    if (isYouTubeVideo) {
      const videoId = extractYouTubeVideoId(url);
      const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      setPreviewData({
        videoId,
        videoThumbnail,
      });
      setLoading(false);
    } else {
      const parser = new DOMParser();
      
      const doc = parser.parseFromString(data, 'text/html');
      
      let title = doc.querySelector('title')?.textContent || '';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      let image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
     
      if (!image) {
        if(!image){
        const imgElement = doc.querySelector('img');

        if (imgElement) {
          image = imgElement.getAttribute('src') || '';
        }

      }
      }
    
      setPreviewData({
          title,
          description,
          image,
      });
 
    
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
  const handleClick = () => {
    sendGAEvent("Click",`Click Link ${title}`,title,0,true)
    window.open(url, '_blank');
  };
  const isYouTubeURL = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const extractYouTubeVideoId = (url) => {
    const videoIdRegex = /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : '';
  };

 
  if (loading) {
    return <div className='skeleton min-h-[8em] w-[96vw] md:min-w-[30em] md:w-[100%] my-8 bg-emerald-50 h-[10em] md:h-[10em] rounded-full'/>
  }

  if (!previewData&&!url.includes("plumbum")&&!url.lengths==0) {
    return <p>Failed to fetch link preview.</p>;
  }

 

  if (previewData && previewData.videoId) {
    return (
    
        <IonImg onClick={handleClick} style={{ cursor: 'pointer' }} className=" md:w-[20em]
       "src={previewData.videoThumbnail} alt="Video Thumbnail" />

    );
  }
const imageView = () => {
  const wrapperClass = "flex items-center bg-transparent justify-center sm:mx-4 w-[6em] h-[6em] rounded-full overflow-hidden bg-emerald-50";
  const imgClass = "object-cover min-h-[4em] min-w-[4em] w-full h-full";

  if (previewData && previewData.title === "Spotify") {
    return <SpotifyEmbed url={url} />;
  } else if (image) {
    return (
      <div className={wrapperClass}>
        <IonImg className={imgClass} src={image} />
      </div>
    );
  } else if (previewData && previewData.image) {
    return (
      <div className={wrapperClass}>
        <IonImg className={imgClass} src={previewData.image} alt="Link Preview" />
      </div>
    );
  } else {
    return null;
  }
};

//   const imageView = ()=>{
    
//     let imgClass = "object-fit  h-[5rem] w-[6rem] left-3 rounded-full overflow-hidden "
//     if(previewData && previewData.title=="Spotify"){

//       return (
//         <SpotifyEmbed url={url}/>
      
//       )}else if(image){
//         return(
//            <div className={`w-[5em] h-[5em] overflow-clip rounded-full`}>
//   <IonImg className={imgClass} 
//     src={image}/>
//     </div>

// )

//       }else if(previewData&& previewData.image) {
//     return(     <div className={" flex  text-center shadow-sm max-h-[70px] max-w-[70px] overflow-hidden rounded-full  "}>
//     <IonImg className={"object-fit  w-[100%]  min-w-[70px] "} src={previewData.image}  alt="Link Preview" />
//     </div>
//     )
//     }else{
//       return null
//     }
//   }

  return (
    <ErrorBoundary>
    <div className={`rounded-[2em] overflow-hidden my-4  h-[20em] md:h-[10em] ove sm:max-h-30 w-[100%] shadow-md flex flex-col sm:flex-row p-4 bg-emerald-100 `} 
    onClick={handleClick} style={{ cursor: 'pointer' }}>
     
     {imageView()}
      <div className=' px-2 text-emerald-800 overflow-scroll text-left  open-sans-medium'>
      <h4 className='text-[0.8rem]'><strong>{title}</strong></h4>
   <h6 className='  text-[0.7rem] md:text-md  '> {description}</h6>
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default LinkNode;