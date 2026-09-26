
// import { Preferences } from '@capacitor/preferences';
// import { IonContent, IonText, IonLabel } from '@ionic/react';
// import "../App.css";
// import { useState, useEffect, useRef } from 'react';
// import authRepo from '../data/authRepo';
// import ThankYou from './auth/ThankYou';
// import logo from "../images/logo/icon.png";
// import { useSelector } from 'react-redux';
// import { useIonRouter } from '@ionic/react';
// import Paths from '../core/paths';

// /* === TOKENS === */
// const primaryButton = "w-full bg-emerald-700 text-white rounded-full py-3 font-semibold active:scale-[0.98] transition text-[1rem]";
// const secondaryButton = "w-full bg-transparent text-emerald-700 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-600 rounded-full py-3 font-semibold text-[1rem]";
// const questionClass = "text-emerald-900 dark:text-cream text-sm font-semibold mont-medium mb-1";
// const inputClass = "w-full rounded-2xl px-4 py-3 text-[1.05rem] outline-none bg-white/70 dark:bg-white/10 text-emerald-900 dark:text-cream placeholder-emerald-300 dark:placeholder-emerald-600 mt-1 border border-emerald-100 dark:border-emerald-800";
// const cardClass = "border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex flex-col gap-2 bg-white/60 dark:bg-white/5";
// const pageClass = "px-4 py-8 space-y-5 min-h-screen";
// const headingClass = "lora-medium text-2xl font-bold text-emerald-900 dark:text-cream block mb-4";

// /* === ANIMATION === */
// function StepTransition({ step, children }) {
//   return (
//     <div key={step} style={{ animation: "fadeSlide 0.35s ease-out" }}>
//       {children}
//       <style>{`
//         @keyframes fadeSlide {
//           from { opacity: 0; transform: translateY(12px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

// /* === PROGRESS DOTS === */
// function ProgressDots({ activeTab }) {
//   const tabs = ["tab1", "tab2", "tab3", "tab4"];
//   return (
//     <div className="flex justify-center gap-2 pt-6 pb-2">
//       {tabs.map(t => (
//         <div
//           key={t}
//           className={`rounded-full transition-all duration-300 ${
//             activeTab === t ? "w-6 h-3 bg-emerald-600" : "w-3 h-3 bg-emerald-200 dark:bg-emerald-800"
//           }`}
//         />
//       ))}
//     </div>
//   );
// }

// /* === NAV BUTTONS === */
// function NavButtons({ onBack, onNext, nextLabel = "Continue", loading = false }) {
//   return (
//     <div className="flex gap-3 pt-2">
//       {onBack && <button className={secondaryButton} onClick={onBack}>Back</button>}
//       <button className={primaryButton} onClick={onNext} disabled={loading}>
//         {loading ? "Submitting..." : nextLabel}
//       </button>
//     </div>
//   );
// }

// /* === WHY === */
// function Why({ setActiveTab, onLogin }) {
//   return (
//     <StepTransition step="tab0">
//       <div className="p-6 text-center space-y-6">
//         <img src={logo} className="w-24 mx-auto" alt="Plumbum" />
//         <IonText className="lora-medium block text-left text-emerald-900 dark:text-cream">
//           <h2 className="text-2xl font-bold mb-3">What is Plumbum?</h2>
//           <ul className="list-disc pl-5 space-y-2 text-[0.95rem]">
//             <li><strong>Writer-Focused:</strong> A space to grow, get feedback, and share — all in one place.</li>
//             <li><strong>Community First:</strong> Built from live workshops and honest conversations, not algorithms.</li>
//             <li><strong>Hybrid by Design:</strong> Feedback, self-promotion, and curation — because writers need all three.</li>
//           </ul>
//           <h2 className="text-2xl font-bold mt-6 mb-3">Why Join?</h2>
//           <ul className="list-disc pl-5 space-y-2 text-[0.95rem]">
//             <li><strong>Real Feedback:</strong> From people who care about craft, not clout.</li>
//             <li><strong>Creative Momentum:</strong> Events, prompts, and people who show up.</li>
//             <li><strong>Supportive Culture:</strong> Built slow and small on purpose.</li>
//           </ul>
//         </IonText>
//         <button className={primaryButton} onClick={() => setActiveTab("tab1")}>
//           Join Plumbum
//         </button>
//         <div className="text-emerald-700 dark:text-emerald-300 text-sm underline cursor-pointer" onClick={onLogin}>
//           Already have an account? Log in
//         </div>
//       </div>
//     </StepTransition>
//   );
// }

// /* === STEP 1 === */
// function Step1({ formData, updateFormData, setActiveTab, error, setError }) {
//   const [local, setLocal] = useState(formData);
//   const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const next = () => {
//     // if (!validateEmail(local.email)) { setError("Enter a valid email"); return; }
//     setError("");
//     updateFormData(local);
//     setActiveTab("tab2");
//   };

//   return (
//     <StepTransition step="tab1">
//       <div className={pageClass}>
//         <IonLabel className={headingClass}>Interest Form</IonLabel>
//         {error && <div className="text-red-500 text-sm">{error}</div>}

