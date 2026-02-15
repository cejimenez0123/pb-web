import { useContext, useLayoutEffect, useState, useCallback } from "react";
import authRepo from "../data/authRepo";
import validateEmail from "../core/validateEmail";
import Context from "../context";
import { IonContent, IonText } from "@ionic/react";
import { useDialog } from "../domain/usecases/useDialog";

export default function FeedbackContainer() {
  const { seo, setSeo } = useContext(Context);
  const { openDialog, closeDialog ,dialog} = useDialog();

  // ✅ Single Source of Truth
  const [form, setForm] = useState({
    preferredName: "",
    email: "",
    subject: "",
    purpose: "feedback",
    message: "",
  });

  // ✅ Proper SEO update
  useLayoutEffect(() => {
    setSeo(prev => ({
      ...prev,
      title: "Plumbum | Feedback - Your Writing, Your Community",
      description:
        "Send feedback, report issues, or collaborate with Plumbum.",
    }));
  }, [setSeo]);

  const updateField = (field,value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

const openMessageSentDialog = ({ success = true, message = "" }) => {
  const title = success ? "Message Sent" : "Submission Failed";
  const mainColor = success ? "emerald" : "red";
  const defaultMessage = success
    ? `Thank you for your ${form.purpose.toLowerCase()}. We’ll respond if it’s relevant.`
    : message || "Oops! Something went wrong. Please try again later.";

  let dia = { ...dialog };
  dia.isOpen = true;
  dia.title = null
  dia.text = (
    <div
      className={`bg-white rounded-2xl shadow-xl px-8 py-10 text-center max-w-md mx-auto`}
    >
      {/* Title */}
      <h2 className={`lora-bold text-2xl text-${mainColor}-700 mb-4`}>
        {title}
      </h2>

      {/* Body */}
      <p className={`open-sans-medium text-${mainColor}-800 text-lg leading-relaxed`}>
        {defaultMessage}
      </p>

      {/* Divider */}
      <div className={`w-12 h-[2px] bg-${mainColor}-200 mx-auto my-6 rounded-full`} />

      {/* Signature */}
      <p className={`text-${mainColor}-600 mont-medium`}>— Plumbum</p>
    </div>
  );

  dia.onClose = () => closeDialog();
  dia.disagreeText = null;
  dia.agreeText = null;
  dia.agree = null;

  openDialog(dia);
};


const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate email first
  if (!validateEmail(form.email)) {
    openMessageSentDialog({
      success: false,
      message: "Please enter a valid email address.",
    });
    return;
  }

  try {
    await authRepo.feedback(form);

    // Success dialog
    openMessageSentDialog({
      success: true,
      message: `Thank you for sending your ${form.purpose.toLowerCase()}. We will respond if relevant.`,
    });

    // Reset form
    setForm({
      preferredName: "",
      email: "",
      subject: "",
      purpose: "feedback",
      message: "",
    });
  } catch (err) {
    console.error(err);

    // Error dialog
    openMessageSentDialog({
      success: false,
      message:
        "Oops! Something went wrong while sending your feedback. Please try again later.",
    });
  }
};

  const input =
    "w-[80%] rounded-full open-sans-medium bg-transparent text-emerald-800 mx-3";

  const isValid = validateEmail(form.email);

  return (
    <IonContent fullscreen className="ion-padding">
      <form onSubmit={handleSubmit} className="my-8 px-4">
        <div className="card sm:max-w-[40rem] mx-auto lg:p-8">

          <h2 className="mx-auto lora-bold text-[2em] mb-8 text-emerald-800">
            Feedback
          </h2>

          {/* Name */}
          <label className="border-2 flex rounded-full text-xl h-[3rem] text-emerald-800 border-emerald-800 mb-4 px-4">
            <span className="my-auto">Name:</span>
            <input
              type="text"
              value={form.preferredName}
              onChange={(e) => updateField("preferredName", e.target.value)}
              className={input}
            />
          </label>

          {/* Email */}
          <label className="border-2 flex rounded-full text-xl h-[3rem] text-emerald-800 border-emerald-800 mb-4 px-4">
            <span className="my-auto">Email:</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={input}
            />
          </label>

          {/* Purpose */}
          <label className="border-2 flex rounded-full text-xl  text-emerald-800 border-emerald-800 mb-4 px-4">
            <span className="my-auto">Purpose:</span>
            <select
              value={form.purpose}
              onChange={(e) => updateField("purpose", e.target.value)}
              className="w-[80%] bg-transparent h-[3rem] text-emerald-800 "
            >
              <option value="feedback">Feedback</option>
              <option value="bug">Issue/Bug</option>
              <option value="request">Feature Request</option>
              <option value="encouragement">Encouragement</option>
              <option value="collab">Collaboration/Media</option>
            </select>
          </label>

          {/* Subject */}
          <label className="border-2 flex rounded-full text-xl h-[3rem] text-emerald-800 border-emerald-800 mb-4 px-4">
            <span className="my-auto">Subject:</span>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              className={input}
            />
          </label>

          {/* Message */}
          <label className="open-sans-medium text-emerald-800">
            Message:
          </label>
          <textarea
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="textarea bg-transparent mt-4 text-emerald-800 border-2 border-emerald-800 w-full"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full rounded-full py-3 text-white mt-12 text-xl transition-all
              ${
                isValid
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                  : "bg-slate-400 cursor-not-allowed"
              }`}
          >
            Send
          </button>

        </div>
      </form>
    </IonContent>
    
  );
}
