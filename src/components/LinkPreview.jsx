import { useState, useLayoutEffect,useEffect } from 'react';
import Enviroment from '../core/Enviroment';
import { Spotify } from 'react-spotify-embed';
import { Skeleton } from '@mui/material';
import "../App.css"
function LinkPreview({ url,isGrid}) {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {

    if(!url.includes('https://open.spotify.com/')){  
    fetchData(url).then(data=>{

    })
    return 
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
      // +isGrid?" rounded-lg   mx-auto   ":
      <div  className={isGrid?"spotify max-w-[100%]":"spotify w-[96vw] md:w-page"} 
            style={{ cursor: 'pointer' }}>
        <Spotify width={"100%"} style={{minHeight:"27.5em"}} className="bg-emerald-200 max-h-[20em]"
         link={url}/>
      </div>)
  }
  if (loading) {
    return <Skeleton height={"20em"}width={"100%"}/>
  }

  if (!previewData) {
    return <p>Failed to fetch link preview.</p>;
  }

 

  if (previewData.videoId) {
    return (
    
        <img onClick={handleClick} style={{ cursor: 'pointer' }} className="w-full
       "src={previewData.videoThumbnail} alt="Video Thumbnail" />

    );
  }
  const imageView = ()=>{
    if(previewData.title!=="Spotify"){
    return(<div>
      {previewData.image && <img  className={isGrid?"rounded-lg pt-8 w-fit max-h-36 w-[100%] overflow-hidden mx-auto max-w-[96%] ":"  w-[100%] rounded-t-lg  "}src={previewData.image}  alt="Link Preview" />}
    </div>)
    }else{
       return (
        <div className='spotify rounded-lg w-[96vw] md:w-page'>
        <Spotify  height={"140"}link={url}/>
        </div>
      )
    }
  }
  const previewTitle=()=>{
    if(previewData.title!=="Spotify"){
    return(<h4 className={isGrid?"":' text-slate-800 bg-emerald-200  text-[1rem] p-4'}>{previewData.title}</h4>)
    }else{
      return(<div></div>)
    }
  }
  const previewDescription=()=>{
    if(previewData.title!=="Spotify"){
      return(<h6 className={isGrid?"max-h-24 p-1 mx-auto":'text-slate-800 py-8  p-3 bg-emerald-200  text-[0.8rem]'} >{previewData.description}</h6>)
      }else{
        return(<h6 className={'text-slate-800 py-4  top-1 p-3 bg-emerald-200  text-[0.8rem]'}>{previewData.description}</h6>)
      }
  }

  return (
    <div className={isGrid?" text-white w-fit  p-2 w-[100%] mx-auto":"h-fit bg-emerald-200 w-[96vw] md:w-page text-slate-800 "} onClick={handleClick} style={{ cursor: 'pointer' }}>
      {imageView()}
      <div className='text-left open-sans-medium'>
   {previewDescription()}
      {previewTitle()}
      </div>
    </div>
  );
}

export default LinkPreview;