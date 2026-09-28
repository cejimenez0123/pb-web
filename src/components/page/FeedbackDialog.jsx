// import { useLayoutEffect, useState } from "react"
// export default function FeedbackDialog({page,isFeedback,handleChange,handlePostPublic,handleFeedback}){

//  const [feedback,setFeedback]=useState(!page || isFeedback?"":page.description)
//     useLayoutEffect(()=>{
      

//       handleChange(feedback)
//     },[feedback])
//     // const {closeDialog}=useDialog()

//     return<div className={`h-[100%]`}>

//     {/* <div className={`${isHeightPhone?" mx-auto w-[80%]  ":""}`}>  */}
//             <textarea 
//             value={feedback}
//             onChange={e=>{
//                 setFeedback(e.target.value)
//                 handleChange(e.target.value)
//               }}
//             className={`textarea mx-2 w-[96%] dark:text-cream min-h-[7rem] border-opacity-50 rounded-lg border-2 bg-transparent text-emerald-800 border-emerald-600`}/>
//                    <div className="mt-8">
//             <button onClick={()=>handlePostPublic(feedback)} className="btn btn-emerald btn-sm w-full">Post Publicly</button>
//             </div>
//              <div className="mt-4">
//             <button onClick={()=>handleFeedback(feedback)} className="btn btn-emerald btn-sm w-full">Get Feedback</button>
//         </div>
 
//     {/* </div> */}
//     </div> 
//   }

import { useLayoutEffect, useState } from "react";

export default function FeedbackDialog({
  page,
  isFeedback,
  handleChange,
  handlePostPublic,
  handleFeedback,
}) {
  const [feedback, setFeedback] = useState(
    !page || isFeedback ? "" : page.description
  );

  useLayoutEffect(() => {
    handleChange(feedback);
  }, [feedback]);

  const updateFeedback = (value) => {
    setFeedback(value);
    handleChange(value);
  };

  return (
    <div className="w-full">
      {/* ------------------------------------------------------------------
          Writing
      ------------------------------------------------------------------ */}

      <div className="px-1">
        <textarea
          value={feedback}
          onChange={(e) => updateFeedback(e.target.value)}
          placeholder="Say something about what you're sharing..."
          className="
            textarea
            min-h-[9rem]
            w-[100%]
            resize-none
            rounded-2xl
            border
            border-earth/70
            bg-base-bg
            p-4
            text-base
            leading-7
            text-text-primary
            outline-none
            transition
            placeholder:text-text-secondary/60
            focus:border-emerald-600
            focus:ring-1
            focus:ring-emerald-600
            dark:border-earth/40
            dark:bg-base-bgDark
            dark:text-cream
          "
        />
      </div>

      {/* ------------------------------------------------------------------
          Choice
      ------------------------------------------------------------------ */}

      <div className="mt-8 px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
          Where should this go?
        </p>

        <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-emerald-100/60">
          You can share it publicly, or invite other writers to respond first.
        </p>
      </div>

      {/* ------------------------------------------------------------------
          Get Feedback
      ------------------------------------------------------------------ */}

      <button
        type="button"
        onClick={() => handleFeedback(feedback)}
        className="
          mt-5
          w-full
          rounded-2xl
          border-2
          border-emerald-600
          bg-emerald-600
          px-5
          py-4
          text-left
          transition-all
          duration-200
          hover:bg-emerald-700
          active:scale-[0.99]
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-base font-semibold text-white">
              Get Feedback
            </div>

            <div className="mt-1 text-sm leading-5 text-emerald-50/90">
          Bring this piece into a small workshop with other writers.
            </div>
          </div>

          <span className="shrink-0 text-xl text-white">
            →
          </span>
        </div>
      </button>

      {/* ------------------------------------------------------------------
          Public
      ------------------------------------------------------------------ */}

      <button
        type="button"
        onClick={() => handlePostPublic(feedback)}
        className="
          mt-3
          w-full
          rounded-2xl
          border
          border-earth/70
          bg-transparent
          px-5
          py-4
          text-left
          transition-all
          duration-200
          hover:border-emerald-600
          hover:bg-base-soft/50
          active:scale-[0.99]
          dark:border-earth/40
          dark:hover:bg-base-bgDark
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-base font-medium text-text-primary dark:text-cream">
              Post Publicly
            </div>

            <div className="mt-1 text-sm leading-5 text-text-secondary dark:text-emerald-100/60">
      Share this piece with the wider Plumbum community.
            </div>
          </div>

          <span className="shrink-0 text-lg text-text-secondary">
            →
          </span>
        </div>
      </button>
    </div>
  );
}

