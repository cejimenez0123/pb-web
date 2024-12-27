
import { useEffect ,useLayoutEffect,useState} from "react";
import { useSelector } from "react-redux";
import { createHashtagPage, deleteHashtagStory, fetchStoryHashtags,  } from "../../actions/HashtagActions";
import { useDispatch } from "react-redux";
import checkResult from "../../core/checkResult";
import clear from "../../images/icons/clear.svg"
export function HashtagForm(){
    const storyHashtags = useSelector(state=>state.hashtags.storyHashtags)
    const  page = useSelector(state=>state.pages.pageInView)
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch()
    const [hashtags, setHashtags] = useState([]);
     useLayoutEffect(()=>{
   
       setHashtags(storyHashtags)
    },[storyHashtags])
    const currentProfile = useSelector(state=>state.users.currentProfile)

  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
    useLayoutEffect(()=>{
        if(page){
        dispatch(fetchStoryHashtags({profile:currentProfile,storyId:page.id}))
        }
    },[page])
    const deleteHashtag =  (hash) =>{

        dispatch(deleteHashtagStory({hashtagStoryId:hash.id})).then(res=>{
            checkResult(res,payload=>{
                dispatch(fetchStoryHashtags({profile:currentProfile,storyId:page.id}))
       
            },err=>{

            })
        })
    }
    const handleKeyDown = (e) => {

        if(page && currentProfile){
      if (e.key === 'Enter' && inputValue.trim()) {
        dispatch(createHashtagPage({name:inputValue.trim().toLocaleLowerCase(),storyId:page.id,profile:currentProfile})
      ).then(res=>checkResult(res,(payload)=>{
        dispatch(fetchStoryHashtags({profile:currentProfile,storyId:page.id}))
        
      },err=>{

      }))
       
        setInputValue('');
        e.preventDefault(); 
      }
    }else{
        window.alert("No Page or Profile")
    }
    };
  
    return (
      <div>
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a hashtag and press Enter"
          rows="3"
        className="textarea w-[100vw] sm:w-full border-b border-white bg-transparent text-white"
        />

      <div>
        <h4>Hashtags:</h4>
        <ul className="flex flex-wrap p-2">
          {hashtags.map((hash, index) => (
            <li  className=" p-1 flex flex-row m-1 text-sm rounded-lg text-black bg-slate-300 "key={index}>#{hash.hashtag.name}<img 
            className="color-black mx-1 my-auto" 
            onClick={()=>deleteHashtag(hash)}
            src={clear}/></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HashtagForm;

