// // OnboardingContainer.jsx — merged version

// import { Preferences } from '@capacitor/preferences';
// import {
//   IonContent, IonText, IonLabel, IonItem
// } from '@ionic/react';
// import "../App.css";
// import { useState, useEffect } from 'react';
// import authRepo from '../data/authRepo';
// import ThankYou from './auth/ThankYou';
// import logo from "../images/logo/icon.png";
// import { useSelector } from 'react-redux';
// import { useIonRouter } from '@ionic/react';
// import Paths from '../core/paths';

// /* === TOKENS === */
// const primaryButton = "w-full bg-emerald-700 text-white rounded-full py-3 font-semibold active:scale-[0.98] transition text-[1rem]";
// const secondaryButton = "w-full bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full py-3 font-semibold text-[1rem]";
// const cardClass = "border border-emerald-200 rounded-2xl p-4 flex flex-col gap-2 bg-white/60";
// const questionClass = "text-emerald-800  dark:text-cream dark:bg-base-surfaceDark text-sm rounded-full font-semibold mont-medium";
// const inputClass = "w-full rounded-full px-4 py-2 text-[1.05rem] outline-none bg-surface dark:bg-base-surfaceDark dark:text-cream text-emerald-800  placeholder-emerald-300 mt-1";

// /* === ANIMATION === */
// function StepTransition({ step, children }) {
//   return (
//     <div key={step} className='overflow-y-scroll' style={{ animation: "fadeSlide 0.35s ease-out" }}>
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
//             activeTab === t
//               ? "w-6 h-3 bg-emerald-600"
//               : "w-3 h-3 bg-emerald-200"
//           }`}
//         />
//       ))}
//     </div>
//   );
// }

// /* === MAIN === */
// export default function OnboardingContainer() {
//   const router = useIonRouter();
//   const currentProfile = useSelector(s => s.users.currentProfile);

//   const [activeTab, setActiveTab] = useState("tab0");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     fullName: "", email: "", igHandle: "",
//     whyApply: "", communityNeeds: "", writingOutcome: "",
//     selectedEvents: [], otherEvent: "",
//     eventPain: "", howFindOut: "",
//   });

//   useEffect(() => {
//     if (currentProfile?.id) router.push(Paths.home, "root");
//   }, [currentProfile, router]);

//   const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
//       setError(err?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* === WHY / TAB 0 === */
//   const Why = () => (
//     <StepTransition step="tab0">
//       <div className="p-26 text-center overflow-y-scroll space-y-6">
//         <img src={logo} className="w-24 mx-auto" alt="Plumbum" />

//         <IonText className="lora-medium block text-left text-emerald-900">
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

//         <div
//           className="text-emerald-700 text-sm underline cursor-pointer"
//           onClick={() => router.push(Paths.login)}
//         >
//           Already have an account? Log in
//         </div>
//       </div>
//     </StepTransition>
//   );

//   /* === STEP 1 === */
//   const Step1 = () => {
//     const [local, setLocal] = useState(formData);

//     const next = () => {
//       if (!validateEmail(local.email)) { setError("Enter a valid email"); return; }
//       setError("");
//       updateFormData(local);
//       setActiveTab("tab2");
//     };

//     return (
//       <StepTransition step="tab1">
//         <div className="p-4 space-y-4 min-h-screen">
//           <IonLabel className="lora-medium text-2xl font-bold text-emerald-900 block mb-2">
//             Interest Form
//           </IonLabel>

//           {error && <div className="text-red-500 text-sm">{error}</div>}

//           {/* <IonItem fill="outline" color="success" className="rounded-full"> */}
// //             <div className="w-full flex-col flex  py-2">
// //               <label className={questionClass}>Preferred Name</label>
// //               <input className={inputClass} value={local.fullName}
// //                 onChange={e => setLocal({ ...local, fullName: e.target.value })}
// //                 placeholder="Jane Doe" />
// //             </div>
// //           {/* </IonItem> */}

