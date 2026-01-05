import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSubscription } from "../actions/UserActions";
import checkResult from "../core/checkResult";
import Context from "../context";
import { useIonRouter } from "@ionic/react";

export default function EmailPreferences() {
  const {setSuccess,setError,setSeo,seo}=useContext(Context)
  const selectRef = useRef()
  const router = useIonRouter()
  const dispatch = useDispatch()

  const [searchParams] = router.routeInfo.search
  let tokenstr = searchParams.get("token")
  const [token,setToken]=useState(tokenstr)
  const [unsubscribed,setUnsubscribed]=useState(false)
  const [frequency, setFrequency] = useState(1);

  useLayoutEffect(()=>{
    let soo = seo
    soo.title="Plumbum (Email Preferences)"
    setSeo(soo)
  },[])
  useEffect(() => {
    if (searchParams.get("unsubscribe") === "true") {

      setUnsubscribed(true);
      let token = searchParams.get("token")
      setToken(token)
    }else{
      let token = searchParams.get("token")
      setToken(token)
      setUnsubscribed(false)
    }
  },[searchParams])

  const save=()=>{
      dispatch(updateSubscription({token,frequency:new Number(selectRef.current.value)})).then(res=>{
        checkResult(res,payload=>{
setSuccess(payload.message)
        },err=>{
          console.log(err)
           if(err && !err.message.includes("Network")){
setError(err.message)
           }else if(err){
            setError(err.message)
           }
        })
      })
  }
  const unsubscribe=()=>{
    dispatch(updateSubscription({token,frequency:0})).then(res=>{
      checkResult(res,payload=>{
        let pars = new URLSearchParams({unsubscribe:"true",token})
        router.push("/subscribe?"+pars.toString())
      },err=>{
         if(!err.message.includes("Network")){
setError(err.message)
         }
      })
    })
  }
  const resubscribe=()=>{
    let pars = new URLSearchParams({token})
    setUnsubscribed(false)
    router.push("/subscribe?"+pars.toString())
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      {unsubscribed ? (
          <>
          <div className="card mx-auto my-12">
            <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
              You have been unsubscribed
            </h2>
            <p className="text-gray-600 text-center mb-6">
              You will no longer receive updates from Plumbum. If this was a mistake, you can resubscribe below.
            </p>
            <a onClick={
              ()=>resubscribe()
            }className="w-full flex max-w-[100vw] md:w-[36em] h-[4em] mx-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full">
              <h6 className="mx-auto mont-medium text-xl my-auto">Resubscribe</h6>
            </a>
            </div>
          </>
        ) :( <div className="card my-4 md:my-8  max-h-[40em] mx-2 md:mx-auto w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-emerald-700 mb-4">
          Manage Email Preferences
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Choose how often you'd like to receive updates from Plumbum.
        </p>
        <div className="mb-4 flex flex-row justify-between">
          <label className="block text-emerald-700 mont-medium text-xl font-semibold mb-2">
            Email Frequency
          </label>
          <select
            className="w-full bg-white select text-emerald-700 mont-medium select-bordered "
            value={frequency}
            ref={selectRef}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option className="text-emerald-700" value={1}>daily</option>
            <option  className="text-emerald-700" value={2}>Every 3 days</option>
            <option  className="text-emerald-700" value={3}>Weekly</option>
            <option  className="text-emerald-700" value={14}>Every 2 Weeks</option>
            <option  className="text-emerald-700" value={30}>Monthly</option>

          </select>
        </div>
        <p className="text-gray-600 text-center text-sm mb-4">
          By unsubscribing, you may miss important updates on new features, upcoming events, and exclusive content from the Plumbum community.
        </p>
        <a  onClick={()=>{
     save()
//  setFrequency(selectRef.current.value)
        }} className="btn w-full bg-gradient-to-r  my-auto border-0 from-emerald-500 to-emerald-700 text-white font-bold py-2 px-4 rounded-full">
          Save Preferences
        </a>
        <p className="text-center text-sm text-gray-500 mt-4">
          Want to stop receiving emails? 
          <a onClick={()=>unsubscribe()}
          className="text-emerald-600 mx-2 font-semibold hover:underline">Unsubscribe</a>
        </p>
      </div>)}
    </div>
  );
}
