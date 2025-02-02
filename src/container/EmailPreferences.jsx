import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams ,useSearchParams} from "react-router-dom";
import { updateSubscription } from "../actions/UserActions";
import checkResult from "../core/checkResult";
import Context from "../context";

export default function EmailPreferences() {
  const {setSuccess,setError}=useContext(Context)
  const selectRef = useRef()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  let tokenstr = searchParams.get("token")
 
  const [token,setToken]=useState(tokenstr)
  const [unsubscribed,setUnsubscribed]=useState(false)
  const [frequency, setFrequency] = useState(1);
  useEffect(()=>{

      save()

  },[frequency])

  
  useEffect(() => {
    if (searchParams.get("unsubscribed") === "true") {
      setUnsubscribed(true);
    }else{
      let token = searchParams.get("token")
      setToken(token)
    }
  },[searchParams])

  const save=()=>{
      dispatch(updateSubscription({token,frequency:new Number(frequency)})).then(res=>{
        checkResult(res,payload=>{
setSuccess(payload.message)
        },err=>{
            setError(err.message)
        })
      })
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {unsubscribed ? (
          <>
            <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
              You have been unsubscribed
            </h2>
            <p className="text-gray-600 text-center mb-6">
              You will no longer receive updates from Plumbum. If this was a mistake, you can resubscribe below.
            </p>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg">
              Resubscribe
            </button>
          </>
        ) :( <div className="card my-8 w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
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
          setFrequency(selectRef.current.value)
//  setFrequency(selectRef.current.value)
        }} className="btn w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg">
          Save Preferences
        </a>
        <p className="text-center text-sm text-gray-500 mt-4">
          Want to stop receiving emails? 
          <a onClick={()=>{
            setFrequency("0")
       
          }} className="text-emerald-600 mx-2 font-semibold hover:underline">Unsubscribe</a>
        </p>
      </div>)}
    </div>
  );
}
