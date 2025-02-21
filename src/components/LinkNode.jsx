import { useState, useLayoutEffect,useEffect } from 'react';
import Enviroment from '../core/Enviroment';
import { Spotify } from 'react-spotify-embed';
import "../App.css"
import ErrorBoundary from '../ErrorBoundary';
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
  if(url!=null && url.includes('https://open.spotify.com/')){
    return(

      <div  className={isGrid?"spotify max-w-[100%]":"spotify w-[96vw] md:w-page"} 
            style={{ cursor: 'pointer' }}>
        <Spotify width={"100%"} style={{minHeight:"27.5em"}} className="bg-emerald-200 max-h-[20em]"
         link={url}/>
      </div>)
  }
  if (loading) {
    return <div className='skeleton min-h-[8em] w-[96vw] md:min-w-[30em] md:w-[100%] my-8 bg-emerald-50 h-[10em] md:h-[10em] rounded-full'/>
  }

  if (!previewData&&!url.includes("plumbum")) {
    return <p>Failed to fetch link preview.</p>;
  }

 

  if (previewData && previewData.videoId) {
    return (
    
        <img onClick={handleClick} style={{ cursor: 'pointer' }} className="w-[96vw] md:w-page 
       "src={previewData.videoThumbnail} alt="Video Thumbnail" />

    );
  }

  const imageView = ()=>{
    let frame = "  flex shadow-sm max-h-[70px] max-w-[70px] overflow-hidden rounded-full  "
    let imgClass = "object-fit my-auto mx-auto  "
    if(previewData && previewData.title=="Spotify"){
      return (
        <div className='spotify rounded-lg w-[96vw] md:w-page'>
        <Spotify  height={"140"}link={url}/>
        </div>
      )}else if(image){
        return(<div className={frame}>
    <img className={imgClass} 
    src={image}/>

</div>)

      }else if(previewData&& previewData.image) {
    return(     <div className={" flex  text-center shadow-sm max-h-[70px] max-w-[70px] overflow-hidden rounded-full  "}>
    <img className={"object-fit    "} src={previewData.image}  alt="Link Preview" />
    </div>
    )
    }else{
      return null
    }
  }

  return (
    <ErrorBoundary>
    <div className={`rounded-[2em] overflow-hidden my-4   w-[100%] shadow-md flex flex-row p-4 bg-emerald-100 `} 
    onClick={handleClick} style={{ cursor: 'pointer' }}>
      {imageView()}
      <div className=' text-emerald-800 overflow-scroll text-left  px-4 open-sans-medium'>
      <h4 className='text-[0.8rem]'><strong>{title}</strong></h4>
   <h6 className='  text-[0.7rem] md:text-md  '> {description}</h6>
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default LinkNode;