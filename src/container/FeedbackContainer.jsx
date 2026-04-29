// import { useContext, useLayoutEffect, useState, useCallback } from "react";
// import authRepo from "../data/authRepo";
// import validateEmail from "../core/validateEmail";
// import Context from "../context";
// import { IonContent, IonText } from "@ionic/react";
// import { useDialog } from "../domain/usecases/useDialog";
// import Enviroment from "../core/Enviroment";

// export default function FeedbackContainer() {
//   const { seo, setSeo } = useContext(Context);
//   const { openDialog, closeDialog, dialog } = useDialog();

//   const [form, setForm] = useState({
//     preferredName: "",
//     email: "",
//     subject: "",
//     purpose: "feedback",
//     message: "",
//   });

//   useLayoutEffect(() => {
//     setSeo((prev) => ({
//       ...prev,
//       title: "Plumbum | Feedback",
//       description: "Send feedback, report issues, or collaborate with Plumbum.",
//     }));
//   }, [setSeo]);

//   const updateField = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const isValid = validateEmail(form.email);

//   const openMessageSentDialog = ({ success = true, message = "" }) => {
//     const title = success ? "Message Sent" : "Submission Failed";
//     const body = success
//       ? `Thanks for your ${form.purpose}. We’ll respond if relevant.`
//       : message || "Something went wrong. Please try again.";

//     openDialog({
//       ...dialog,
//       isOpen: true,
//       title: null,
//       text: (
//         <div className="bg-base-bg rounded-2xl px-8 py-10 text-center max-w-sm mx-auto">
//           <h2 className="text-xl font-semibold text-gray-900 mb-3">
//             {title}
//           </h2>
//           <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
//         </div>
//       ),
//       agree:null,
//       onClose: closeDialog,
//       agreeText: null,
//       disagreeText: null,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isValid) {
//       openMessageSentDialog({
//         success: false,
//         message: "Please enter a valid email address.",
//       });
//       return;
//     }

//     try {
//       await authRepo.feedback(form);

//       openMessageSentDialog({ success: true });

//       setForm({
//         preferredName: "",
//         email: "",
//         subject: "",
//         purpose: "feedback",
//         message: "",
//       });
//     } catch (err) {
//       openMessageSentDialog({ success: false });
//     }
//   };

//   return (
//     <IonContent fullscreen style={{backgroundColor:Enviroment.palette.cream}}>
//       <div className="bg-cream pb-24">
//       <form onSubmit={handleSubmit} style={{backgroundColor:Enviroment.palette.cream}}className="max-w-xl bg-cream mx-auto py-6 px-2">
// <div className="bg-cream">
//         {/* Title */}
//         <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
//           Feedback
//         </h1>

//         {/* Form Card */}
//         <div className="rounded-2xl shadow-sm p-5 flex flex-col gap-5">

//           {/* Name */}
//           <div className="flex flex-col"> 
//             <label className="text-sm text-gray-500">
//               Name
//             </label>
//             <input
//               type="text"
//               value={form.preferredName}
//               onChange={(e) =>
//                 updateField("preferredName", e.target.value)
//               }
//               className="w-full mt-1 px-3 py-3 rounded-xl bg-sky-100 text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>

//           {/* Email */}
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-500">
//               Email
//             </label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) =>
//                 updateField("email", e.target.value)
//               }
//               className="w-full mt-1 px-3 py-3 rounded-xl bg-sky-100 text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>

//           {/* Purpose */}
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-500">
//               Purpose
//             </label>
//             <select
//               value={form.purpose}
//               onChange={(e) =>
//                 updateField("purpose", e.target.value)
//               }
//               className="w-full mt-1 px-3 py-3 rounded-xl bg-sky-100 text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500"
//             >
//               <option value="feedback">Feedback</option>
//               <option value="bug">Issue / Bug</option>
//               <option value="request">Feature Request</option>
//               <option value="encouragement">Encouragement</option>
//               <option value="collab">Collaboration / Media</option>
//             </select>
//           </div>

//           {/* Subject */}
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-500">
//               Subject
//             </label>
//             <input
//               type="text"
//               value={form.subject}
//               onChange={(e) =>
//                 updateField("subject", e.target.value)
//               }
//               className="w-full mt-1 px-3 py-3 rounded-xl bg-sky-100 text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>