// //           {/* <IonItem fill="outline" color="success" className="rounded-full"> */}
// //             <div className="w-full flex-col flex  py-2">
// //               <label className={questionClass}>Email *</label>
// //               <input className={inputClass} type="email" value={local.email}
// //                 onChange={e => setLocal({ ...local, email: e.target.value })}
// //                 placeholder="email@example.com" />
// //             </div>
// //           {/* </IonItem> */}

// //           {/* <IonItem fill="outline" color="success" className="rounded-full"> */}
// //             <div className="w-full flex-col flex  py-2">
// //               <label className={questionClass}>Instagram</label>
// //               <input className={inputClass} value={local.igHandle}
// //                 onChange={e => setLocal({ ...local, igHandle: e.target.value })}
// //                 placeholder="@handle" />
// //             </div>
// //           {/* </IonItem> */}

// //           <button className={primaryButton} onClick={next}>Continue</button>
// //         </div>
// //       </StepTransition>
// //     );
// //   };

// //   /* === STEP 2 === */
// //   const Step2 = () => {
// //     const [local, setLocal] = useState(formData);

// //     return (
// //       <StepTransition step="tab2">
// //         <div className="p-4 space-y-4 min-h-screen">
// //           <IonLabel className="lora-medium text-2xl font-bold text-emerald-900 block mb-2">
// //             Artist Statement
// //           </IonLabel>

// //           {[
// //             { key: "whyApply",        label: "What's been hardest about writing consistently lately?" },
// //             { key: "communityNeeds",  label: "What's missing from writing spaces you've tried?" },
// //             { key: "writingOutcome",  label: "When you share your writing, what usually happens?" },
// //           ].map(({ key, label }) => (
// //             // <IonItem fill="outline" color="success" className="rounded-full" key={key}>
// //               <div className="w-full flex-col flex  py-2">
// //                 <label className={questionClass}>{label}</label>
// //                 <textarea className={inputClass} rows={3}
// //                   value={local[key]}
// //                   onChange={e => setLocal({ ...local, [key]: e.target.value })}
// //                 />
// //               </div>
// //             // </IonItem>
// //           ))}

// //           <div className="flex gap-3">
// //             <button className={secondaryButton} onClick={() => { updateFormData(local); setActiveTab("tab1"); }}>Back</button>
// //             <button className={primaryButton} onClick={() => { updateFormData(local); setActiveTab("tab3"); }}>Continue</button>
// //           </div>
// //         </div>
// //       </StepTransition>
// //     );
// //   };

// //   /* === STEP 3 === */
// //   const Step3 = () => {
// //     const EVENTS = ["Open mics","Workshops","Socials","Poetry readings","Art events","Music events","Raves","Other"];
// //     const [local, setLocal] = useState({ selectedEvents: formData.selectedEvents || [], otherEvent: formData.otherEvent || "" });

// //     const toggle = e => setLocal(prev => ({
// //       ...prev,
// //       selectedEvents: prev.selectedEvents.includes(e)
// //         ? prev.selectedEvents.filter(x => x !== e)
// //         : [...prev.selectedEvents, e]
// //     }));

// //     return (
// //       <StepTransition step="tab3">
// //         <div className="p-4 space-y-4 min-h-screen">
// //           <IonLabel className="lora-medium text-2xl font-bold text-emerald-900 block mb-2">
// //             Your Scene
// //           </IonLabel>

// //           <div className={cardClass}>
// //             <label className={questionClass}>What kinds of events do you go to?</label>
// //             <div className="flex flex-wrap gap-2 mt-2">
// //               {EVENTS.map(e => (
// //                 <div key={e} onClick={() => toggle(e)}
// //                   className={`px-4 py-2 rounded-full border cursor-pointer transition select-none text-sm font-medium ${
// //                     local.selectedEvents.includes(e)
// //                       ? "bg-emerald-600 text-white border-emerald-600"
// //                       : "bg-transparent text-emerald-700 border-emerald-300 hover:bg-emerald-50"
// //                   }`}>
// //                   {e}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {local.selectedEvents.includes("Other") && (
// //             // <IonItem fill="outline" color="success" className="rounded-full">
// //               <div className="w-full flex-col flex py-2">
// //                 <label className={questionClass}>What other events?</label>
// //                 <input className={inputClass} value={local.otherEvent}
// //                   onChange={e => setLocal(prev => ({ ...prev, otherEvent: e.target.value }))}
// //                   placeholder="Describe it..." />
// //               </div>
// //             // </IonItem>
// //           )}

