import { PageType } from "../core/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPage} from "../actions/PageActions"
import { useEffect } from "react";
export default function PageViewContainer({page}){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const loading = useSelector(state=>state.pages.loading)
    let pageDataElement = (<div>

    </div>)
    const getPage=()=>{
        const id =  pathParams["id"]
        console.log(`PageViewContainer ${JSON.stringify(pathParams)}`)
        dispatch(fetchPage(pathParams))
    }
    useEffect(()=>{
     
            getPage()
        
    },[])

    if(!loading && page!=null){

    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='text' dangerouslySetInnerHTML={{__html:page.data}}></div>
        break;
        case PageType.picture:
            pageDataElement = <img className='dashboard-data' src={page.data} alt={page.title}/>
        break;
        case PageType.video:
            pageDataElement = <video src={page.data}/>
        break;
        default:
            pageDataElement = <div className='dashboard-data' dangerouslySetInnerHTML={{__html:page.data}}/>
        break;
    }

    return(<div>
            PageViewContainer


    </div>)}else{
        
        return(<div>
            Loading...
        </div>)
    }
}