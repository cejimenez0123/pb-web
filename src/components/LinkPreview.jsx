import { useState, useEffect } from 'react';
import Enviroment from '../core/Enviroment';
import { Spotify } from 'react-spotify-embed';
import { Skeleton } from '@mui/material';
import "../App.css"
import { debounce } from 'lodash';
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
    debounce(()=>{

    fetchData();
  
},1000)()
}}, [url]);
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
      <div  className=" rounded-t-lg spotify " 
            style={{ cursor: 'pointer' }}>
        <Spotify width={"100%"}   className='' link={url}/>
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
      {previewData.image && <img  className=" w-[100%] rounded-t-lg  "src={previewData.image}  alt="Link Preview" />}
    </div>)
    }else{
      
       return (
        <div className='rounded-lg'>
        <Spotify width={"100%"}  link={url}/>
        </div>
      )
    }
  }
  const previewTitle=()=>{
    if(previewData.title!=="Spotify"){
    return(<h4 className=' text-slate-800 bg-emerald-200  text-[1rem] p-4'>{previewData.title}</h4>)
    }else{
      return(<div></div>)
    }
  }
  const previewDescription=()=>{
    if(previewData.title!=="Spotify"){
      return(<h6 className='text-slate-800 py-8  p-3 bg-emerald-200  text-[0.8rem]' >{previewData.description}</h6>)
      }else{
        return(<h6 className='text-slate-800 py-4  p-3 bg-emerald-200  text-[0.8rem]'>{previewData.description}</h6>)
      }
  }
  return (
    <div className="link-preview bg-emerald-200 text-slate-800 " onClick={handleClick} style={{ cursor: 'pointer' }}>
      {imageView()}
      {previewDescription()}
      {previewTitle()}
    </div>
  );
}

export default LinkPreview;