// //           <div className="flex gap-3">
// //             <button className={secondaryButton} onClick={() => { updateFormData(local); setActiveTab("tab2"); }}>Back</button>
// //             <button className={primaryButton} onClick={() => { updateFormData(local); setActiveTab("tab4"); }}>Continue</button>
// //           </div>
// //         </div>
// //       </StepTransition>
// //     );
// //   };

// //   /* === STEP 4 === */
// //   const Step4 = () => {
// //     const [local, setLocal] = useState({ writingOutcome: formData.writingOutcome || "", eventPain: formData.eventPain || "", howFindOut: formData.howFindOut || "" });

// //     const submit = async () => {
// //       const finalForm = { ...formData, ...local };
// //       setFormData(finalForm);
// //       requestAnimationFrame(() => onClickApply(finalForm));
// //     };

// //     return (
// //       <StepTransition step="tab4">
// //         <div className="p-4 space-y-4 min-h-screen">
// //           <IonLabel className="lora-medium text-2xl font-bold text-emerald-900 block mb-2">
// //             Last Few Things
// //           </IonLabel>

// //           {[
// //             { key: "writingOutcome", label: "What do you hope will change in your writing life?", placeholder: "e.g. consistency, confidence, feedback..." },
// //             { key: "eventPain",      label: "What makes you stay or leave writing events?",        placeholder: "e.g. vibe, structure, feedback quality..." },
// //             { key: "howFindOut",     label: "How did you find Plumbum?",                           placeholder: "Instagram, friend, workshop..." },
// //           ].map(({ key, label, placeholder }) => (
// //             // <IonItem fill="outline" color="success" className="rounded-full" key={key}>
// //               <div className="w-full flex-col flex  py-2">
// //                 <label className={questionClass}>{label}</label>
// //                 <textarea className={inputClass} rows={3} placeholder={placeholder}
// //                   value={local[key]}
// //                   onChange={e => setLocal({ ...local, [key]: e.target.value })}
// //                 />
// //               </div>
// //             // </IonItem>
// //           ))}

// //           {error && <div className="text-red-500 text-sm text-center">{error}</div>}

// //           <div className="flex gap-3">
// //             <button className={secondaryButton} onClick={() => setActiveTab("tab3")}>Back</button>
// //             <button className={primaryButton} onClick={submit} disabled={loading}>
// //               {loading ? "Submitting..." : "Apply"}
// //             </button>
// //           </div>
// //         </div>
// //       </StepTransition>
// //     );
// //   };

// //   /* === RENDER === */
// //   if (user) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-cream pb-20 px-6">
// //         <ThankYou user={user} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <IonContent  fullscreen>
// //       <div className="max-w-xl overflow-y-scroll mx-auto pb-36">
// //         {activeTab !== "tab0" && <ProgressDots activeTab={activeTab} />}

// //         {activeTab === "tab0" && <Why />}
// //         {activeTab === "tab1" && <Step1 />}
// //         {activeTab === "tab2" && <Step2 />}
// //         {activeTab === "tab3" && <Step3 />}
// //         {activeTab === "tab4" && <Step4 />}
// //       </div>
// //     </IonContent>
// //   );
// // }
// // OnboardingContainer.jsx

// import { Preferences } from '@capacitor/preferences';
// import { IonContent, IonText, IonLabel } from '@ionic/react';
// import "../App.css";
// import { useState, useEffect } from 'react';
// import authRepo from '../data/authRepo';
// import ThankYou from './auth/ThankYou';
// import logo from "../images/logo/icon.png";
// import { useSelector } from 'react-redux';
// import { useIonRouter } from '@ionic/react';
// import Paths from '../core/paths';

