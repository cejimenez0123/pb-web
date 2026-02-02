import { useState, useLayoutEffect,useContext } from 'react';
import Enviroment from '../core/Enviroment';
import "../App.css"
import ErrorBoundary from '../ErrorBoundary';
import { initGA,sendGAEvent } from '../core/ga4';
import SpotifyEmbed from './SpotifyEmbed';
import { IonImg } from '@ionic/react';
import Context from '../context';
function LinkNode({ url,name,image,description,title,isGrid}) {

  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {isTablet}=useContext(Context)
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
    sendGAEvent("outbound_click", {
    destination: name?? url,
    link_title: title,
    link_type: isYouTubeURL(url)
      ? "youtube"
      : url.includes("spotify")
      ? "spotify"
      : "external",
    source: "link_node",
    layout: isGrid ? "grid" : "list",
  });
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
  // const wrapperClass = "flex items-center mx-auto bg-transparent justify-center mb-2 sm:mx-4 w-[5em] h-[5em] rounded-full overflow-hidden bg-emerald-50";
  // const imgClass = "object-cover min-h-[4rem]  min-w-[5.5rem] w-full h-full";\
//   const wrapperClass =
//   "max-w-[10em] my-auto sm:pb-2  max-h-[8em] sm:max-h-[8em] my-auto";

// const imgClass = "  object-cover max-h-[6em] sm:h-[6rem]  sm:min-w-[6rem]";
const wrapperClass = "flex-shrink-0 sm:w-[10em] rounded-xl overflow-hidden bg-transparent";

const imgClass = "object-contain p-1 ";

let css= {"height":"6em","margin":"auto"}
  if (previewData && previewData.title === "Spotify") {
    return <SpotifyEmbed url={url} />;
  } else if (image) {
    return (
      <div className={wrapperClass}>
        <IonImg className={imgClass} style={css} src={image} />
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



  return (
  <ErrorBoundary>
    <div
      className={`
        rounded-[2em] overflow-hidden my-4
        w-full shadow-md 
        bg-emerald-100 p-4
        h-[21em]  sm:h-[12em]
        flex flex-col sm:flex-row 
        gap-4
      `}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >


      <div className="flex-shrink-0 w-full sm:w-auto flex justify-center">
        {imageView()}
      </div>
<div>
      {/* TEXT */}
      <div className="flex flex-col justify-center text-left px-1 text-emerald-800 open-sans-medium">
        <h4 className="text-[0.9rem] font-semibold">{title}</h4>
        <h6 className="text-[0.8rem] md:text-md leading-snug mt-1">
          {description}
        </h6>
      </div>
      </div>
    </div>
  </ErrorBoundary>
);

}

export default LinkNode;