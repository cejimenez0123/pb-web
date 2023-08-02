import RichEditor from "../components/RichEditor"
import "../styles/Editor.css"
import {connect} from "react-redux"
import { setHtmlContent } from "../actions/PageActions"
function EditorContainer(props){
        
    // const pagesInView = useSelector((state)=>state.pages.pagesInView)
    //     // let [loading,setLoading] = useState(false)
    //     let [pages,setPages] = useState([])
    //     useLayoutEffect(()=>{
                
    //             // setPages(pagesInView)
    //     },[pagesInView])
    //     useEffect(()=>{        
    //         props.getPublicPages()
    //     },[pagesInView])
        
//     console.log(`dashboard ${pagesInView[0].title}`)
//   const display = ()=>{
//    return pagesInView.map((page)=>{<h2>{page.title}</h2>})}

        return(
          <div>
            <RichEditor htmlContent={props.htmlContent} setHtmlContent={props.setHtmlContent}/>
          </div>
        )
        
}

export default EditorContainer