// /* === TOKENS === */
// const primaryButton = "w-full bg-emerald-700 text-white rounded-full py-3 font-semibold active:scale-[0.98] transition text-[1rem]";
// const secondaryButton = "w-full bg-emerald-50 text-soft  border border-emerald-300 rounded-full py-3 font-semibold text-[1rem]";
// const cardClass = "border border-emerald-200 rounded-2xl p-4 flex flex-col gap-2 bg-white/60";
// const questionClass = "text-soft dark:text-cream text-sm font-semibold mont-medium";
// const inputClass = "w-full text-soft dark:text-cream rounded-full px-4 py-2 text-[1.05rem] outline-none bg-surface dark:bg-base-surfaceDark dark:text-cream text-emerald-800 placeholder-emerald-300 mt-1";

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
//             activeTab === t ? "w-6 h-3 bg-emerald-600" : "w-3 h-3 bg-emerald-200"
//           }`}
//         />
//       ))}
//     </div>
//   );
// }

// /* === WHY === */
// function Why({ setActiveTab, onLogin }) {
//   return (
//     <StepTransition step="tab0">
//       <div className="p-6 text-center space-y-6">
//         <img src={logo} className="w-24 mx-auto" alt="Plumbum" />
//         <IonText className="lora-medium block text-left text-soft dark:text-cream">
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
//         <div className="text-soft dark:text-cream text-sm underline cursor-pointer" onClick={onLogin}>
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
//     if (!validateEmail(local.email)) { setError("Enter a valid email"); return; }
//     setError("");
//     updateFormData(local);
//     setActiveTab("tab2");
//   };
// const back=()=>{
//   setActiveTab("tab0")
// }
//   return (
//     <StepTransition step="tab1">
//       <div className="px-4 py-8 space-y-4 min-h-screen">
//         <IonLabel className="lora-medium text-2xl font-bold text-soft dark:text-cream block mb-2">
//           Interest Form
//         </IonLabel>

//         {error && <div className="text-red-500 text-sm">{error}</div>}

//         {[
//           { key: "fullName", label: "Preferred Name", type: "text",  placeholder: "Jane Doe" },
//           { key: "email",    label: "Email *",        type: "email", placeholder: "email@example.com" },
//           { key: "igHandle", label: "Instagram",      type: "text",  placeholder: "@handle" },
//         ].map(({ key, label, type, placeholder }) => (
//           <div key={key} className="w-full flex flex-col py-2">
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
// <button className={secondaryButton} onClick={back}>Back</button>
//         <button className={primaryButton} onClick={next}>Continue</button>
//       </div>
//     </StepTransition>
//   );
// }

// /* === STEP 2 === */
// function Step2({ formData, updateFormData, setActiveTab }) {
//   const [local, setLocal] = useState(formData);

//   return (
//     <StepTransition step="tab2">
//       <div className="p-4 space-y-4 min-h-screen">
//         <IonLabel className="lora-medium text-2xl font-bold text-soft dark:text-cream0 block mb-2">
//           Artist Statement
//         </IonLabel>

//         {[
//           { key: "whyApply",       label: "What's been hardest about writing consistently lately?" },
//           { key: "communityNeeds", label: "What's missing from writing spaces you've tried?" },
//           { key: "writingOutcome", label: "When you share your writing, what usually happens?" },
//         ].map(({ key, label }) => (
//           <div key={key} className="w-full flex flex-col py-2">
//             <label className={questionClass}>{label}</label>
//             <textarea
//               className={inputClass}
//               rows={3}
//               value={local[key]}
//               onChange={e => setLocal({ ...local, [key]: e.target.value })}
//             />
//           </div>
//         ))}

//         <div className="flex gap-3">
//           <button className={secondaryButton} onClick={() => { updateFormData(local); setActiveTab("tab1"); }}>Back</button>
//           <button className={primaryButton}   onClick={() => { updateFormData(local); setActiveTab("tab3"); }}>Continue</button>
//         </div>
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
//   });

//   const toggle = ev => setLocal(prev => ({
//     ...prev,
//     selectedEvents: prev.selectedEvents.includes(ev)
//       ? prev.selectedEvents.filter(x => x !== ev)
//       : [...prev.selectedEvents, ev],
//   }));

