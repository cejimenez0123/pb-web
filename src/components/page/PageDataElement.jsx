import { useEffect,useRef,useState } from "react"
import getDownloadPicture from "../../domain/usecases/getDownloadPicture"
import { PageType } from "../../core/constants"
import LinkPreview from "../LinkPreview"
import isValidUrl from "../../core/isValidUrl"
import loadingGif from "../../images/loading.gif"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useLocation } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
export default function PageDataElement({page,isGrid}){
    const contentRef = useRef(null);

    const [isOverflowing, setIsOverflowing] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [image,setImage]=useState(isValidUrl(page.data)?page.data:null)
    const navigate = useNavigate()
    const location = useLocation()
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
    const height = !location.pathname.includes("story")?isGrid?` rounded-b-lg overflow-hidden`:`overflow-hidden  text-ellipsis`:""
    useEffect(()=>{
        if(page && page.type==PageType.picture){
            if(isValidUrl(page.data)){
                setImage(page.data)
            
            }else{
                getDownloadPicture(page.data).then(url=>{
                    setImage(url)
                
                }).catch(err=>{
                   
                })
            }
        }
    },[page])
    useEffect(() => {
        const el = contentRef.current;
        if (el) {
          // Timeout ensures DOM has rendered
          setTimeout(() => {
            setIsOverflowing(el.scrollHeight > el.clientHeight);
          }, 0);
        }
      }, [page]);
    if(page){
    
switch(page.type){
    case PageType.text:{

    return( <div className="  max-w-grid-mobile-content md:w-page ">
        <div
         ref={contentRef}
         onClick={()=>{
            navigate(Paths.page.createRoute(page.id))
        }}
       className={
        isGrid
      ? ` px-1 ${height} rounded-lg  h-[100%] mx-auto ` // removed h-[100%] and overflow-hidden
      :  `rounded-lg   ${height} h-[100%]  bg-emerald-200`
  
        }
        >

        <div 
        className={`ql-editor rounded-lg md:w-page break-words whitespace-pre-wrap ${isGrid ? "mt-2   text-emerald-800 max-h-[18em] " : "  pb-8"}`}
        style={{
          maxHeight: isGrid ? '200px' : 'auto', 
          overflowY: isGrid ? 'hidden' : 'visible', // or use 'auto' for scroll
          textOverflow: 'clip', // remove ellipsis
          display: 'block', // ensure flow layout
        }}
         dangerouslySetInnerHTML={{__html:page.data}}/>

    </div>
    
    </div>
  );
    }
  case PageType.picture:{
  
    return(image?<div  
        className={` ${isGrid?` rounded-lg mx-auto pt-2 mb-8`:` w-[96vw] md:w-page rounded-lg overflow-hidden `}${height}`}
      
        onClick={()=>{ if(location.pathname!=Paths.page.createRoute(page.id)){
        navigate(Paths.page.createRoute(page.id))}
    }}>
       {/* <div className={` ${isGrid?" justify-center overflow-hidden w-full rounded-lg ":"w-[100%]"}`}> */}
        <img className={"md:w-page"+(isGrid?`rounded-lg  w-grid-mobile-content overflow-hidden ${height} `:`${height} rounded-t-lg overflow-hidden  `)}
    
    src={image} alt={page.title}/>
   </div>:<div className='skeleton w-[100%] min-h-40'/>)
}
case PageType.link:{
    return(<div 
        className={` ${isGrid?"  ":" md:w-page"}`}>
        <LinkPreview
            isGrid={isGrid}
            url={page.data}
        />
        </div>)
}
default:
    return(<div className='skeleton min-h-24'>
   <img src={loadingGif}/>
</div>)
}
}
}