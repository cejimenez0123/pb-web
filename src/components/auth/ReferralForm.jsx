import { useContext, useEffect,useLayoutEffect, useState } from "react"
import authRepo from "../../data/authRepo"
import Context from "../../context"
import loadingGif from "../../images/loading.gif"
import copyContent from "../../images/icons/content_copy.svg"
import { IonImg } from "@ionic/react"
// import {DialogActions,Button} from "@mui/material"

// export default function ReferralForm({onClose}){
//     const [name,setName]=useState("")
//     const [email,setEmail]=useState("")
//     const [referralLink,setReferralLink]=useState("")
//     const [pending,setPending]=useState(false)
//     const {setSuccess}=useContext(Context)
//     const [message,setMessage]=useState("")
//     const [referral,setReferral]=useState(null)
//     useLayoutEffect(()=>{

//         setPending(true)
//         authRepo.generateReferral().then(data=>{
        
//             if(data.referralLink){
//             setReferralLink(data.referralLink)
//             }
//             if(data.message){
//                 setMessage(data.message)
//             }
         
//             setPending(false)
//         })},[])
//     const handleClick = ()=>{
//         authRepo.referral({email:email.toLowerCase(),name}).then(data=>{
//             if(data.message){
//                 alert(data.message)
//                 onClose()
//             }
//         })}
   
//     const copyToClipboard=()=>{
//         navigator.clipboard.writeText(referralLink)
//         .then(() => {
       
//             setSuccess('Link Copied to clipboard');
//             setMessage("Link copied")
//           })
//           setTimeout(()=>{
//             setMessage("")
//           },2000)
//     }
//     return( 

//     <div className="flex flex-col md:min-w-[30em] md:min-h-[40em] m-1 px-3 py-4">
        
// <h1 className="mx-auto  text-emerald-800 mb-8 text-xl">Refer Someone Today</h1>

//             {referral&&   referral.usageCount?<h2 className="text-emerald-800">{referral.usageCount}</h2>:null}
//         {pending?<IonImg src={loadingGif} className="icon"/>:referralLink.trim().length>0?
//         <span className="flex mt-6"><input type="text" 
//          value={referralLink} disabled className="bg-transparent w-[100%] border-2 border-emerald-800 py-2 px-4 rounded-full text-[0.8rem] md:text-l "/><IonImg src={copyContent} onClick={copyToClipboard} className="icon"/></span>:<div className="icon"/>}
//          <div className="text-center"><h6 className=" mb-6 mx-8">{message}</h6></div>
//           <h3 className="text-emerald-800 text-xl  py-4 mt-3 mx-auto text-opacity-70">OR</h3>
//           <label className="text-emerald-800 mx-4 text-lg  mt-3">
//             Friend's Name
//         </label>
//         <input
//           value={name} 
//           onChange={(e)=>setName(e.target.value)}
//         className='text-xl my-4 px-4 py-3 open-sans-medium text-[0.8rem] bg-transparent border-emerald-800 border-2 rounded-full rounded-full text-emerald-800  w-[100%]' type='text'/>
//         <label className="text-emerald-800 text-lg ">
//             Friend's Email
//         </label>
//         <input 
//         value={email}
//         onChange={(e)=>setEmail(e.target.value.toLocaleLowerCase().trim())}
//         className='text-[0.8rem] my-4 rounded-full px-2 py-4 open-sans-medium bg-transparent border-2 border-emerald-800 text-emerald-800 w-[100%]' type='text'/>
//         <div className=" rounded-full   h-12 mx-auto  py-2 flex bg-gradient-to-r w-[20em] from-emerald-600 to-emerald-500 text-emerald-800 " onClick={handleClick}><h6 className="text-emerald-800 mx-auto text-lg mx-auto  py-3 text-white my-auto">Submit</h6></div>


//      </div>
     

//     )
// }
export default function ReferralForm({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [pending, setPending] = useState(false);
  const { setSuccess } = useContext(Context);
  const [message, setMessage] = useState("");
  const [referral, setReferral] = useState(null);

  useLayoutEffect(() => {
    setPending(true);
    authRepo.generateReferral().then((data) => {
      if (data.referralLink) setReferralLink(data.referralLink);
      if (data.message) setMessage(data.message);
      setPending(false);
    });
  }, []);

  const handleClick = () => {
    authRepo
      .referral({ email: email.toLowerCase(), name })
      .then((data) => {
        if (data.message) {
          alert(data.message);
          onClose();
        }
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setSuccess("Link copied");
      setMessage("Link copied");
    });
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="flex flex-col md:min-w-[28em] px-4 py-5">
      
      {/* Title */}
      <h1 className="text-center text-lg font-semibold text-gray-900 mb-6">
        Refer a Friend
      </h1>

      {/* Referral Usage */}
      {referral?.usageCount && (
        <p className="text-center text-sm text-gray-500 mb-2">
          {referral.usageCount} referrals used
        </p>
      )}

      {/* Link Section */}
      {pending ? (
        <IonImg src={loadingGif} className="w-10 mx-auto my-6" />
      ) : referralLink ? (
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <input
            value={referralLink}
            disabled
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg active:scale-95"
          >
            <IonImg src={copyContent} className="w-5 h-5 opacity-70" />
          </button>
        </div>
      ) : null}

      {/* Message */}
      {message && (
        <p className="text-center text-sm text-gray-500 mt-3">
          {message}
        </p>
      )}

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-[1px] bg-gray-200" />
        <span className="mx-3 text-xs text-gray-400">OR</span>
        <div className="flex-1 h-[1px] bg-gray-200" />
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">
            Friend’s Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name..."
            className="w-full mt-1 px-3 py-3 rounded-xl bg-softBlue text-soft outline-none focus:ring-2 focus:ring-emerald-500"
            type="text"
          />
        </div>

        <div className="flex flex-col"> 
          <label className="text-sm text-gray-600">
            Friend’s Email
          </label>
          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value.toLowerCase().trim())
            }
            placeholder="example@example.com"
            className="w-full mt-1 px-3 py-3 rounded-xl bg-softBlue text-soft outline-none focus:ring-2 focus:ring-emerald-500"
            type="email"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleClick}
        className="mt-6 h-12 rounded-full bg-emerald-600 text-white font-medium active:scale-[0.98]"
      >
        Send Invite
      </button>
    </div>
  );
}