//   return (
//     <StepTransition step="tab3">
//       <div className="p-4 space-y-4 min-h-screen">
//         <IonLabel className="lora-medium text-2xl font-bold text-soft dark:text-cream block mb-2">
//           Your Scene
//         </IonLabel>

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
//                     : "bg-transparent text-soft dark:text-cream border-emerald-300 hover:bg-emerald-50"
//                 }`}
//               >
//                 {ev}
//               </div>
//             ))}
//           </div>
//         </div>

//         {local.selectedEvents.includes("Other") && (
//           <div className="w-full flex flex-col py-2">
//             <label className={questionClass}>What other events?</label>
//             <input
//               className={inputClass}
//               value={local.otherEvent}
//               onChange={e => setLocal(prev => ({ ...prev, otherEvent: e.target.value }))}
//               placeholder="Describe it..."
//             />
//           </div>
//         )}

//         <div className="flex gap-3">
//           <button className={secondaryButton} onClick={() => { updateFormData(local); setActiveTab("tab2"); }}>Back</button>
//           <button className={primaryButton}   onClick={() => { updateFormData(local); setActiveTab("tab4"); }}>Continue</button>
//         </div>
//       </div>
//     </StepTransition>
//   );
// }

// /* === STEP 4 === */
// function Step4({ formData, setFormData, onClickApply, setActiveTab, loading, error }) {
//   const [local, setLocal] = useState({
//     writingOutcome: formData.writingOutcome || "",
//     eventPain:      formData.eventPain      || "",
//     howFindOut:     formData.howFindOut     || "",
//   });

//   const submit = () => {
//     const finalForm = { ...formData, ...local };
//     setFormData(finalForm);
//     requestAnimationFrame(() => onClickApply(finalForm));
//   };

//   return (
//     <StepTransition step="tab4">
//       <div className="p-4 space-y-4 min-h-screen">
//         <IonLabel className="lora-medium text-2xl font-bold text-soft dark:text-cream block mb-2">
//           Last Few Things
//         </IonLabel>

//         {[
//           { key: "writingOutcome", label: "What do you hope will change in your writing life?", placeholder: "e.g. consistency, confidence, feedback..." },
//           { key: "eventPain",      label: "What makes you stay or leave writing events?",        placeholder: "e.g. vibe, structure, feedback quality..." },
//           { key: "howFindOut",     label: "How did you find Plumbum?",                           placeholder: "Instagram, friend, workshop..." },
//         ].map(({ key, label, placeholder }) => (
//           <div key={key} className="w-full flex flex-col py-2">
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

//         <div className="flex gap-3">
//           <button className={secondaryButton} onClick={() => setActiveTab("tab3")}>Back</button>
//           <button className={primaryButton} onClick={submit} disabled={loading}>
//             {loading ? "Submitting..." : "Apply"}
//           </button>
//         </div>
//       </div>
//     </StepTransition>
//   );
// }

// /* === MAIN === */
// export default function OnboardingContainer() {
//   const router = useIonRouter();
//   const currentProfile = useSelector(s => s.users.currentProfile);

//   const [activeTab, setActiveTab] = useState("tab0");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     fullName: "", email: "", igHandle: "",
//     whyApply: "", communityNeeds: "", writingOutcome: "",
//     selectedEvents: [], otherEvent: "",
//     eventPain: "", howFindOut: "",
//   });

//   useEffect(() => {
//     if (currentProfile?.id) router.push(Paths.home, "root");
//   }, [currentProfile, router]);

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
//       setError(err?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-cream pb-20 px-6">
//         <ThankYou user={user} />
//       </div>
//     );
//   }

//   return (
//     <IonContent className='page-content' style={{ "--padding-bottom": "10rem" }} fullscreen>
//       <div className="max-w-xl mx-auto">
//         {activeTab !== "tab0" && <ProgressDots activeTab={activeTab} />}

