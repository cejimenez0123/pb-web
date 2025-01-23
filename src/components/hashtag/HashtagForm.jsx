
import { useEffect ,useLayoutEffect,useState} from "react";
import { useSelector } from "react-redux";
import { createHashtagCollection, createHashtagPage, deleteHashtagCollection, deleteHashtagStory, fetchCollectionHashtags, fetchStoryHashtags,  } from "../../actions/HashtagActions";
import { useDispatch } from "react-redux";
import checkResult from "../../core/checkResult";
import clear from "../../images/icons/close.svg"
export function HashtagForm({item}){
    const storyHashtags = useSelector(state=>state.hashtags.storyHashtags)
    
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch()
    const [hashtags, setHashtags] = useState([]);
     useLayoutEffect(()=>{
      if(storyHashtags.length>0){
        setHashtags(storyHashtags)
      }
      
    },[storyHashtags])
    const currentProfile = useSelector(state=>state.users.currentProfile)

  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
    useLayoutEffect(()=>{
      if(item){
        if(!item.storyIdList){
        dispatch(fetchStoryHashtags({profile:currentProfile,storyId:item.id}))
        }else{
          dispatch(fetchCollectionHashtags({profile:currentProfile,colId:item.id}))
        }
      }
    },[item])
    const deleteHashtag =  (hash) =>{
      if(!item.storyIdList){
        dispatch(deleteHashtagStory({hashtagStoryId:hash.id})).then(res=>{
            checkResult(res,payload=>{
                dispatch(fetchStoryHashtags({profile:currentProfile,storyId:page.id}))
       
            },err=>{

            })
        })
      }else{
        dispatch(deleteHashtagCollection({hashId:hash.id})).then(res=>{
          checkResult(res,payload=>{
              dispatch(fetchStoryHashtags({profile:currentProfile,storyId:page.id}))
     
          },err=>{

          })
      })
      }
    }
    const handleKeyDown = (e) => {

        if(item && currentProfile){
      if (e.key === 'Enter' && inputValue.trim()) {
        if(!item.storyIdList){
        dispatch(createHashtagPage({name:inputValue.trim().toLocaleLowerCase(),storyId:page.id,profile:currentProfile})
      ).then(res=>checkResult(res,(payload)=>{
        dispatch(fetchStoryHashtags({profile:currentProfile,storyId:page.id}))
        
      },err=>{

      }))
    }else{
      dispatch(createHashtagCollection({name:inputValue.trim().toLocaleLowerCase(),colId:item.id,profile:currentProfile})
    ).then(res=>checkResult(res,(payload)=>{
      console.log(payload)
      dispatch(fetchCollectionHashtags({profile:currentProfile,colId:item.id}))
      
    },err=>{

    }))
    }
        setInputValue('');
        e.preventDefault(); 
      }
    }else{
        window.alert("No Page or Profile")
    }
    };
  
    return (
      <form className="w-[100%]  ">
      <div >
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a hashtag and press Enter"
          rows="3"
        className="textarea  my-1 w-[100%] mx-auto border-2 border-emerald-600 bg-transparent text-emerald-800"
        />
      <button type="submit" className="hidden">Submit</button>
      <div className="text-left mx-2 my-1">
        <h4 className="text-emerald-800">Hashtags:</h4>
        <ul className="flex flex-wrap p-4">
          {hashtags.map((hash, index) => (
            <li  className=" p-1 flex flex-row m-1 text-sm rounded-lg text-white bg-emerald-800 "key={index}>
              <h6 className="my-auto mx-2">#{hash.hashtag.name}</h6><img 
            className=" my-auto" 
            onClick={()=>deleteHashtag(hash)}
            src={clear}/></li>
          ))}
        </ul>
      </div>
    </div>
    </form>
  );
};

export default HashtagForm;

