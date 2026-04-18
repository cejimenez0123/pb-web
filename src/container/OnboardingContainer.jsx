

import { Preferences } from '@capacitor/preferences';
import { IonContent } from '@ionic/react';

import "../App.css";
import { useState, useEffect } from 'react';
import authRepo from '../data/authRepo';
import ThankYou from './auth/ThankYou';
import logo from "../images/logo/icon.png";
import { useSelector } from 'react-redux';

/* =========================
   TOKENS
========================= */

const primaryButton =
  "w-full bg-emerald-600 text-white rounded-2xl py-3 font-semibold active:scale-[0.98] transition";

const secondaryButton =
  "w-full bg-emerald-50 text-emerald-700 rounded-2xl py-3 font-semibold";

const card =
  "bg-cream border border-emerald-100 rounded-2xl p-5 flex flex-col gap-2";

const question =
  "text-emerald-700 text-sm font-medium";

const input =
  "w-full text-[1.05rem] outline-none bg-transparent text-emerald-900 placeholder-emerald-400";

/* =========================
   ANIMATION
========================= */

function StepTransition({ step, children }) {
  return (
    <div key={step} style={{ animation: "fadeSlide 0.35s ease-out" }}>
      {children}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* =========================
   MAIN
========================= */

export default function OnboardingContainer() {
  const currentProfile = useSelector(s => s.users.currentProfile);

  const [activeTab, setActiveTab] = useState("tab0");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  igHandle: "",

  whyApply: "",
  communityNeeds: "",
  writingOutcome: "",

  selectedEvents: [],
  otherEvent: "",

  eventPain: "",
  howFindOut: "",
});

  useEffect(() => {
    if (currentProfile?.id) setUser(currentProfile);
  }, [currentProfile]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const updateFormData = (data) =>
    setFormData(prev => ({ ...prev, ...data }));

/* =========================
   APPLY (FIXED + SAFE)
========================= */

const onClickApply = async (overrideForm = formData) => {
  if (loading) return;

  try {
    setLoading(true);
    setError("");

    const form = {
      ...overrideForm,
      email: overrideForm.email?.toLowerCase(),
      genres: overrideForm.selectedGenres?.includes("Other")
        ? [
            ...overrideForm.selectedGenres.filter(g => g !== "Other"),
            overrideForm.otherGenre
          ]
        : overrideForm.selectedGenres,
    };

    const data = await authRepo.apply(form);

    await Preferences.set({ key: "hasSeenOnboarding", value: "true" });

    setUser(data?.user ?? data);

  } catch (err) {
    setError(err?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

/* =========================
   STEP 1
========================= */

const Step1 = () => {
  const [local, setLocal] = useState(formData);

  const next = () => {
    if (!validateEmail(local.email)) {
      setError("Enter a valid email");
      return;
    }

    setError("");
    updateFormData(local);
    setActiveTab("tab2");
  };

  return (
    <StepTransition step="tab1">
      <div className="p-4 space-y-4 bg-cream min-h-screen">

        <img src={logo} className="w-20 mx-auto mb-4" />

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <div className={card}>
          <label className={question}>Name</label>
          <input
            className={input}
            value={local.fullName}
            onChange={e => setLocal({ ...local, fullName: e.target.value })}
            placeholder="Jane Doe"
          />
        </div>

        <div className={card}>
          <label className={question}>Email *</label>
          <input
            className={input}
            value={local.email}
            onChange={e => setLocal({ ...local, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>

        <div className={card}>
          <label className={question}>Instagram</label>
          <input
            className={input}
            value={local.igHandle}
            onChange={e => setLocal({ ...local, igHandle: e.target.value })}
            placeholder="@handle"
          />
        </div>

        <button className={primaryButton} onClick={next}>
          Continue
        </button>

      </div>
    </StepTransition>
  );
};

/* =========================
   STEP 2 (UPDATED QUESTIONS FIXED)
========================= */

const Step2 = () => {
  const [local, setLocal] = useState(formData);

  return (
    <StepTransition step="tab2">
      <div className="p-4 space-y-6 bg-cream min-h-screen">

        <div className={card}>
          <label className={question}>
            What’s been hardest about writing consistently lately?
          </label>
          <textarea
            className={input}
            rows={4}
            value={local.whyApply}
            onChange={e => setLocal({ ...local, whyApply: e.target.value })}
          />
        </div>

        <div className={card}>
          <label className={question}>
            What’s missing from writing spaces you’ve tried?
          </label>
          <textarea
            className={input}
            rows={4}
            value={local.communityNeeds}
            onChange={e => setLocal({ ...local, communityNeeds: e.target.value })}
          />
        </div>

        <div className={card}>
          <label className={question}>
            When you share your writing, what usually happens?
          </label>
          <textarea
            className={input}
            rows={3}
            value={local.writingOutcome}
            onChange={e => setLocal({ ...local, writingOutcome: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button className={secondaryButton} onClick={() => setActiveTab("tab1")}>
            Back
          </button>

          <button
            className={primaryButton}
            onClick={() => {
              updateFormData(local);
              setActiveTab("tab3");
            }}
          >
            Continue
          </button>
        </div>

      </div>
    </StepTransition>
  );
};

/* =========================
   STEP 3
========================= */

// const Step3 = () => {
//   const toggle = (g) => {
//     const exists = formData.selectedGenres.includes(g);
//     const updated = exists
//       ? formData.selectedGenres.filter(x => x !== g)
//       : [...formData.selectedGenres, g];

//     updateFormData({ selectedGenres: updated });
//   };

//   return (
//     <StepTransition step="tab3">
//       <div className="p-4 space-y-4 bg-cream">

//         <div className={card}>
//           <label className={question}>Genres</label>

//           <div className="flex flex-wrap gap-2 mt-2">
//             {["Fiction", "Poetry", "Non-fiction", "Fantasy", "Other"].map(g => (
//               <div
//                 key={g}
//                 onClick={() => toggle(g)}
//                 className={`px-4 py-2 rounded-full border ${
//                   formData.selectedGenres.includes(g)
//                     ? "bg-emerald-600 text-white"
//                     : "bg-emerald-50 text-emerald-700"
//                 }`}
//               >
//                 {g}
//               </div>
//             ))}
//           </div>
//         </div>

//         <button className={primaryButton} onClick={() => setActiveTab("tab4")}>
//           Continue
//         </button>

//       </div>
//     </StepTransition>
//   );
// };
const Step3 = () => {
  const EVENTS = [
    "Open mics",
    "Workshops",
    "Socials",
    "Poetry readings",
    "Art events",
    "Music events",
    "Raves",
    "Other"
  ];

  // ✅ LOCAL STATE (fixes refresh / flicker issue)
  const [local, setLocal] = useState({
    selectedEvents: formData.selectedEvents || [],
    otherEvent: formData.otherEvent || ""
  });

  const toggle = (event) => {
    setLocal(prev => {
      const exists = prev.selectedEvents.includes(event);

      const updated = exists
        ? prev.selectedEvents.filter(x => x !== event)
        : [...prev.selectedEvents, event];

      return {
        ...prev,
        selectedEvents: updated
      };
    });
  };

  const handleNext = () => {
    updateFormData(local);
    setActiveTab("tab4");
  };

  return (
    <StepTransition step="tab3">
      <div className="p-4 space-y-4 bg-cream min-h-screen">

        <div className={card}>
          <label className={question}>
            What kinds of events do you go to?
          </label>

          <div className="flex flex-wrap gap-2 mt-2">
            {EVENTS.map((e) => (
              <div
                key={e}
                onClick={() => toggle(e)}
                className={`px-4 py-2 rounded-full border cursor-pointer transition ${
                  local.selectedEvents.includes(e)
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {e}
              </div>
            ))}
          </div>
        </div>

        {/* OTHER INPUT */}
        {local.selectedEvents.includes("Other") && (
          <div className={card}>
            <label className={question}>What other events?</label>

            <input
              className={input}
              value={local.otherEvent}
              onChange={(e) =>
                setLocal(prev => ({
                  ...prev,
                  otherEvent: e.target.value
                }))
              }
              placeholder="Describe it..."
            />
          </div>
        )}

        <button className={primaryButton} onClick={handleNext}>
          Continue
        </button>

      </div>
    </StepTransition>
  );
};
/* =========================
   STEP 4
========================= */
// 
// const Step4 = () => {
//   const [local, setLocal] = useState({
//     writingOutcome: formData.writingOutcome || "",
//     howFindOut: formData.howFindOut || "",
//     eventPain: formData.eventPain || "",
//   });

//   const submit = async () => {
//     const finalForm = {
//       ...formData,
//       ...local,
//     };

//     setFormData(finalForm);

//     requestAnimationFrame(() => {
//       onClickApply(finalForm);
//     });
//   };

//   return (
//     <StepTransition step="tab4">
//       <div className="p-4 space-y-4 bg-cream min-h-screen">

//         {/* WRITING OUTCOME (THIS WAS MISSING BEFORE) */}
//         <div className={card}>
//           <label className={question}>
//             What do you hope will change in your writing life?
//           </label>

//           <textarea
//             className={input}
//             rows={4}
//             value={local.writingOutcome}
//             onChange={(e) =>
//               setLocal({ ...local, writingOutcome: e.target.value })
//             }
//             placeholder="e.g. consistency, confidence, feedback..."
//           />
//         </div>

//         {/* EVENT PAIN */}
//         <div className={card}>
//           <label className={question}>
//             What makes you stay or leave writing events?
//           </label>

//           <textarea
//             className={input}
//             rows={4}
//             value={local.eventPain}
//             onChange={(e) =>
//               setLocal({ ...local, eventPain: e.target.value })
//             }
//             placeholder="e.g. vibe, structure, feedback quality..."
//           />
//         </div>

//         {/* HOW DID YOU FIND OUT */}
//         <div className={card}>
//           <label className={question}>
//             How did you find Plumbum?
//           </label>

//           <textarea
//             className={input}
//             rows={3}
//             value={local.howFindOut}
//             onChange={(e) =>
//               setLocal({ ...local, howFindOut: e.target.value })
//             }
//           />
//         </div>

//         {error && (
//           <div className="text-red-500 text-sm text-center">
//             {error}
//           </div>
//         )}

//         <button
//           className={primaryButton}
//           onClick={submit}
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Apply"}
//         </button>

//       </div>
//     </StepTransition>
//   );
// };
// const Step4 = () => {
//   const [local, setLocal] = useState({
//     writingOutcome: formData.writingOutcome || "",
//     eventPain: formData.eventPain || "",
//     howFindOut: formData.howFindOut || "",
//   });

//   const submit = async () => {
//     const finalForm = {
//       ...formData,
//       ...local,
//     };

//     setFormData(finalForm);

//     requestAnimationFrame(() => {
//       onClickApply(finalForm);
//     });
//   };

//   return (
//     <StepTransition step="tab4">
//       <div className="p-4 space-y-4 bg-cream min-h-screen">

//         <div className={card}>
//           <label className={question}>
//             What do you hope will change in your writing life?
//           </label>

//           <textarea
//             className={input}
//             rows={4}
//             value={local.writingOutcome}
//             onChange={(e) =>
//               setLocal({ ...local, writingOutcome: e.target.value })
//             }
//           />
//         </div>

//         <div className={card}>
//           <label className={question}>
//             What makes you stay or leave writing events?
//           </label>

//           <textarea
//             className={input}
//             rows={4}
//             value={local.eventPain}
//             onChange={(e) =>
//               setLocal({ ...local, eventPain: e.target.value })
//             }
//           />
//         </div>

//         <div className={card}>
//           <label className={question}>
//             How did you find Plumbum?
//           </label>

//           <textarea
//             className={input}
//             rows={3}
//             value={local.howFindOut}
//             onChange={(e) =>
//               setLocal({ ...local, howFindOut: e.target.value })
//             }
//           />
//         </div>

//         {error && (
//           <div className="text-red-500 text-sm text-center">
//             {error}
//           </div>
//         )}

//         <button
//           className={primaryButton}
//           onClick={submit}
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Apply"}
//         </button>

//       </div>
//     </StepTransition>
//   );
// };
const Step4 = () => {
  const [local, setLocal] = useState({
    writingOutcome: formData.writingOutcome || "",
    eventPain: formData.eventPain || "",
    howFindOut: formData.howFindOut || "",
  });

  const submit = async () => {
    const finalForm = {
      ...formData,
      ...local,
    };

    setFormData(finalForm);

    requestAnimationFrame(() => {
      onClickApply(finalForm);
    });
  };

  return (
    <StepTransition step="tab4">
      <div className="p-4 space-y-4 bg-cream min-h-screen">

        <div className={card}>
          <label className={question}>
            What do you hope will change in your writing life?
          </label>

          <textarea
            className={input}
            rows={4}
            value={local.writingOutcome}
            onChange={(e) =>
              setLocal({ ...local, writingOutcome: e.target.value })
            }
          />
        </div>

        <div className={card}>
          <label className={question}>
            What makes you stay or leave writing events?
          </label>

          <textarea
            className={input}
            rows={4}
            value={local.eventPain}
            onChange={(e) =>
              setLocal({ ...local, eventPain: e.target.value })
            }
          />
        </div>

        <div className={card}>
          <label className={question}>
            How did you find Plumbum?
          </label>

          <textarea
            className={input}
            rows={3}
            value={local.howFindOut}
            onChange={(e) =>
              setLocal({ ...local, howFindOut: e.target.value })
            }
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <button
          className={primaryButton}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Apply"}
        </button>

      </div>
    </StepTransition>
  );
};
// const Step4 = () => {
//   const [local, setLocal] = useState({
//     howFindOut: formData.howFindOut || "",
//   });

//   const submit = async () => {
//     const finalForm = {
//       ...formData,
//       howFindOut: local.howFindOut,
//     };

//     setFormData(finalForm);

//     requestAnimationFrame(() => {
//       onClickApply(finalForm);
//     });
//   };

//   return (
//     <StepTransition step="tab4">
//       <div className="p-4 space-y-4 bg-cream min-h-screen">

//         <div className={card}>
//           <label className={question}>
//             How did you find Plumbum & why did you apply?
//           </label>

//           <textarea
//             className={input}
//             rows={4}
//             value={local.howFindOut}
//             onChange={(e) => setLocal({ howFindOut: e.target.value })}
//             placeholder="Instagram, friend, workshop..."
//           />
//         </div>

//         {error && (
//           <div className="text-red-500 text-sm text-center">
//             {error}
//           </div>
//         )}

//         <button
//           className={primaryButton}
//           onClick={submit}
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Apply"}
//         </button>

//       </div>
//     </StepTransition>
//   );
// };

/* =========================
   SUCCESS
========================= */

if (user) {
  return (
    <div className="min-h-screen flex overflow-y-scoll pb-20 items-center justify-center bg-cream pt-6 px-6">
      <ThankYou user={user} />
    </div>
  );
}

/* =========================
   RENDER
========================= */

return (
  <IonContent style={{ "--background": "#f4f4e0" }} fullscreen>
    <div className="max-w-xl mx-auto pt-6 pb-20">

      {activeTab === "tab1" && <Step1 />}
      {activeTab === "tab2" && <Step2 />}
      {activeTab === "tab3" && <Step3 />}
      {activeTab === "tab4" && <Step4 />}

      {activeTab === "tab0" && (
        <div className="text-center p-6">
          <img src={logo} className="w-24 mx-auto mb-6" />
          <button className={primaryButton} onClick={() => setActiveTab("tab1")}>
            Join Plumbum
          </button>
        </div>
      )}

    </div>
  </IonContent>
);
}