//         {activeTab === "tab0" && <Why setActiveTab={setActiveTab} onLogin={() => router.push(Paths.login)} />}
//         {activeTab === "tab1" && <Step1 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} error={error} setError={setError} />}
//         {activeTab === "tab2" && <Step2 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} />}
//         {activeTab === "tab3" && <Step3 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} />}
//         {activeTab === "tab4" && <Step4 formData={formData} setFormData={setFormData} onClickApply={onClickApply} setActiveTab={setActiveTab} loading={loading} error={error} />}
//       </div>
//     </IonContent>
//   );
// }
import { Preferences } from '@capacitor/preferences';
import { IonContent, IonText, IonLabel } from '@ionic/react';
import "../App.css";
import { useState, useEffect } from 'react';
import authRepo from '../data/authRepo';
import ThankYou from './auth/ThankYou';
import logo from "../images/logo/icon.png";
import { useSelector } from 'react-redux';
import { useIonRouter } from '@ionic/react';
import Paths from '../core/paths';

/* === TOKENS === */
const primaryButton = "w-full bg-emerald-700 text-white rounded-full py-3 font-semibold active:scale-[0.98] transition text-[1rem]";
const secondaryButton = "w-full bg-transparent text-emerald-700 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-600 rounded-full py-3 font-semibold text-[1rem]";
const questionClass = "text-emerald-900 dark:text-cream text-sm font-semibold mont-medium mb-1";
const inputClass = "w-full rounded-2xl px-4 py-3 text-[1.05rem] outline-none bg-white/70 dark:bg-white/10 text-emerald-900 dark:text-cream placeholder-emerald-300 dark:placeholder-emerald-600 mt-1 border border-emerald-100 dark:border-emerald-800";
const cardClass = "border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex flex-col gap-2 bg-white/60 dark:bg-white/5";
const pageClass = "px-4 py-8 space-y-5 min-h-screen";
const headingClass = "lora-medium text-2xl font-bold text-emerald-900 dark:text-cream block mb-4";

/* === ANIMATION === */
function StepTransition({ step, children }) {
  return (
    <div key={step} style={{ animation: "fadeSlide 0.35s ease-out" }}>
      {children}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* === PROGRESS DOTS === */
function ProgressDots({ activeTab }) {
  const tabs = ["tab1", "tab2", "tab3", "tab4"];
  return (
    <div className="flex justify-center gap-2 pt-6 pb-2">
      {tabs.map(t => (
        <div
          key={t}
          className={`rounded-full transition-all duration-300 ${
            activeTab === t ? "w-6 h-3 bg-emerald-600" : "w-3 h-3 bg-emerald-200 dark:bg-emerald-800"
          }`}
        />
      ))}
    </div>
  );
}

/* === NAV BUTTONS === */
function NavButtons({ onBack, onNext, nextLabel = "Continue", loading = false }) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && <button className={secondaryButton} onClick={onBack}>Back</button>}
      <button className={primaryButton} onClick={onNext} disabled={loading}>
        {loading ? "Submitting..." : nextLabel}
      </button>
    </div>
  );
}

/* === WHY === */
function Why({ setActiveTab, onLogin }) {
  return (
    <StepTransition step="tab0">
      <div className="p-6 text-center space-y-6">
        <img src={logo} className="w-24 mx-auto" alt="Plumbum" />
        <IonText className="lora-medium block text-left text-emerald-900 dark:text-cream">
          <h2 className="text-2xl font-bold mb-3">What is Plumbum?</h2>
          <ul className="list-disc pl-5 space-y-2 text-[0.95rem]">
            <li><strong>Writer-Focused:</strong> A space to grow, get feedback, and share — all in one place.</li>
            <li><strong>Community First:</strong> Built from live workshops and honest conversations, not algorithms.</li>
            <li><strong>Hybrid by Design:</strong> Feedback, self-promotion, and curation — because writers need all three.</li>
          </ul>
          <h2 className="text-2xl font-bold mt-6 mb-3">Why Join?</h2>
          <ul className="list-disc pl-5 space-y-2 text-[0.95rem]">
            <li><strong>Real Feedback:</strong> From people who care about craft, not clout.</li>
            <li><strong>Creative Momentum:</strong> Events, prompts, and people who show up.</li>
            <li><strong>Supportive Culture:</strong> Built slow and small on purpose.</li>
          </ul>
        </IonText>
        <button className={primaryButton} onClick={() => setActiveTab("tab1")}>
          Join Plumbum
        </button>
        <div className="text-emerald-700 dark:text-emerald-300 text-sm underline cursor-pointer" onClick={onLogin}>
          Already have an account? Log in
        </div>
      </div>
    </StepTransition>
  );
}