//         {[
//           { key: "fullName", label: "Preferred Name", type: "text",  placeholder: "Jane Doe" },
//           { key: "email",    label: "Email *",        type: "email", placeholder: "email@example.com" },
//           { key: "igHandle", label: "Instagram",      type: "text",  placeholder: "@handle" },
//         ].map(({ key, label, type, placeholder }) => (
//           <div key={key} className="w-full flex flex-col">
//             <label className={questionClass}>{label}</label>
//             <input
//               className={inputClass}
//               type={type}
//               value={local[key]}
//               onChange={e => setLocal({ ...local, [key]: e.target.value })}
//               placeholder={placeholder}
//             />
//           </div>
//         ))}

//         <NavButtons onBack={() => setActiveTab("tab0")} onNext={next} />
//       </div>
//     </StepTransition>
//   );
// }

// /* === STEP 2 === */
// function Step2({ formData, updateFormData, setActiveTab }) {
//   const [local, setLocal] = useState(formData);

//   return (
//     <StepTransition step="tab2">
//       <div className={pageClass}>
//         <IonLabel className={headingClass}>Artist Statement</IonLabel>

//         {[
//           { key: "whyApply",       label: "What's been hardest about writing consistently lately?" },
//           { key: "communityNeeds", label: "What's missing from writing spaces you've tried?" },
//         ].map(({ key, label }) => (
//           <div key={key} className="w-full flex flex-col">
//             <label className={questionClass}>{label}</label>
//             <textarea
//               className={inputClass}
//               rows={3}
//               value={local[key]}
//               onChange={e => setLocal({ ...local, [key]: e.target.value })}
//             />
//           </div>
//         ))}

//         <NavButtons
//           onBack={() => { updateFormData(local); setActiveTab("tab1"); }}
//           onNext={() => { updateFormData(local); setActiveTab("tab3"); }}
//         />
//       </div>
//     </StepTransition>
//   );
// }

// /* === STEP 3 === */
// const EVENTS = ["Open mics","Workshops","Socials","Poetry readings","Art events","Music events","Raves","Other"];

// function Step3({ formData, updateFormData, setActiveTab }) {
//   const [local, setLocal] = useState({
//     selectedEvents: formData.selectedEvents || [],
//     otherEvent: formData.otherEvent || "",
//     writingOutcome: formData.writingOutcome || "",
//   });

//   const toggle = ev => setLocal(prev => ({
//     ...prev,
//     selectedEvents: prev.selectedEvents.includes(ev)
//       ? prev.selectedEvents.filter(x => x !== ev)
//       : [...prev.selectedEvents, ev],
//   }));

//   return (
//     <StepTransition step="tab3">
//       <div className={pageClass}>
//         <IonLabel className={headingClass}>Your Scene</IonLabel>

//         <div className={cardClass}>
//           <label className={questionClass}>What kinds of events do you go to?</label>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {EVENTS.map(ev => (
//               <div
//                 key={ev}
//                 onClick={() => toggle(ev)}
//                 className={`px-4 py-2 rounded-full border cursor-pointer transition select-none text-sm font-medium ${
//                   local.selectedEvents.includes(ev)
//                     ? "bg-emerald-600 text-white border-emerald-600"
//                     : "bg-transparent text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900"
//                 }`}
//               >
//                 {ev}
//               </div>
//             ))}
//           </div>
//         </div>

//         {local.selectedEvents.includes("Other") && (
//           <div className="w-full flex flex-col">
//             <label className={questionClass}>What other events?</label>
//             <input
//               className={inputClass}
//               value={local.otherEvent}
//               onChange={e => setLocal(prev => ({ ...prev, otherEvent: e.target.value }))}
//               placeholder="Describe it..."
//             />
//           </div>
//         )}

//         {/* Moved here — separate from Step4's writingOutcome */}
//         <div className="w-full flex flex-col">
//           <label className={questionClass}>When you share your writing, what usually happens?</label>
//           <textarea
//             className={inputClass}
//             rows={3}
//             value={local.writingOutcome}
//             onChange={e => setLocal({ ...local, writingOutcome: e.target.value })}
//           />
//         </div>

//         <NavButtons
//           onBack={() => { updateFormData(local); setActiveTab("tab2"); }}
//           onNext={() => { updateFormData(local); setActiveTab("tab4"); }}
//         />
//       </div>
//     </StepTransition>
//   );
// }

// /* === STEP 4 === */
// function Step4({ formData, onClickApply, setActiveTab, loading, error }) {
//   const [local, setLocal] = useState({
//     eventPain:  formData.eventPain  || "",
//     howFindOut: formData.howFindOut || "",
//     writingHope: formData.writingHope || "",
//   });

//   const submit = () => onClickApply({ ...formData, ...local });

//   return (
//     <StepTransition step="tab4">
//       <div className={pageClass}>
//         <IonLabel className={headingClass}>Last Few Things</IonLabel>

