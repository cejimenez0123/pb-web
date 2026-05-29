
import { useContext, useEffect ,useLayoutEffect,useState} from "react";
import { useSelector } from "react-redux";
import { createHashtagCollection, createHashtagPage, deleteHashtagCollection, deleteHashtagStory, fetchCollectionHashtags, fetchStoryHashtags,  } from "../../actions/HashtagActions";
import { useDispatch } from "react-redux";
import checkResult from "../../core/checkResult";
import clear from "../../images/icons/close.svg"

import Context from "../../context";
import { IonImg, IonLabel, IonTextarea } from "@ionic/react";
import { ErrorBoundary } from "@sentry/react";
export function HashtagForm({item,type="story"}){

    const {setError}=useContext(Context)
    const isStory = type == "story"
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch()
    const [hashtags, setHashtags] = useState([]);
  
    const currentProfile = useSelector(state=>state.users.currentProfile)


    const handleInputChange = (e) => {
      setInputValue(e.target.value.trim());
    };

const fetchHashtags=(item)=>{

        if(!isStory){
          dispatch(fetchCollectionHashtags({profile:currentProfile,colId:item.id})).then(res=>{
                checkResult(res,payload=>{

                    setHashtags(payload.hashtags)
                  
            
                },err=>{
                  
                })})

        }else{
          dispatch(fetchStoryHashtags({profile:currentProfile,storyId:item.id})).then(res=>{
            checkResult(res,payload=>{
              setHashtags(payload.hashtags)
            },err=>{

            })
          })
        }
      // }
}
    const deleteHashtag =  (hash) =>{
    
   const {hashtag}=hash
      if(!isStory){
        dispatch(deleteHashtagCollection({colId:item.id,hashId:hash.id})).then(res=>{
          checkResult(res,payload=>{
            fetchHashtags(item)

          },err=>{

          })
      })
      }else{

        dispatch(deleteHashtagStory({hashtagStoryId:hash.id})).then(res=>{
          checkResult(res,payload=>{
          fetchHashtags(item)


},err=>{

})})
     
      }
      
    }
    useLayoutEffect(()=>{
      fetchHashtags(item)
    },[])
    const handleKeyDown = (e) => {
   
try{
        // if(item && currentProfile){
      if (e.key === 'Enter' && inputValue.trim()) {
        if(!isStory){
   
          dispatch(createHashtagCollection({name:inputValue.trim().toLocaleLowerCase(),colId:item.id,profile:currentProfile})
        ).then(res=>{
         
         if(res && res.payload){ 
          setHashtags(prev=>[...prev,res.payload.hashtag])
              setInputValue('');
        e.preventDefault(); 

         }else{
          setError("Reached the max on hashtags")
         }    
       
        
          
        })
    }else{
   
    dispatch(createHashtagPage({name:inputValue.trim().toLocaleLowerCase(),storyId:item.id,profile:currentProfile})
  ).then(res=>checkResult(res,(payload)=>{
   if(res && payload){ 
          setHashtags(prev=>[...prev,payload.hashtag])
   }
        setInputValue('');
        e.preventDefault(); 
      }))
    }}}catch(err){}finally{
      fetchHashtags(item)
    }}
      useEffect(()=>{
   
    },[])
    return (
      <ErrorBoundary>
       <form className="  w-full flex flex-col mt-2 ">
     
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a hashtag and press Enter"
          rows={4}
          cols={12}
         className="my-1 w-[90%] p-2 rounded-xl md:w-[48em] bg-base-bg mx-auto border border-soft text-soft placeholder:text-soft/50 focus:outline-none focus:ring-2 focus:ring-button-secondary-bg"  />
      <button type="submit"  className="hidden">Submit</button>
      <div className="text-left my-1">
        <IonLabel className="text-soft text-sm">Hashtags:</IonLabel>
        <ul className="flex flex-wrap p-4">
          {hashtags.map((hash, index) => (
  
            <li  className="p-1 flex flex-row m-1 text-sm rounded-lg bg-button-secondary-bg text-white dark:bg-button-secondary-bg dark:text-white" key={index}>
              <h6 className="my-auto mx-2">#{hash.hashtag.name}</h6><IonImg 
            className=" my-auto" 
            onClick={()=>deleteHashtag(hash)}
            src={clear}/></li>
          ))}
        </ul>
      </div>
   
    </form>
    </ErrorBoundary>
  
  );
};

export default HashtagForm;