//           {/* Message */}
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-500">
//               Message
//             </label>
//             <textarea
//               value={form.message}
//               onChange={(e) =>
//                 updateField("message", e.target.value)
//               }
//               rows={5}
//               className="w-full mt-1 px-3 py-3 rounded-xl bg-sky-100 text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={!isValid}
//           className={`w-full mt-6 h-12 rounded-xl text-white font-medium transition
//             ${
//               isValid
//                 ? "bg-emerald-600 active:scale-[0.98]"
//                 : "bg-gray-300 cursor-not-allowed"
//             }`}
//         >
//           Send
//         </button>
//         </div>
//       </form>
//       </div>
//     </IonContent>
//   );
// }
import { useContext, useLayoutEffect, useState } from "react";
import authRepo from "../data/authRepo";
import validateEmail from "../core/validateEmail";
import Context from "../context";
import { IonContent } from "@ionic/react";
import { useDialog } from "../domain/usecases/useDialog";

// ── Layout ───────────────────────────────────────────
const WRAP  = "max-w-xl mx-auto py-6 px-4 pb-24";
const CARD  = "rounded-2xl p-5 flex flex-col gap-5";

// ── Field styles ─────────────────────────────────────
const LABEL = "text-sm text-soft dark:text-cream/60 mb-1";
const INPUT = "w-full mt-1 px-4 py-3 rounded-xl text-sm text-soft dark:text-cream bg-sky-50 dark:bg-base-surfaceDark outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 placeholder-gray-400 dark:placeholder-gray-500";

export default function FeedbackContainer() {
  const { setSeo } = useContext(Context);
  const { openDialog, closeDialog, dialog } = useDialog();

  const [form, setForm] = useState({
    preferredName: "",
    email:         "",
    subject:       "",
    purpose:       "feedback",
    message:       "",
  });

  useLayoutEffect(() => {
    setSeo((prev) => ({
      ...prev,
      title:       "Plumbum | Feedback",
      description: "Send feedback, report issues, or collaborate with Plumbum.",
    }));
  }, [setSeo]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const isValid = validateEmail(form.email);

  const openMessageSentDialog = ({ success = true, message = "" }) => {
    openDialog({
      ...dialog,
      isOpen:      true,
      title:       null,
      agree:       null,
      agreeText:   null,
      disagreeText: null,
      text: (
        <div className="px-8 py-10 text-center max-w-sm mx-auto">
          <h2 className="text-xl font-semibold text-soft dark:text-cream mb-3">
            {success ? "Message Sent" : "Submission Failed"}
          </h2>
          <p className="text-soft dark:text-cream/60 text-sm leading-relaxed">
            {success
              ? `Thanks for your ${form.purpose}. We'll respond if relevant.`
              : message || "Something went wrong. Please try again."}
          </p>
        </div>
      ),
      onClose: closeDialog,
    });
  };

  const handleSubmit = async () => {
    if (!isValid) {
      openMessageSentDialog({ success: false, message: "Please enter a valid email address." });
      return;
    }
    try {
      await authRepo.feedback(form);
      openMessageSentDialog({ success: true });
      setForm({ preferredName: "", email: "", subject: "", purpose: "feedback", message: "" });
    } catch {
      openMessageSentDialog({ success: false });
    }
  };

  return (
    <IonContent className=" page-content "fullscreen>
      <div className="min-h-full  pb-24">
        <div className={WRAP}>

          <h1 className="text-2xl font-semibold text-soft dark:text-cream mb-8 text-center">
            Feedback
          </h1>

          <div className={CARD}>

            {/* Name */}
            <div className="flex flex-col">
              <label className={LABEL}>Name</label>
              <input
                type="text"
                value={form.preferredName}
                onChange={(e) => updateField("preferredName", e.target.value)}
                placeholder="Your name"
                className={INPUT}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className={LABEL}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="example@email.com"
                className={INPUT}
              />
            </div>

            {/* Purpose */}
            <div className="flex flex-col">
              <label className={LABEL}>Purpose</label>
              <select
                value={form.purpose}
                onChange={(e) => updateField("purpose", e.target.value)}
                className={INPUT}
              >
                <option value="feedback">Feedback</option>
                <option value="bug">Issue / Bug</option>
                <option value="request">Feature Request</option>
                <option value="encouragement">Encouragement</option>
                <option value="collab">Collaboration / Media</option>
              </select>
            </div>

            {/* Subject */}
            <div className="flex flex-col">
              <label className={LABEL}>Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                placeholder="Brief subject"
                className={INPUT}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <label className={LABEL}>Message</label>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={5}
                placeholder="Write your message..."
                className={`${INPUT} resize-none`}
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full mt-6 h-12 rounded-xl text-white font-medium transition active:scale-[0.98]
              ${isValid
                ? "bg-emerald-600 dark:bg-emerald-500"
                : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              }`}
          >
            Send
          </button>

        </div>
      </div>
    </IonContent>
  );
}