//         {[
//           { key: "writingHope", label: "What do you hope will change in your writing life?",  placeholder: "e.g. consistency, confidence, community..." },
//           { key: "eventPain",   label: "What makes you stay or leave writing events?",         placeholder: "e.g. vibe, structure, feedback quality..." },
//           { key: "howFindOut",  label: "How did you find Plumbum?",                            placeholder: "Instagram, friend, workshop..." },
//         ].map(({ key, label, placeholder }) => (
//           <div key={key} className="w-full flex flex-col">
//             <label className={questionClass}>{label}</label>
//             <textarea
//               className={inputClass}
//               rows={3}
//               placeholder={placeholder}
//               value={local[key]}
//               onChange={e => setLocal({ ...local, [key]: e.target.value })}
//             />
//           </div>
//         ))}

//         {error && <div className="text-red-500 text-sm text-center">{error}</div>}

//         <NavButtons
//           onBack={() => setActiveTab("tab3")}
//           onNext={submit}
//           nextLabel="Apply"
//           loading={loading}
//         />
//       </div>
//     </StepTransition>
//   );
// }

// /* === MAIN === */
// export default function OnboardingContainer() {
//   const router = useIonRouter();
//   const currentProfile = useSelector(s => s.users.currentProfile);

//   const contentRef = useRef(null);
//   const [activeTab, setActiveTab] = useState("tab0");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     fullName: "", email: "", igHandle: "",
//     whyApply: "", communityNeeds: "",
//     writingOutcome: "", writingHope: "",
//     selectedEvents: [], otherEvent: "",
//     eventPain: "", howFindOut: "",
//   });

//   useEffect(() => {
//     if (currentProfile?.id) router.push(Paths.home, "root");
//   }, [currentProfile, router]);

//   useEffect(() => {
//     contentRef.current?.scrollToTop(0);
//   }, [activeTab]);

//   const updateFormData = data => setFormData(prev => ({ ...prev, ...data }));

//   const onClickApply = async (overrideForm = formData) => {
//     if (loading) return;
//     try {
//       setLoading(true);
//       setError("");
//       const data = await authRepo.apply({
//         ...overrideForm,
//         email: overrideForm.email?.toLowerCase(),
//       });
//       await Preferences.set({ key: "hasSeenOnboarding", value: "true" });
//       setUser(data?.user ?? data);
//     } catch (err) {
//       if(err.status){
//           setError(err.message? err.message :"You may have applied already. Give more time for a response")
//       }else{
//       setError(err?.message || "Something went wrong");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (user) {
//     return (
//        <IonContent className="page-content" style={{ "--padding-bottom": "10rem" }} fullscreen>
//       <ThankYou user={user} />
//       </IonContent>
//     );
//   }

//   return (
//     <IonContent ref={contentRef} className="page-content" style={{ "--padding-bottom": "10rem" }} fullscreen>
//       <div className="max-w-xl py-4 mx-auto">
//         {activeTab !== "tab0" && <ProgressDots activeTab={activeTab} />}