/* === STEP 1 === */
function Step1({ formData, updateFormData, setActiveTab, error, setError }) {
  const [local, setLocal] = useState(formData);
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const next = () => {
    if (!validateEmail(local.email)) { setError("Enter a valid email"); return; }
    setError("");
    updateFormData(local);
    setActiveTab("tab2");
  };

  return (
    <StepTransition step="tab1">
      <div className={pageClass}>
        <IonLabel className={headingClass}>Interest Form</IonLabel>
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {[
          { key: "fullName", label: "Preferred Name", type: "text",  placeholder: "Jane Doe" },
          { key: "email",    label: "Email *",        type: "email", placeholder: "email@example.com" },
          { key: "igHandle", label: "Instagram",      type: "text",  placeholder: "@handle" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key} className="w-full flex flex-col">
            <label className={questionClass}>{label}</label>
            <input
              className={inputClass}
              type={type}
              value={local[key]}
              onChange={e => setLocal({ ...local, [key]: e.target.value })}
              placeholder={placeholder}
            />
          </div>
        ))}

        <NavButtons onBack={() => setActiveTab("tab0")} onNext={next} />
      </div>
    </StepTransition>
  );
}

/* === STEP 2 === */
function Step2({ formData, updateFormData, setActiveTab }) {
  const [local, setLocal] = useState(formData);

  return (
    <StepTransition step="tab2">
      <div className={pageClass}>
        <IonLabel className={headingClass}>Artist Statement</IonLabel>

        {[
          { key: "whyApply",       label: "What's been hardest about writing consistently lately?" },
          { key: "communityNeeds", label: "What's missing from writing spaces you've tried?" },
        ].map(({ key, label }) => (
          <div key={key} className="w-full flex flex-col">
            <label className={questionClass}>{label}</label>
            <textarea
              className={inputClass}
              rows={3}
              value={local[key]}
              onChange={e => setLocal({ ...local, [key]: e.target.value })}
            />
          </div>
        ))}

        <NavButtons
          onBack={() => { updateFormData(local); setActiveTab("tab1"); }}
          onNext={() => { updateFormData(local); setActiveTab("tab3"); }}
        />
      </div>
    </StepTransition>
  );
}

/* === STEP 3 === */
const EVENTS = ["Open mics","Workshops","Socials","Poetry readings","Art events","Music events","Raves","Other"];

function Step3({ formData, updateFormData, setActiveTab }) {
  const [local, setLocal] = useState({
    selectedEvents: formData.selectedEvents || [],
    otherEvent: formData.otherEvent || "",
    writingOutcome: formData.writingOutcome || "",
  });

  const toggle = ev => setLocal(prev => ({
    ...prev,
    selectedEvents: prev.selectedEvents.includes(ev)
      ? prev.selectedEvents.filter(x => x !== ev)
      : [...prev.selectedEvents, ev],
  }));

  return (
    <StepTransition step="tab3">
      <div className={pageClass}>
        <IonLabel className={headingClass}>Your Scene</IonLabel>

        <div className={cardClass}>
          <label className={questionClass}>What kinds of events do you go to?</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {EVENTS.map(ev => (
              <div
                key={ev}
                onClick={() => toggle(ev)}
                className={`px-4 py-2 rounded-full border cursor-pointer transition select-none text-sm font-medium ${
                  local.selectedEvents.includes(ev)
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-transparent text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900"
                }`}
              >
                {ev}
              </div>
            ))}
          </div>
        </div>

        {local.selectedEvents.includes("Other") && (
          <div className="w-full flex flex-col">
            <label className={questionClass}>What other events?</label>
            <input
              className={inputClass}
              value={local.otherEvent}
              onChange={e => setLocal(prev => ({ ...prev, otherEvent: e.target.value }))}
              placeholder="Describe it..."
            />
          </div>
        )}

        {/* Moved here — separate from Step4's writingOutcome */}
        <div className="w-full flex flex-col">
          <label className={questionClass}>When you share your writing, what usually happens?</label>
          <textarea
            className={inputClass}
            rows={3}
            value={local.writingOutcome}
            onChange={e => setLocal({ ...local, writingOutcome: e.target.value })}
          />
        </div>

        <NavButtons
          onBack={() => { updateFormData(local); setActiveTab("tab2"); }}
          onNext={() => { updateFormData(local); setActiveTab("tab4"); }}
        />
      </div>
    </StepTransition>
  );
}

