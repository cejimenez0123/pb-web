import {useNavigate,useLocation} from 'react-router-dom';
import {useSelector}  from "react-redux"
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useEffect, useLayoutEffect, useState } from 'react';
import { getCurrentProfile } from './actions/UserActions';
import checkResult from './core/checkResult';

const PrivateRoute = ({loggedIn, children }) => {
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [pending,setPending]=useState(true)
    const location = useLocation();

    const [formerPage,setFormerPage]=useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useLayoutEffect(()=>{
      if(currentProfile&&currentProfile.id){
        setPending(false)
      }
    },[currentProfile])
    useLayoutEffect(() => {
      // const token = localStorage.getItem("token")
console.log(formerPage)
    if(currentProfile){
      setPending(false)
        if(formerPage&&formerPage!=Paths.login()){
          navigate(formerPage)
        }else{
          navigate(Paths.myProfile())
        }
    
    }else{
      setPending(false)
      navigate(Paths.login())
     
    }
    }, [currentProfile]);
    useEffect(()=>{
     if(location.pathname){
      console.log(location.pathname)
      setFormerPage(location.pathname)
     }

    },[location.pathname])
    useLayoutEffect(()=>{
      if(!currentProfile){
        setPending(true)
        dispatch(getCurrentProfile()).then(res=>{
          checkResult(res,payload=>{
            if(payload.error){
              setPending(false)
              
                navigate(Paths.login())
            
            }
            if(formerPage){
              setPending(false)
              navigate(formerPage)
            }
       
          },err=>{
            setPending(false)
            if(formerPage){
              navigate(formerPage)
            }else{
              navigate(Paths.login())
            }
           
          })
        })
      }else{
        setPending(false)
      }
    },[])
   
    if(pending){
      return <div style={{color:"white"}}>Loading...</div>
    }

      
    return children
    
  };
export default PrivateRoute;