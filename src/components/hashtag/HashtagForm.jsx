
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
export function HashtagForm({item}){
    const storyHashtags = useSelector(state=>state.hashtags.storyHashtags)
    const {setError}=useContext(Context)
    const {id}=useParams()
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch()
    const [hashtags, setHashtags] = useState([]);
     useLayoutEffect(()=>{
        resetHashtags()
    },[storyHashtags])
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const resetHashtags= ()=>{
      if(storyHashtags.length>0){
        setHashtags(storyHashtags)
      }
      
    }
  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
    useLayoutEffect(()=>{
      if(item){
        if(item.storyIdList){
          dispatch(fetchCollectionHashtags({profile:currentProfile,colId:id}))

        }else{
          dispatch(fetchStoryHashtags({profile:currentProfile,storyId:id})).then(res=>{
            checkResult(res,payload=>{
              setHashtags(payload.hashtags)
            },err=>{

            })
          })
        }
      }
    },[id])

    const deleteHashtag =  (hash) =>{
      if(item.storyIdList){
        dispatch(deleteHashtagCollection({hashId:hash.id})).then(res=>{
          checkResult(res,payload=>{
              dispatch(fetchCollectionHashtags({profile:currentProfile,colId:item.id})).then(res=>{
                checkResult(res,payload=>{
                  if(payload.hashtags&&payload.hashags.length){
                    setHashtags(payload.hashtags)
                  }
            
                },err=>{
                  
                })
              })
       
          },err=>{

          })
      })
      }else{

        dispatch(deleteHashtagStory({hashtagStoryId:hash.id})).then(res=>{
          checkResult(res,payload=>{
          
              dispatch(fetchStoryHashtags({profile:currentProfile,storyId:item.id})).then(res=>{
               checkResult(res,payload=>{
                setHashtags(payload.hashtags)

               },err=>{

               })
              })
     
          },err=>{

          })
      })
     
      }
      
    }
    const handleKeyDown = (e) => {
      console.log("HASG",e)
try{
        // if(item && currentProfile){
      if (e.key === 'Enter' && inputValue.trim()) {
        if(item.storyIdList){
          dispatch(createHashtagCollection({name:inputValue.trim().toLocaleLowerCase(),colId:item.id,profile:currentProfile})
        ).then(res=>checkResult(res,(payload)=>{
      
          dispatch(fetchCollectionHashtags({profile:currentProfile,colId:item.id}))
          
        },err=>{
    
        }))
    }else{
   


    dispatch(createHashtagPage({name:inputValue.trim().toLocaleLowerCase(),storyId:item.id,profile:currentProfile})
  ).then(res=>checkResult(res,(payload)=>{
    if(payload.error){

      setError("Hashtag already attached")
    }
    dispatch(fetchStoryHashtags({profile:currentProfile,storyId:item.id})).then(res=>{
      checkResult(res,payload=>{
        if(payload.hashtags){
          setHashtags(payload.hashtags)
        }
 
      },err=>{

      })
    })
    
  },err=>{

    setError("Hashtag already attached")
  }))
    }
        setInputValue('');
        e.preventDefault(); 
      }
    }catch(err){
      setError(err)
    }
   
    };
  
    return (
      // <ErrorBoundary>
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

