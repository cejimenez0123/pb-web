
import { useContext, useEffect ,useLayoutEffect,useState} from "react";
import { useSelector } from "react-redux";
import { createHashtagCollection, createHashtagPage, deleteHashtagCollection, deleteHashtagStory, fetchCollectionHashtags, fetchStoryHashtags,  } from "../../actions/HashtagActions";
import { useDispatch } from "react-redux";
import checkResult from "../../core/checkResult";
import clear from "../../images/icons/close.svg"
import ErrorBoundary from "../../ErrorBoundary";
import Context from "../../context";
import { useParams } from "react-router-dom";
import { IonImg, IonLabel, IonTextarea } from "@ionic/react";
export function HashtagForm({item,type="story"}){
    const storyHashtags = useSelector(state=>state.hashtags.storyHashtags)
    const {setError}=useContext(Context)
    const isStory = type == "story"
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch()
    const [hashtags, setHashtags] = useState([]);
    //  useLayoutEffect(()=>{
    //     resetHashtags()
    // },[storyHashtags])
    const currentProfile = useSelector(state=>state.users.currentProfile)
    // const resetHashtags= ()=>{
    //   if(storyHashtags.length>0){
    //     setHashtags(storyHashtags)
    //   }
      
    // }
  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

const fetchHashtags=(item)=>{
  // if(item){
        if(!isStory){
          dispatch(fetchCollectionHashtags({profile:currentProfile,colId:item.id})).then(res=>{
                checkResult(res,payload=>{
console.log("ollectionHashtags",payload)
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
      console.log(hash)
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
          console.log("ASSA",res)
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
   
        setInputValue('');
        e.preventDefault(); 
      }))
    }}}catch(err){}finally{
      fetchHashtags(item)
    }}
      useEffect(()=>{
   
    },[])
    return (
       <form className="  w-full flex flex-col mt-2 ">
     
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a hashtag and press Enter"
          rows={4}
          cols={12}
          className=" my-1 w-[96vw] md:w-[48em] mx-auto border-1 border-emerald-600 bg-transparent text-emerald-800"
        />
      <button type="submit"  className="hidden">Submit</button>
      <div className="text-left my-1">
        <IonLabel className="text-emerald-800">Hashtags:</IonLabel>
        <ul className="flex flex-wrap p-4">
          {hashtags.map((hash, index) => (
  
            <li  className=" p-1 flex flex-row m-1 text-sm rounded-lg text-white bg-emerald-800 "key={index}>
              <h6 className="my-auto mx-2">#{hash.hashtag.name}</h6><IonImg 
            className=" my-auto" 
            onClick={()=>deleteHashtag(hash)}
            src={clear}/></li>
          ))}
        </ul>
      </div>
   
    </form>
  
  );
};

export default HashtagForm;

