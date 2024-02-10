import { useState, useEffect } from 'react';
import Enviroment from '../core/Enviroment';
import { Spotify } from 'react-spotify-embed';
import { Skeleton } from '@mui/material';
import loadingAnimation from "../images/loading-animation.json"
import Lottie from "lottie-react";
function LinkPreview({ url,size }) {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!url.includes('https://open.spotify.com/')){
    const fetchData = async () => {
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
         
            // let iframe = doc.querySelector('#urlSchemeIframeHandler');
            // If og:image meta tag is not present, try to find other image elements
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
        console.error("error1"+error);
        setLoading(false);
      }
    };

    fetchData();
  }
  }, [url]);
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
      <div  className="link-preview" 
            // onClick={handleClick} 
            style={{ cursor: 'pointer' }}>
        <Spotify width={"100%"} link={url}/>
      </div>)
  }
  if (loading) {
    return <Skeleton width={"100%"}/>
    // return <p>Loading...</p>;
  }

  if (!previewData) {
    return <p>Failed to fetch link preview.</p>;
  }

 

  if (previewData.videoId) {
    return (
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img style={{width:"100%"}}src={previewData.videoThumbnail} alt="Video Thumbnail" />
      </div>
    );
  }
  const imageView = ()=>{
    if(previewData.title!=="Spotify"){
    return(<div>
      {previewData.image && <img src={previewData.image}  alt="Link Preview" />}
    </div>)
    }else{
      
       return (<div >
      
         <Spotify width={"100%"}  link={url}/>
        
      </div>)
    }
  }
  const previewTitle=()=>{
    if(previewData.title!=="Spotify"){
    return(<h4 className='title'>{previewData.title}</h4>)
    }else{
      return(<div></div>)
    }
  }
  const previewDescription=()=>{
    if(previewData.title!=="Spotify"){
      return(<p>{previewData.description}</p>)
      }else{
        return(<p>{previewData.description}</p>)
      }
  }
  return (
    <div className="link-preview" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {imageView()}
      {previewDescription()}
      {previewTitle()}
    </div>
  );
}

export default LinkPreview;