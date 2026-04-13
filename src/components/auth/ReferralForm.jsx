import { useContext, useEffect,useLayoutEffect, useState } from "react"
import authRepo from "../../data/authRepo"
import Context from "../../context"
import loadingGif from "../../images/loading.gif"
import copyContent from "../../images/icons/content_copy.svg"
import { IonImg, IonLoading } from "@ionic/react"
import { useDispatch } from "react-redux"
import { referSomeone } from "../../actions/UserActions"
import { useDialog } from "../../domain/usecases/useDialog"
import checkResult from "../../core/checkResult"

export default function ReferralForm({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [pending, setPending] = useState(false);
  const {closeDialog}=useDialog()
  const { setSuccess } = useContext(Context);
  const [message, setMessage] = useState("");
  const [referral, setReferral] = useState(null);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    setPending(true);
    authRepo.generateReferral().then((data) => {
      if (data.referralLink) setReferralLink(data.referralLink);
      if (data.message) setMessage(data.message);
      setPending(false);
    });
  }, []);

  const handleClick = () => {
  dispatch(referSomeone({ email: email.toLowerCase(), name })).then((res) => {
    checkResult(res, (payload) => {
      console.log(payload)
      if (payload.message) {
        closeDialog()
        setSuccess(payload.message);
      }
    },error=>{
         onClose()
      window.alert("An error occurred. Please try again.");
  });


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
        
        <IonLoading
  isOpen={pending}
  message={"Loading your space..."}
  spinner="crescent"
/>
      ) : referralLink ? (
        <div className="flex items-center gap-2 bg-base-bg rounded-xl px-3 py-2">
          <input
            value={referralLink}
            disabled
            className="flex-1 bg-base-bg text-sm text-gray-700 outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-base-bg  rounded-full active:scale-95"
          >
            <img src={copyContent} className="w-5 h-5 text-soft opacity-70" />
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
            className="w-full mt-1 px-3 py-3 rounded-full border-earth border border-1 bg-base-bg text-soft outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full mt-1 px-3 py-3 rounded-full bg-base-bg border-earth border border-1 text-soft outline-none focus:ring-2 focus:ring-emerald-500"
            type="email"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleClick}
        className="mt-8 h-12 py-3 rounded-full bg-emerald-600 text-white font-medium active:scale-[0.98]"
      >
        Send Invite
      </button>
    </div>
  );
}