/* === STEP 4 === */
function Step4({ formData, onClickApply, setActiveTab, loading, error }) {
  const [local, setLocal] = useState({
    eventPain:  formData.eventPain  || "",
    howFindOut: formData.howFindOut || "",
    writingHope: formData.writingHope || "",
  });

  const submit = () => onClickApply({ ...formData, ...local });

  return (
    <StepTransition step="tab4">
      <div className={pageClass}>
        <IonLabel className={headingClass}>Last Few Things</IonLabel>

        {[
          { key: "writingHope", label: "What do you hope will change in your writing life?",  placeholder: "e.g. consistency, confidence, community..." },
          { key: "eventPain",   label: "What makes you stay or leave writing events?",         placeholder: "e.g. vibe, structure, feedback quality..." },
          { key: "howFindOut",  label: "How did you find Plumbum?",                            placeholder: "Instagram, friend, workshop..." },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="w-full flex flex-col">
            <label className={questionClass}>{label}</label>
            <textarea
              className={inputClass}
              rows={3}
              placeholder={placeholder}
              value={local[key]}
              onChange={e => setLocal({ ...local, [key]: e.target.value })}
            />
          </div>
        ))}

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <NavButtons
          onBack={() => setActiveTab("tab3")}
          onNext={submit}
          nextLabel="Apply"
          loading={loading}
        />
      </div>
    </StepTransition>
  );
}

/* === MAIN === */
export default function OnboardingContainer() {
  const router = useIonRouter();
  const currentProfile = useSelector(s => s.users.currentProfile);

  const [activeTab, setActiveTab] = useState("tab0");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", email: "", igHandle: "",
    whyApply: "", communityNeeds: "",
    writingOutcome: "", writingHope: "",
    selectedEvents: [], otherEvent: "",
    eventPain: "", howFindOut: "",
  });

  useEffect(() => {
    if (currentProfile?.id) router.push(Paths.home, "root");
  }, [currentProfile, router]);

  const updateFormData = data => setFormData(prev => ({ ...prev, ...data }));

  const onClickApply = async (overrideForm = formData) => {
    if (loading) return;
    try {
      setLoading(true);
      setError("");
      const data = await authRepo.apply({
        ...overrideForm,
        email: overrideForm.email?.toLowerCase(),
      });
      await Preferences.set({ key: "hasSeenOnboarding", value: "true" });
      setUser(data?.user ?? data);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
       <IonContent className="page-content" style={{ "--padding-bottom": "10rem" }} fullscreen>
      <ThankYou user={user} />
      </IonContent>
    );
  }

  return (
    <IonContent className="page-content" style={{ "--padding-bottom": "10rem" }} fullscreen>
      <div className="max-w-xl py-4 mx-auto">
        {activeTab !== "tab0" && <ProgressDots activeTab={activeTab} />}

        {activeTab === "tab0" && <Why setActiveTab={setActiveTab} onLogin={() => router.push(Paths.login)} />}
        {activeTab === "tab1" && <Step1 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} error={error} setError={setError} />}
        {activeTab === "tab2" && <Step2 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} />}
        {activeTab === "tab3" && <Step3 formData={formData} updateFormData={updateFormData} setActiveTab={setActiveTab} />}
        {activeTab === "tab4" && <Step4 formData={formData} onClickApply={onClickApply} setActiveTab={setActiveTab} loading={loading} error={error} />}
      </div>
    </IonContent>
  );
}