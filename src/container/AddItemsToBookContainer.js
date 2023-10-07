import { getProfileBooks } from "../actions/BookActions"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
function AddItemsToBookContainer(){
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getProfileBooks())
    },[])
    return (<div>

    </div>)
}