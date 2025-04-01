import { useState, useLayoutEffect,useEffect } from 'react';
import Enviroment from '../core/Enviroment';
import { Spotify } from 'react-spotify-embed';
import { Skeleton } from '@mui/material';
import "../App.css"
import axios from 'axios';
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { useNavigate } from 'react-router-dom';
async function fetchLinkPreview(url) {
  try {
    const data = await getLinkPreview(Enviroment.proxyUrl+url);
    return data;
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return null;
  }
}
function LinkPreview({ url,isGrid}) {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate()
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
  useLayoutEffect(() => {

    if(!url.includes('https://open.spotify.com/')){  
    fetchLinkPreview(url).then(res=>{})
    return 
}}, [url]);

const fetchLinkPreview = async (url) => {
  try {
    // getLinkPreview(`${url}`, {
    //   resolveDNSHost: async (url) => {
    //     return new Promise((resolve, reject) => {
    //       const hostname = new URL(url).hostname;
    //       axios(`https://dns.google/resolve?name=${hostname}`,{headers:headers})
    //       .then(response =>{ 
          
    //       resolve(response.data)
    //       })
    //       .catch(err=>{
       
    //         if (err) {reject(err)}
    //       })
    //          });
    
    //   },
    // }).then(response=>{
    fetchData(url).then(res=>{

    })
    // })

  }catch(e){
console.log(e)
    }  }


const fetchData = async (url) => {
  try {

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
     
     
        if(!image){
        const imgElement = doc.querySelector('img');

        if (imgElement) {
          image = imgElement.getAttribute('src') || '';
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
      <div  className={isGrid?"spotify rounded-box max-w-[100%]":"spotify w-[96vw] md:w-page"} 
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
    
        <img onClick={handleClick} style={{ cursor: 'pointer' }} className="w-[96vw] md:w-page 
       "src={previewData.videoThumbnail} alt="Video Thumbnail" />

    );
  }
  const imageView = ()=>{
    if(previewData.title!=="Spotify"){
    return(<div>
      {previewData.image && <a href={`${url}`}><img  className={isGrid?"rounded-lg pt-8 w-fit  overflow-hidden mx-auto":"  rounded-t-lg w-[100%] "}src={previewData.image}  alt="Link Preview" /></a>}
    </div>)
    }else{
       return (
        <div className='spotify rounded-box w-[96vw] md:w-page'>
        <Spotify  height={"140"} width={"100%"} link={url}/>
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
      return(<h6 className={isGrid?" overflow-scroll pt-2  px-1 mx-auto":'text-slate-800 pt-8  p-3 bg-emerald-200  text-[0.8rem]'} >{previewData.description}</h6>)
      }else{
        return(<h6 className={'text-slate-800 py-4  top-1 p-3 bg-emerald-200  text-[0.8rem]'}>{previewData.description}</h6>)
      }
  }

  return (
    <div className={isGrid?" text-white w-fit mont-medium w-[100%] mx-auto":"h-fit bg-emerald-200  text-slate-800 "} onClick={handleClick} style={{ cursor: 'pointer' }}>
      {imageView()}
      <div className='text-left open-sans-medium'>
   {previewDescription()}
      {isGrid?null:previewTitle()}
      </div>
    </div>
  );
}

export default LinkPreview;