//         {activeTab === "tab0" && <Why setActiveTab={setActiveTab} onLogin={() => router.push(Paths.login)} />}
//         {activeTab === "tab1" && <Step1 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} error={error} setError={setError} />}
//         {activeTab === "tab2" && <Step2 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} />}
//         {activeTab === "tab3" && <Step3 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} />}
//         {activeTab === "tab4" && <Step4 formData={formData} onClickApply={onClickApply} setActiveTab={setActiveTab} loading={loading} error={error} />}
//       </div>
//     </IonContent>
//   );
// }
import { Preferences } from "@capacitor/preferences";
import { IonContent, IonLabel } from "@ionic/react";
import "../App.css";
import { useState, useEffect, useRef } from "react";
import authRepo from "../data/authRepo";
import ThankYou from "./auth/ThankYou";
import logo from "../images/logo/icon.png";
import { useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";
import Paths from "../core/paths";

/* =========================================================
   DESIGN TOKENS
   ========================================================= */

const colors = {
  ink: "text-emerald-950",
  muted: "text-emerald-700",
  mint: "bg-emerald-500",
  mintDark: "bg-emerald-700",
};

const primaryButton =
  "w-full bg-emerald-700 text-white rounded-full py-3.5 px-5 font-semibold text-[1rem] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-emerald-800";

const secondaryButton =
  "w-full bg-white/50 text-emerald-800 border border-emerald-200 rounded-full py-3.5 px-5 font-semibold text-[1rem] transition-all duration-200 active:scale-[0.98] hover:bg-emerald-50";

const inputClass =
  "w-[100%] rounded-2xl px-4 py-3.5 text-[1rem] outline-none bg-white/80 text-emerald-950 placeholder-emerald-300 border border-emerald-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition";

const textareaClass =
  "w-[100%] rounded-2xl px-4 py-3.5 text-[1rem] leading-relaxed outline-none bg-white/80 text-emerald-950 placeholder-emerald-300 border border-emerald-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition resize-none";

const questionClass =
  "text-emerald-950 text-[0.95rem] font-semibold mont-medium leading-snug";

const helperClass =
  "text-emerald-600 text-[0.82rem] leading-relaxed mt-1";

const pageClass =
  "px-5 pt-5 pb-10 min-h-full flex flex-col";

const headingClass =
  "lora-medium text-[1.8rem] leading-tight font-bold text-emerald-950";

const sectionCard =
  "rounded-[1.5rem] bg-white/55 border border-emerald-100 p-4";

/* =========================================================
   OPTIONS
   ========================================================= */

const WRITING_BARRIERS = [
  "Time",
  "Energy",
  "Motivation",
  "Finding a place to write",
  "Knowing what to write",
  "Finishing what I start",
  "Getting feedback",
  "Finding people to write with",
  "Confidence",
  "Other",
  "Nothing in particular",
];

const SHARING_REASONS = [
  "I want feedback",
  "I want to start a conversation",
  "I want to connect with other people",
  "I want accountability",
  "I'm proud of the work",
  "I want to know whether it's ready",
  "I want to hear how someone else experiences it",
  "I want to publish or promote it",
  "Someone invited or encouraged me to share",
  "I feel comfortable sharing it",
  "There's an opportunity to share",
  "It depends on what I need",
  "Other",
  "I don't usually share my writing",
];

const SHARING_WAYS = [
  "One person I trust",
  "A small group",
  "A workshop or writing group",
  "An event, reading, or open mic",
  "An online community",
  "Social media",
  "Publicly / through publication",
  "Other",
  "I don't usually share my writing",
];

const SHARING_OUTCOMES = [
  "Someone responded",
  "I received useful feedback",
  "It led to a conversation",
  "I felt exposed or vulnerable",
  "Nothing really happened",
  "I wanted more interaction",
  "I realized I wanted to keep the work private",
  "Sharing led me somewhere else",
  "Other",
];

const COMMUNITY_OPTIONS = [
  "I like being around people often",
  "I like participating sometimes, but need plenty of space",
  "I prefer smaller or quieter interactions",
  "I mostly want to create on my own, but still want access to community",
  "I like being part of things without always participating",
  "It depends on what I need that day",
  "I'm not sure yet",
];

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function StepTransition({ step, children }) {
  return (
    <div
      key={step}
      style={{
        animation: "fadeSlide 0.32s ease-out",
      }}
    >
      {children}

      <style>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function Progress({ step }) {
  const total = 4;

  return (
    <div className="px-5 pt-4 pb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
          {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        <span className="text-xs text-emerald-500">
          {Math.round((step / total) * 100)}%
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-emerald-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{
            width: `${(step / total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

function OptionChips({
  options,
  selected = [],
  onToggle,
  disabled = false,
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((option) => {
        const active = selected.includes(option);

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(option)}
            aria-pressed={active}
            className={`
              text-left px-3.5 py-2.5 rounded-full border text-sm font-medium
              transition-all duration-200 active:scale-[0.97]
              disabled:opacity-50
              ${
                active
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white/55 text-emerald-800 border-emerald-200 hover:bg-emerald-50"
              }
            `}
          >
            {active && <span className="mr-1.5">✓</span>}
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Question({ label, helper, children }) {
  return (
    <div className="w-full">
      <label className={questionClass}>{label}</label>
      {helper && <div className={helperClass}>{helper}</div>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  loading = false,
}) {
  return (
    <div className="flex gap-3 pt-4 mt-auto">
      {onBack && (
        <button
          type="button"
          className={secondaryButton}
          onClick={onBack}
          disabled={loading}
        >
          Back
        </button>
      )}

      <button
        type="button"
        className={primaryButton}
        onClick={onNext}
        disabled={loading}
      >
        {loading ? "Submitting..." : nextLabel}
      </button>
    </div>
  );
}

/* =========================================================
   INTRO
   ========================================================= */

function Why({ setActiveTab, onLogin }) {
  return (
    <StepTransition step="intro">
      <div className="px-5 pt-10 pb-12 max-w-xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-40" />

            <img
              src={logo}
              className="relative w-24 h-24 rounded-[2rem]"
              alt="Plumbum"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-emerald-600 mb-3">
            Welcome to Plumbum
          </p>

          <h1 className="lora-medium text-[2.4rem] leading-[1.05] font-bold text-emerald-950">
            Make space for your writing.
          </h1>

          <p className="mt-5 text-emerald-700 leading-relaxed text-[1rem]">
            Plumbum is a community for writers to write, share, get feedback,
            and find their people — without having to be everywhere all the
            time.
          </p>
        </div>

        <div className="grid gap-3 mt-8">
          <div className={sectionCard}>
            <div className="text-2xl mb-2">✍🏽</div>
            <h2 className="font-semibold text-emerald-950">
              Write without proving you're a writer.
            </h2>
            <p className="text-sm text-emerald-600 mt-1.5 leading-relaxed">
              Bring the thing you're working on, the thing you keep putting
              off, or the thing you haven't started yet.
            </p>
          </div>

          <div className={sectionCard}>
            <div className="text-2xl mb-2">🌱</div>
            <h2 className="font-semibold text-emerald-950">
              Share when it makes sense.
            </h2>
            <p className="text-sm text-emerald-600 mt-1.5 leading-relaxed">
              Community doesn't have to mean constant participation. Find
              people, feedback, and creative momentum at your own pace.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`${primaryButton} mt-7`}
          onClick={() => setActiveTab("tab1")}
        >
          Join Plumbum
        </button>

        <button
          type="button"
          className="w-full mt-4  mx-4 text-sm text-emerald-700 underline underline-offset-4"
          onClick={onLogin}
        >
          Already have an account? Log in
        </button>
      </div>
    </StepTransition>
  );
}

/* =========================================================
   STEP 1 — ABOUT YOU
   ========================================================= */

function Step1({
  formData,
  updateFormData,
  setActiveTab,
  error,
  setError,
}) {
  const [local, setLocal] = useState(formData);

  const next = () => {
    if (!local.fullName?.trim()) {
      setError("Tell us what name you'd like us to use.");
      return;
    }

    if (!local.email?.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(local.email.trim())) {
      setError("Please enter a valid email.");
      return;
    }

    setError("");
    updateFormData(local);
    setActiveTab("tab2");
  };

  return (
    <StepTransition step="tab1">
      <div className={pageClass}>
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-600 mb-2">
            About you
          </p>

          <h1 className={headingClass}>
            Let's start with the basics.
          </h1>

          <p className="text-emerald-600 mt-2 leading-relaxed text-sm">
            Nothing to prove here.
          </p>
        </div>

        <div className="space-y-5">
          <Question label="What name do you want us to use?">
            <input
              className={inputClass}
              type="text"
              value={local.fullName || ""}
              onChange={(e) =>
                setLocal({
                  ...local,
                  fullName: e.target.value,
                })
              }
              placeholder="Your name"
              autoComplete="name"
            />
          </Question>

          <Question label="What's your email?">
            <input
              className={inputClass}
              type="email"
              value={local.email || ""}
              onChange={(e) =>
                setLocal({
                  ...local,
                  email: e.target.value,
                })
              }
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Question>

          <Question
            label="Instagram"
            helper="Optional"
          >
            <input
              className={inputClass}
              type="text"
              value={local.igHandle || ""}
              onChange={(e) =>
                setLocal({
                  ...local,
                  igHandle: e.target.value,
                })
              }
              placeholder="@handle"
              autoComplete="off"
            />
          </Question>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <NavButtons
          onBack={() => setActiveTab("tab0")}
          onNext={next}
        />
      </div>
    </StepTransition>
  );
}

/* =========================================================
   STEP 2 — WRITING
   ========================================================= */

// function Step2({
//   formData,
//   updateFormData,
//   setActiveTab,
// }) {
//   const [local, setLocal] = useState({
//     writingNow: formData.writingNow || "",
//     writingBarriers: formData.writingBarriers || [],
//   });

//   const toggleBarrier = (option) => {
//     setLocal((prev) => {
//       const current = prev.writingBarriers || [];

//       return {
//         ...prev,
//         writingBarriers: current.includes(option)
//           ? current.filter((item) => item !== option)
//           : [...current, option],
//       };
//     });
//   };

//   const next = () => {
//     updateFormData(local);
//     setActiveTab("tab3");
//   };

//   return (
//     <StepTransition step="tab2">
//       <div className={pageClass}>
//         <div className="mb-7">
//           <p className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-600 mb-2">
//             Your writing
//           </p>

//           <h1 className={headingClass}>
//             What's on the page?
//           </h1>

//           <p className="text-emerald-600 mt-2 leading-relaxed text-sm">
//             Wherever you are with it is fine.
//           </p>
//         </div>

//         <div className="space-y-7">
//           <Question label="What are you writing these days?">
//             <textarea
//               className={textareaClass}
//               rows={4}
//               value={local.writingNow}
//               onChange={(e) =>
//                 setLocal({
//                   ...local,
//                   writingNow: e.target.value,
//                 })
//               }
//               placeholder="A novel, poems, essays, a screenplay, something you haven't named yet..."
//             />
//           </Question>

//           <Question label="What's been getting in the way of writing lately?">
//             <OptionChips
//               options={WRITING_BARRIERS}
//               selected={local.writingBarriers}
//               onToggle={toggleBarrier}
//             />
//           </Question>
//         </div>

//         <NavButtons
//           onBack={() => {
//             updateFormData(local);
//             setActiveTab("tab1");
//           }}
//           onNext={next}
//         />
//       </div>
//     </StepTransition>
//   );
// }
function Step2({
  formData,
  updateFormData,
  setActiveTab,
}) {
  const [local, setLocal] = useState({
    writingNow: formData.writingNow || "",
    writingBarriers: formData.writingBarriers || [],
    writingBarriersOther: formData.writingBarriersOther || "",
  });

  const toggleBarrier = (option) => {
    setLocal((prev) => {
      const current = prev.writingBarriers || [];

      return {
        ...prev,
        writingBarriers: current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  };

  const next = () => {
    updateFormData(local);
    setActiveTab("tab3");
  };

  return (
    <StepTransition step="tab2">
      <div className={pageClass}>
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-600 mb-2">
            Your writing
          </p>

          <h1 className={headingClass}>
            What's on the page?
          </h1>

          <p className="text-emerald-600 mt-2 leading-relaxed text-sm">
            Wherever you are with it is fine.
          </p>
        </div>

        <div className="space-y-7">
          <Question label="What are you writing these days?">
            <textarea
              className={textareaClass}
              rows={4}
              value={local.writingNow}
              onChange={(e) =>
                setLocal({
                  ...local,
                  writingNow: e.target.value,
                })
              }
              placeholder="A novel, poems, essays, a screenplay, something you haven't named yet..."
            />
          </Question>

          <Question label="What's been getting in the way of writing lately?">
            <OptionChips
              options={WRITING_BARRIERS}
              selected={local.writingBarriers}
              onToggle={toggleBarrier}
            />

            <OtherInput
              selected={local.writingBarriers}
              value={local.writingBarriersOther}
              onChange={(value) =>
                setLocal({
                  ...local,
                  writingBarriersOther: value,
                })
              }
              placeholder="What else has been getting in the way?"
            />
          </Question>
        </div>

        <NavButtons
          onBack={() => {
            updateFormData(local);
            setActiveTab("tab1");
          }}
          onNext={next}
        />
      </div>
    </StepTransition>
  );
}
/* =========================================================
   STEP 3 — SHARING & COMMUNITY
   ========================================================= */
function Step3({
  formData,
  updateFormData,
  setActiveTab,
}) {
  const [local, setLocal] = useState({
    sharingReasons: formData.sharingReasons || [],
    sharingReasonsOther: formData.sharingReasonsOther || "",

    sharingWays: formData.sharingWays || [],
    sharingWaysOther: formData.sharingWaysOther || "",

    sharingOutcomes: formData.sharingOutcomes || [],
    sharingOutcomesOther: formData.sharingOutcomesOther || "",

    sharingStory: formData.sharingStory || "",
  });

  const toggle = (field, option) => {
    setLocal((prev) => {
      const current = prev[field] || [];

      return {
        ...prev,
        [field]: current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  };

  const next = () => {
    updateFormData(local);
    setActiveTab("tab4");
  };

  return (
    <StepTransition step="tab3">
      <div className={pageClass}>
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-600 mb-2">
            Sharing & community
          </p>

          <h1 className={headingClass}>
            Share on your terms.
          </h1>

          <p className="text-emerald-600 mt-2 leading-relaxed text-sm">
            There's no right amount of participation.
          </p>
        </div>

        <div className="space-y-8">

          <Question
            label="What makes you decide to share something you've written?"
            helper="Select all that apply."
          >
            <OptionChips
              options={SHARING_REASONS}
              selected={local.sharingReasons}
              onToggle={(option) =>
                toggle("sharingReasons", option)
              }
            />

            <OtherInput
              selected={local.sharingReasons}
              value={local.sharingReasonsOther}
              onChange={(value) =>
                setLocal({
                  ...local,
                  sharingReasonsOther: value,
                })
              }
              placeholder="What else makes you want to share?"
            />
          </Question>

          <Question
            label="How do you like to share your writing and participate in creative community?"
            helper="Select all that apply."
          >
            <OptionChips
              options={SHARING_WAYS}
              selected={local.sharingWays}
              onToggle={(option) =>
                toggle("sharingWays", option)
              }
            />

            <OtherInput
              selected={local.sharingWays}
              value={local.sharingWaysOther}
              onChange={(value) =>
                setLocal({
                  ...local,
                  sharingWaysOther: value,
                })
              }
              placeholder="How else do you like to participate?"
            />
          </Question>

          <Question
            label="What happened after you shared it?"
            helper="Select all that apply."
          >
            <OptionChips
              options={SHARING_OUTCOMES}
              selected={local.sharingOutcomes}
              onToggle={(option) =>
                toggle("sharingOutcomes", option)
              }
            />

            <OtherInput
              selected={local.sharingOutcomes}
              value={local.sharingOutcomesOther}
              onChange={(value) =>
                setLocal({
                  ...local,
                  sharingOutcomesOther: value,
                })
              }
              placeholder="What else happened?"
            />
          </Question>

          <Question label="Tell us about a time you shared something you wrote. What made you decide to share it, and what happened afterward?">
            <textarea
              className={textareaClass}
              rows={5}
              value={local.sharingStory}
              onChange={(e) =>
                setLocal({
                  ...local,
                  sharingStory: e.target.value,
                })
              }
              placeholder="Whatever comes to mind..."
            />
          </Question>

        </div>

        <NavButtons
          onBack={() => {
            updateFormData(local);
            setActiveTab("tab2");
          }}
          onNext={next}
        />
      </div>
    </StepTransition>
  );
}
// function Step3({
//   formData,
//   updateFormData,
//   setActiveTab,
// }) {
//   const [local, setLocal] = useState({
//     sharingReasons: formData.sharingReasons || [],
//     sharingWays: formData.sharingWays || [],
//     sharingOutcomes: formData.sharingOutcomes || [],
//     sharingStory: formData.sharingStory || "",
//   });

//   const toggle = (field, option) => {
//     setLocal((prev) => {
//       const current = prev[field] || [];

//       return {
//         ...prev,
//         [field]: current.includes(option)
//           ? current.filter((item) => item !== option)
//           : [...current, option],
//       };
//     });
//   };

//   const next = () => {
//     updateFormData(local);
//     setActiveTab("tab4");
//   };

//   return (
//     <StepTransition step="tab3">
//       <div className={pageClass}>
//         <div className="mb-7">
//           <p className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-600 mb-2">
//             Sharing & community
//           </p>

//           <h1 className={headingClass}>
//             Share on your terms.
//           </h1>

//           <p className="text-emerald-600 mt-2 leading-relaxed text-sm">
//             There's no right amount of participation.
//           </p>
//         </div>

//         <div className="space-y-8">
//           <Question
//             label="What makes you decide to share something you've written?"
//             helper="Select all that apply."
//           >
//             <OptionChips
//               options={SHARING_REASONS}
//               selected={local.sharingReasons}
//               onToggle={(option) =>
//                 toggle("sharingReasons", option)
//               }
//             />
//           </Question>

//           <Question
//             label="How do you like to share your writing and participate in creative community?"
//             helper="Select all that apply."
//           >
//             <OptionChips
//               options={SHARING_WAYS}
//               selected={local.sharingWays}
//               onToggle={(option) =>
//                 toggle("sharingWays", option)
//               }
//             />
//           </Question>

//           <Question
//             label="What happened after you shared it?"
//             helper="Select all that apply."
//           >
//             <OptionChips
//               options={SHARING_OUTCOMES}
//               selected={local.sharingOutcomes}
//               onToggle={(option) =>
//                 toggle("sharingOutcomes", option)
//               }
//             />
//           </Question>

//           <Question label="Tell us about a time you shared something you wrote. What made you decide to share it, and what happened afterward?">
//             <textarea
//               className={textareaClass}
//               rows={5}
//               value={local.sharingStory}
//               onChange={(e) =>
//                 setLocal({
//                   ...local,
//                   sharingStory: e.target.value,
//                 })
//               }
//               placeholder="Whatever comes to mind..."
//             />
//           </Question>
//         </div>

//         <NavButtons
//           onBack={() => {
//             updateFormData(local);
//             setActiveTab("tab2");
//           }}
//           onNext={next}
//         />
//       </div>
//     </StepTransition>
//   );
// }

/* =========================================================
   STEP 4 — PLUMBUM
   ========================================================= */

function Step4({
  formData,
  onClickApply,
  setActiveTab,
  loading,
  error,
}) {
  const [local, setLocal] = useState({
    plumbumHope: formData.plumbumHope || "",
    howFindOut: formData.howFindOut || "",
  });

  const submit = () => {
    onClickApply({
      ...formData,
      ...local,
    });
  };

  return (
    <StepTransition step="tab4">
      <div className={pageClass}>
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-600 mb-2">
            Plumbum
          </p>

          <h1 className={headingClass}>
            What are you looking for?
          </h1>

          <p className="text-emerald-600 mt-2 leading-relaxed text-sm">
            Tell us what would make this community useful to you.
          </p>
        </div>

        <div className="space-y-6">
          <Question label="What are you hoping to find in Plumbum?">
            <textarea
              className={textareaClass}
              rows={5}
              value={local.plumbumHope}
              onChange={(e) =>
                setLocal({
                  ...local,
                  plumbumHope: e.target.value,
                })
              }
              placeholder="People, feedback, a reason to keep writing, somewhere to share..."
            />
          </Question>

          <Question label="How did you find Plumbum?">
            <div className="space-y-2 mt-1">
              {[
                "A friend",
                "Instagram",
                "A Plumbum event",
                "Another writing/creative event",
                "A workshop",
                "Online",
                "Someone told me about it",
                "Other",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setLocal({
                      ...local,
                      howFindOut: option,
                    })
                  }
                  className={`
                    w-full text-left px-4 py-3 rounded-2xl border
                    transition-all duration-200
                    ${
                      local.howFindOut === option
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white/55 text-emerald-800 border-emerald-100 hover:bg-emerald-50"
                    }
                  `}
                >
                  {local.howFindOut === option && (
                    <span className="mr-2">✓</span>
                  )}
                  {option}
                </button>
              ))}
            </div>
          </Question>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <NavButtons
          onBack={() => setActiveTab("tab3")}
          onNext={submit}
          nextLabel="Apply to Plumbum"
          loading={loading}
        />
      </div>
    </StepTransition>
  );
}

/* =========================================================
   MAIN
   ========================================================= */

export default function OnboardingContainer() {
  const router = useIonRouter();
  const currentProfile = useSelector(
    (s) => s.users.currentProfile
  );

  const contentRef = useRef(null);

  const [activeTab, setActiveTab] = useState("tab0");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  igHandle: "",

  writingNow: "",
  writingBarriers: [],
  writingBarriersOther: "",

  sharingReasons: [],
  sharingReasonsOther: "",

  sharingWays: [],
  sharingWaysOther: "",

  sharingOutcomes: [],
  sharingOutcomesOther: "",

  sharingStory: "",

  plumbumHope: "",
  howFindOut: "",

  /* Legacy fields */
  whyApply: "",
  communityNeeds: "",
  writingOutcome: "",
  events: [],
  selectedEvents: [],
  otherEvent: "",
  eventPain: "",
});

  useEffect(() => {
    if (currentProfile?.id) {
      router.push(Paths.home, "root");
    }
  }, [currentProfile, router]);

  useEffect(() => {
    contentRef.current?.scrollToTop(0);
  }, [activeTab]);

  const updateFormData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };
const onClickApply = async (overrideForm = formData) => {
  if (loading) return;

  try {
    setLoading(true);
    setError("");

    const payload = {
      ...overrideForm,

      /*
       * New fields are the source of truth.
       *
       * Legacy aliases allow older backend/template behavior
       * to continue functioning while the system transitions.
       */
      whyApply:
        overrideForm.writingNow ||
        overrideForm.whyApply ||
        "",

      communityNeeds:
        overrideForm.plumbumHope ||
        overrideForm.communityNeeds ||
        "",

      writingOutcome:
        Array.isArray(overrideForm.sharingOutcomes)
          ? overrideForm.sharingOutcomes.join(", ")
          : overrideForm.writingOutcome || "",

      selectedEvents:
        overrideForm.selectedEvents || [],

      events:
        overrideForm.events || [],
    };

    const data = await authRepo.apply({
      ...payload,
      email: payload.email?.trim().toLowerCase(),
    });

    await Preferences.set({
      key: "hasSeenOnboarding",
      value: "true",
    });

    setUser(data?.user ?? data);

  } catch (err) {
    console.error("APPLICATION SUBMISSION ERROR:", err);

    /*
     * We already have an application associated with
     * this email.
     */
    if (
      err?.status === 409 ||
      err?.code === "APPLICATION_ALREADY_EXISTS"
    ) {
      setError(
        "We already have an application from this email."
      );
      return;
    }

    /*
     * Server explicitly provided a useful message.
     */
    if (err?.message) {
      setError(err.message);
      return;
    }

    /*
     * Final fallback.
     */
    setError(
      "We couldn't submit your application right now. Please try again."
    );

  } finally {
    setLoading(false);
  }
};
  // const onClickApply = async (overrideForm = formData) => {
  //   if (loading) return;

  //   try {
  //     setLoading(true);
  //     setError("");

  //     const payload = {
  //       ...overrideForm,

  //       /*
  //        * New fields are the source of truth.
  //        *
  //        * These legacy aliases allow older backend/template
  //        * behavior to continue functioning while the system
  //        * transitions.
  //        */
  //       whyApply:
  //         overrideForm.writingNow ||
  //         overrideForm.whyApply ||
  //         "",

  //       communityNeeds:
  //         overrideForm.plumbumHope ||
  //         overrideForm.communityNeeds ||
  //         "",

  //       writingOutcome:
  //         Array.isArray(overrideForm.sharingOutcomes)
  //           ? overrideForm.sharingOutcomes.join(", ")
  //           : overrideForm.writingOutcome || "",

  //       selectedEvents: overrideForm.selectedEvents || [],
  //       events: overrideForm.events || [],
  //     };

  //     const data = await authRepo.apply({
  //       ...payload,
  //       email: payload.email?.trim().toLowerCase(),
  //     });

  //     await Preferences.set({
  //       key: "hasSeenOnboarding",
  //       value: "true",
  //     });

  //     setUser(data?.user ?? data);
  //   } catch (err) {
  //     if (err.status) {
  //       setError(
  //         err.message ||
  //           "You may have applied already. Give more time for a response."
  //       );
  //     } else {
  //       setError(
  //         err?.message ||
  //           "Something went wrong. Please try again."
  //       );
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (user) {
    return (
      <IonContent
        className="page-content"
        style={{ "--padding-bottom": "10rem" }}
        fullscreen
      >
        <ThankYou user={user} />
      </IonContent>
    );
  }

  return (
    <IonContent
      ref={contentRef}
      className="page-content"
      style={{ "--padding-bottom": "10rem" }}
      fullscreen
    >
      <div className="min-h-full max-w-xl mx-auto">
        {activeTab !== "tab0" && (
          <Progress
            step={Number(activeTab.replace("tab", ""))}
          />
        )}

        {activeTab === "tab0" && (
          <Why
            setActiveTab={setActiveTab}
            onLogin={() => router.push(Paths.login)}
          />
        )}

        {activeTab === "tab1" && (
          <Step1
            formData={formData}
            updateFormData={updateFormData}
            setActiveTab={setActiveTab}
            error={error}
            setError={setError}
          />
        )}

        {activeTab === "tab2" && (
          <Step2
            formData={formData}
            updateFormData={updateFormData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "tab3" && (
          <Step3
            formData={formData}
            updateFormData={updateFormData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "tab4" && (
          <Step4
            formData={formData}
            onClickApply={onClickApply}
            setActiveTab={setActiveTab}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </IonContent>
  );
}
function OtherInput({ selected, value, onChange, placeholder }) {
  if (!selected.includes("Other")) return null;

  return (
    <div className="mt-3">
      <input
        className={inputClass}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Tell us more..."}
        autoFocus
      />
    </div>
  );
}