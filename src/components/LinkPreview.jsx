
import { useState, useLayoutEffect,useEffect, useContext } from 'react';
import Enviroment from '../core/Enviroment';
import "../App.css"
import { initGA, sendGAEvent } from '../core/ga4';
import adjustScreenSize from '../core/adjustScreenSize';
import Context from '../context';
import SpotifyEmbed from './SpotifyEmbed';

function LinkPreview({ url,isGrid}) {
  const {isPhone,isHorizPhone}=useContext(Context)
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
 const size = adjustScreenSize(isGrid,true," bg-emerald-200 rounded-t-lg overflow-hidden"," rounded-t-lg pt-4 overflow-hidden mx-auto "," rounded-t-lg "," rounded-t-lg "," h-[100%] ")
  // let content = adjustScreenSize(isGrid,true," mobile "," mobile "," horiz "," phone","  ")
  // const spotifySize = isGrid?isPhone?"15rem":"20em":isHorizPhone?"44.8em":" 44em"


  useLayoutEffect(() => {
    if(url.includes("plumubum.app")){

      fetchData(url).then(res=>res)
    }else if(!url.includes('https://open.spotify.com/')){
      fetchLinkPreview(url).then(res=>{})
    }else{

    }


}, [url]);

const fetchLinkPreview = async (url) => {
  try {

    fetchData(url).then(res=>{

    }).catch(err=>{
      console.log(err)
    })




  }catch(err){
    console.log(err)
  }}
const fetchData = async (url) => {
  try {

    const response = await fetch(`${Enviroment.proxyUrl}${url}`, {
      headers:{
        "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
      }
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
useLayoutEffect(()=>{
  initGA()
})
  const handleClick = () => {
    sendGAEvent("Click Link Preview",`Navigate to ${previewData?previewData.title:""}:${url}`)
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
      <SpotifyEmbed url={url}/>
   
   
    )

  }
  if (loading) {
    return <div className={"skeleton "+size}/>
  }

  if (!previewData) {
    return <p>Failed to fetch link preview.</p>;
  }

 

  if (previewData.videoId) {
    return (
        <img onClick={handleClick} style={{ cursor: 'pointer' }} className={`rounded-lg p-1 ${size}`}src={previewData.videoThumbnail} alt="Video Thumbnail" />

    );
  }
  
  const imageView = ()=>{
  
    if(previewData.title!=="Spotify"){
    return previewData.image && <a href={`${url}`} className={size+""}><img  
 className=' rounded-t-lg'
          src={previewData.image}  alt={previewData.title} /></a>
    }else{
       return (
  <SpotifyEmbed url={url}/>
      
      
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
    if(!isPhone&&!isGrid){
    if(previewData.title!=="Spotify"){
      return(<h6 
       className={isGrid?" overflow-scroll pt-2  px-1 mx-auto":'text-slate-800 p-3 bg-emerald-200  text-[0.8rem]'}
       >{previewData.description}</h6>)
      }else{
        return(<h6 className={'text-slate-800 py-4  top-1 p-3 bg-emerald-200  text-[0.8rem]'}>{previewData.description}</h6>)
      }
    }
  }
  return (
    <div 
    
    
    className={`
   w-page-mobile
    mx-auto
`}
    
    onClick={handleClick} style={{ cursor: 'pointer' }}>
      {imageView()}
      <div className='text-left  overflow-clip open-sans-medium'>
   {previewDescription()}
      {isGrid?null:previewTitle()}
      </div>
    </div>
  );
}

export default LinkPreview;