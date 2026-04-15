// import { Preferences } from '@capacitor/preferences';
// import {
//   IonPage,
//   IonContent,
//   IonGrid,
//   IonRow,
//   IonCol,
//   IonInput,
//   IonTextarea,
//   IonLabel,
//   IonList,
//   IonText,
//   IonItem,
//   useIonRouter,
//   IonButton
// } from '@ionic/react';
// import "../App.css"
// import { useState, useContext, useEffect } from 'react';
// import { debounce } from 'lodash';
// import Context from '../context';
// import Paths from '../core/paths';
// import authRepo from '../data/authRepo';
// import ThankYou from './auth/ThankYou';
// import logo from "../images/logo/icon.png";
// import { useDispatch } from 'react-redux';
// import { signUp } from '../actions/UserActions';
// import { useSelector } from 'react-redux';
// const inputStyle = {
//   "--width": '100%',
//   border: 'none',
//   outline: 'none',
//   background: 'transparent',
//   fontSize: '1.125rem',
//   fontFamily: 'inherit',
//   fontWeight: 600,
//   // color: 'inherit',
//   "--color":"inherit",
//   "--boxShadow": 'none',
//   "--padding": 0,

//   '--background': 'transparent',
// };

// export default function OnboardingContainer(props) {
//   const router = useIonRouter()
//   const { seo, setSeo, error, setError } = useContext(Context);
//   const dispatch = useDispatch()
//   const currentProfile = useSelector(state=>state.users.currentProfile)
//   const genres = [
//     "Fiction", "Non-fiction", "Poetry", "Drama/Playwriting", "Screenwriting",
//     "Flash Fiction", "Memoir", "Short Stories", "Fantasy", "Science Fiction",
//     "Horror", "Mystery/Thriller", "Romance", "Young Adult", "Children's Literature",
//     "Historical Fiction", "Satire/Humor", "Experimental/Hybrid Forms", "Other"
//   ];
//   useEffect(()=>{
//     if(currentProfile && currentProfile.id){
//       router.push(Paths.myProfile)
//     }
//   },[currentProfile])
//   const [activeTab, setActiveTab] = useState('tab0');
//   const [formData, setFormData] = useState({
//     idToken:"",
//     igHandle: "",
//     fullName: "",
//     email: "",
//     whyApply: "",
//     howFindOut: "",
//     otherGenre: "",
//     communityNeeds: "",
//     workshopPreference: "both",
//     feedbackFrequency: "daily",
//     selectedGenres: [],
//     comfortLevel: 1,
//     platformFeatures: "",
//   });

//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     setSeo(prev => ({ ...prev, title: "Plumbum (Onboarding)" }));
//   }, [setSeo]);

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||formData.idToken.length>10;



//   const onClickApply = async () => {
    
//     const idToken =formData.idToken
//     if(idToken){
//     let  data = await authRepo.apply(formData)
//     console.log(data)
//     await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });
//     setUser(data?.user ?? data);

//     }

//     if (validateEmail(formData.email)) {
//       const form = {
//         ...formData,
//         email: formData.email.toLowerCase(),
//         genres: formData.selectedGenres.includes("Other")
//           ? [...formData.selectedGenres.filter(g => g !== "Other"), formData.otherGenre]
//           : formData.selectedGenres,
//       };
//       try {
//         let data;
//         if (window.location.pathname.includes("newsletter")) {
//           data = await authRepo.applyFromNewsletter(form);
//         } else {
//           data = await authRepo.apply(form);
//         }
//         await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });
//         setUser(data?.user ?? data);
//       } catch (err) {
//         setUser(err);
//       }
//     }
//   }

//   const updateFormData = (newData) => {
//     setFormData(prev => ({ ...prev, ...newData }));
//   };


// const Step1 = ({ formData, updateFormData, handleTab }) => {

//   const [localData, setLocalData] = useState({
//     fullName: formData.fullName || "",
//     email: formData.email || "",
//     igHandle: formData.igHandle || ""
//   });

//   const validateEmail = (email) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleNext = () => {
//     updateFormData(localData);
//     handleTab('tab2');
//   };

//   const handleBack = () => {
//     handleTab('tab0');
//   };

//   return (
//     <div style={{ "--background": "#f4f4e0",paddingBottom:"4em"}}className="w-full max-w-xl mx-auto px-4">
      
// <div className='bg-cream flex flex-col'>
//           <IonText color="success" className="lora-bold">
//             * Required
//           </IonText>

//           <IonText className="text-[1.5rem] font-bold">
//             Interest Form
//           </IonText>

//           {/* Preferred Name */}
//           <IonItem fill="outline"    style={{ "--background": "#f4f4e0" }} color="success" className="my-6">
//             <div className="w-full bg-cream">
//               <IonLabel className="mont-medium">
//                 Preferred Name
//               </IonLabel>
//               <input
//                 type="text"
//                 value={localData.fullName}
//                 onChange={e =>
//                   setLocalData(prev => ({ ...prev, fullName: e.target.value }))
//                 }
//                 placeholder="Jon Doe"
//                 className="w-full bg-cream text-emerald-800outline-none text-lg mt-2"
//               />
//             </div>
//           </IonItem>

//           {/* Email */}
//           <IonItem fill="outline" color="success" style={{ "--background": "#f4f4e0" }}  className="my-6">
//             <div className="w-full  bg-cream">
//               <IonLabel className="mont-medium">
//                 * Email
//               </IonLabel>
//               <input
//                 type="email"
//                 value={localData.email}
//                 onChange={e =>
//                   setLocalData(prev => ({ ...prev, email: e.target.value }))
//                 }
//                 placeholder="email@example.com"
//                 className="w-full bg-cream text-emerald-800 outline-none text-lg mt-2"
//               />
//             </div>
//           </IonItem>

//           {localData.email && !validateEmail(localData.email) && (
//             <IonText color="danger" className="text-sm">
//               Please use a valid email
//             </IonText>
//           )}

//           {/* IG Handle */}
//           <IonItem fill="outline" style={{ "--background": "#f4f4e0" }}  color="success" className="my-6">
//             <div className="w-full  bg-cream">
//               <IonLabel className="mont-medium">
//                 IG Handle
//               </IonLabel>
//               <input
//                 type="text"
//                 value={localData.igHandle}
//                 onChange={e =>
//                   setLocalData(prev => ({ ...prev, igHandle: e.target.value }))
//                 }
//                 placeholder="@yourhandle"
//                 className="w-full bg-cream text-emerald-800 outline-none text-lg mt-2"
//               />
//             </div>
//           </IonItem>

//           {/* Navigation */}
//           <IonRow className='flex justify-between mt-8'>
//             <div className="btn bg-emerald-700 rounded-full px-6 py-2">
//               <IonText onClick={handleBack} className="text-white text-lg">
//                 Back
//               </IonText>
//             </div>
//             <div className="btn bg-emerald-700 rounded-full px-6 py-2">
//               <IonText onClick={handleNext} className="text-white text-lg">
//                 Next Step
//               </IonText>
//             </div>
//           </IonRow>
// </div>
//         {/* </IonList>
//       </IonRow> */}
//     </div>
//   );
// };
// const Step2 = ({ formData, updateFormData, handleTab }) => {

//   const [localData, setLocalData] = useState({
//     whyApply: formData.whyApply || "",
//     communityNeeds: formData.communityNeeds || ""
//   });

//   const handleNext = () => {
//     updateFormData(localData);
//     handleTab('tab3');
//   };

//   const handleBack = () => {
//     handleTab('tab1');
//   };

//   return (
//     <IonGrid style={{paddingBottom:"4em"}}> 
//       <IonRow>
//         <IonCol class='text-left  mx-auto'>
// <div className='h-[60em] text-left  mx-auto'>
//           <IonLabel className="mont-medium text-lg font-bold">
//             Artist Statement
//           </IonLabel>

//           <IonLabel className="mont-medium mt-6 block">
//             What would make a writing space meaningful for you?
//           </IonLabel>
//           <textarea
//             value={localData.whyApply}
//             onChange={e =>
//               setLocalData(prev => ({ ...prev, whyApply: e.target.value }))
//             }
//             rows={4}
//             className="w-[100%] border bg-cream border-emerald-400 border-1 text-emerald-800  rounded-xl p-3 mt-2"
//           />

//           <IonLabel className="mont-medium mt-6 block">
//             What do you look for in a writing community?
//           </IonLabel>
//           <textarea
//             value={localData.communityNeeds}
//             onChange={e =>
//               setLocalData(prev => ({ ...prev, communityNeeds: e.target.value }))
//             }
//             rows={4}
//             className="w-[100%] border bg-cream text-emerald-800  border-emerald-400 rounded-xl p-3 mt-2"
//           />

//           <IonRow className="flex justify-between mt-8">
//          <div onClick={handleBack} className="btn-container my-auto btn bg-emerald-700 border-none rounded-full" >
//             <IonText  className="emerald-gradient-text-btn text-white text-[0.8rem] text-[1rem]" style={{ width: '100%' }}>
//               Back
//              </IonText>
//           </div>
//            <div onClick={handleNext} className="btn-container my-auto btn bg-emerald-700 border-none rounded-full" >
//             <IonText  className="emerald-gradient-text-btn text-white text-[0.8rem] text-[1rem]" style={{ width: '100%' }}>
//               Next Step
//              </IonText>
//           </div>
//           </IonRow>
// </div>
//         </IonCol>
//       </IonRow>
//     </IonGrid>
//   );
// };


//   const Step3 = ({ formData, updateFormData, handleTab }) => {
//     const toggleGenre = (genre) => {
//       let newSelectedGenres;
//       if (formData.selectedGenres.includes(genre)) {
//         newSelectedGenres = formData.selectedGenres.filter(g => g !== genre);
//       } else {
//         newSelectedGenres = [...formData.selectedGenres, genre];
//       }
//       updateFormData({ selectedGenres: newSelectedGenres });
//     };
//     const handleBack = () => {
//       handleTab("tab2");
//     };

//     const handleNext = () => {
//       handleTab("tab4");
//     };

//     const selectedGenres = formData.selectedGenres || [];
//     const otherGenre = formData.otherGenre || "";
//     const comfortLevel = formData.comfortLevel;
//     const feedbackFrequency = formData.feedbackFrequency;

//     return (
//       <IonGrid style={{paddingBottom:"4em"}}>
//         <IonRow>
//           <IonCol >
//             <IonLabel className="mont-medium" color="success" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
//               What genres do you write in?
//             </IonLabel>
//             <IonGrid>
//               <IonRow className="ion-justify-content-start ion-align-items-center ion-padding-vertical" style={{ gap: '0.5rem' }}>
//                 {genres.map((genre, i) => {
//                   const selected = selectedGenres.includes(genre);
//                   return (
//                     <div
//                       key={i}
//                       className={`
//                         cursor-pointer 
//                         rounded-full 
//                         border 
//                         border-emerald-500 
//                         py-1 px-4 
//                         text-center 
//                         transition-colors duration-300 
//                         ${selected ? 'bg-emerald-500 text-white' : 'bg-transparent text-emerald-600 hover:bg-emerald-200'}
//                       `}
//                       onClick={() => toggleGenre(genre)}
//                     >
//                       <IonText className="open-sans-medium select-none">{genre}</IonText>
//                     </div>
//                   );
//                 })}
//               </IonRow>
//             </IonGrid>

//             {selectedGenres.includes("Other") && (
//               <IonInput
              
//                 placeholder="Please specify"
//                 value={otherGenre}
//                 onIonInput={e => updateFormData({ otherGenre: e.target.value  })}
//                 color="success"
//                 className="ion-margin-top"
//               />
//             )}

//             <ComfortLevelSelector
//               comfortLevel={comfortLevel}
//               setComfortLevel={val => updateFormData({ comfortLevel: val })}
//             />
//             <FeedbackFrequencySelector
//               feedbackFrequency={feedbackFrequency}
//               setFeedbackFrequency={val => updateFormData({ feedbackFrequency: val })}
//             />
//           <IonRow className='flex justify-between mt-8'>
//             <div className="btn bg-emerald-700 rounded-full px-6 py-2">
//               <IonText onClick={handleBack} className="text-white text-lg">
//                 Back
//               </IonText>
//             </div>
//             <div className="btn bg-emerald-700 rounded-full px-6 py-2">
//               <IonText onClick={handleNext} className="text-white text-lg">
//                 Next Step
//               </IonText>
//             </div>
//           </IonRow>
      
//           </IonCol>
//         </IonRow>
//       </IonGrid>
//     );
//   };

// const Step4 = ({ formData, updateFormData, onSave,handleTab }) => {
//   // Local state for this step
//   const [localData, setLocalData] = useState({
//     workshopPreference: formData.workshopPreference || "both",
//     howFindOut: formData.howFindOut || "",
//     platformFeatures: formData.platformFeatures || "",
//   });

//   const handleSubmit = () => {
//     // Push local state to parent before submitting
//     updateFormData(localData);
//     onSave();
//   };
//     const handleBack = () => {
//       handleTab("tab3");
//     };
//   return (
// <IonGrid style={{paddingBottom:"4em"}}>
//       <IonCol className="text-left ion-padding">

//         {/* Workshop Preference */}
//         <IonLabel className="mont-medium font-bold block mb-2">
//           Would you prefer in-person workshops, online, or both?
//         </IonLabel>
//         <WorkshopPreferenceSelector
//           workshopPreference={localData.workshopPreference}
//           setWorkshopPreference={val =>
//             setLocalData(prev => ({ ...prev, workshopPreference: val }))
//           }
//         />

//         {/* How did you find out? */}
//         <IonLabel className="mont-medium font-bold block mt-6 mb-2">
//           How did you find out about Plumbum?
//         </IonLabel>
//         <textarea
//           rows={4}
//           //  style={{ "--background": "#f4f4e0" }}
//           value={localData.howFindOut}
//           onChange={e =>
//             setLocalData(prev => ({ ...prev, howFindOut: e.target.value }))
//           }
//           placeholder="e.g., social media, friend, workshop"
//           className="w-[100%] bg-cream text-emerald-800  border border-emerald-400 rounded-xl p-3"
//         />

//         {/* Platform Features */}
//         <IonLabel className="mont-medium font-bold block mt-6 mb-2">
//           What features would make a writing platform most valuable to you?
//         </IonLabel>
//         <textarea
   
//           rows={4}
//           value={localData.platformFeatures}
//           onChange={e =>
//             setLocalData(prev => ({ ...prev, platformFeatures: e.target.value }))
//           }
//           placeholder="e.g., peer reviews, prompts, community groups"
//           className="w-[100%] border  bg-cream text-emerald-800 border-emerald-400 rounded-xl p-3"
//         />
// <div className='flex flex-row justify-between my-8'>
//         {/* Apply Button */}
//          <div onClick={handleBack} className="btn-container my-auto btn bg-emerald-700 border-none rounded-full" >
//             <IonText  className="emerald-gradient-text-btn text-white text-[0.8rem] text-[1rem]" style={{ width: '100%' }}>
//               Back
//              </IonText>
//           </div>
//         {/* <div className="btn-container text-right "> */}
//           <IonText
//             onClick={handleSubmit}
//             className="emerald-gradient-text-btn text-lg btn bg-emerald-600 rounded-full text-white px-6 py-2"
//             style={{
//               opacity: validateEmail(formData.email) ? 1 : 0.6,
//               pointerEvents: validateEmail(formData.email) ? "auto" : "none",
//             }}
//           >
//             Apply
//           </IonText>
//           </div>
       

//       </IonCol>
//     </IonGrid>
//   );
// };
// const Why = ({ handleTab, nav }) => {
//   return (
//     <div className='text-center py-8'>
//     <IonGrid  className="fade-in">
//       <IonRow className="justify-center">
//         <IonCol size="12" sizeMd="8" className="text-left">
//           <div className="flex justify-center mb-4">
//             <img
//               src={logo}
//               alt="Plumbum Logo"
//               className="rounded-lg"
//               style={{ maxHeight: "10em" }}
//             />
//           </div>

//           <IonText className="lora-medium block">
//             <h2 className="text-2xl font-bold mb-2">What is Plumbum?</h2>
//             <ul className="list-disc pl-6 space-y-2 text-[1rem]">
//               <li>
//                 <strong>Writer-Focused:</strong> A space made for writers to
//                 grow, get feedback, and share their work — all in one place.
//               </li>
//               <li>
//                 <strong>Community First:</strong> Built from live workshops and
//                 honest conversations, not algorithms.
//               </li>
//               <li>
//                 <strong>Discovery Through People:</strong> Find new stories and
//                 voices through trust and interaction, not trends.
//               </li>
//               <li>
//                 <strong>Hybrid by Design:</strong> We mix feedback,
//                 self-promotion, and curation — because writers need all three.
//               </li>
//             </ul>

//             <h2 className="text-2xl font-bold mt-8 mb-2">Why Join?</h2>
//             <ul className="list-disc pl-6 space-y-2 text-[1rem]">
//               <li>
//                 <strong>Real Feedback:</strong> Thoughtful input from people who
//                 care about craft, not clout.
//               </li>
//               <li>
//                 <strong>Creative Momentum:</strong> Stay in motion with events,
//                 prompts, and people who show up.
//               </li>
//               <li>
//                 <strong>Supportive Culture:</strong> Built slow and small on
//                 purpose, so we protect the vibe.
//               </li>
//               <li>
//                 <strong>Self & Story Promotion:</strong> A space where sharing
//                 your work doesn’t feel awkward — it’s expected.
//               </li>
//             </ul>
//           </IonText>
//          <IonRow className='flex mx-auto w-[100%] mx-auto justify-between'> 
//             <div onClick={()=>router.push(Paths.login())} className='btn my-auto bg-transparent mt-4 border-none '><IonText  className=" text-emerald-800 text-[1.3rem]" style={{ width: '100%' }}>
//                  Log In
//              </IonText></div>
      
//         <div onClick={handleTab} className="btn-container my-auto btn bg-emerald-700 border-none rounded-full" >
//             <IonText  className="emerald-gradient-text-btn text-white text-[0.8rem] text-[1rem]" style={{ width: '100%' }}>
//               Next Step
//              </IonText>
//           </div></IonRow>
        
//         </IonCol>
//       </IonRow>
//     </IonGrid>
//     </div>
//   );
// };



//   const MyTabs = () => (
//     <>
//       <div className=" text-center my-12 mx-auto sm:w-[40em]">
//         {[1, 2, 3, 4].map((tabNum) => (
//           <IonText
//             key={tabNum}
//             className={`tab-btn ${activeTab === `tab${tabNum}` ? 'tab-active' : ''} emerald-gradient-text-btn`}
//             style={{
//               margin: '0 0.2em',
//               // cursor: 'pointer',
//               padding: '0.5rem 0.75rem',
//               userSelect: 'none',
//               borderRadius: '9999px',
//               display: 'inline-block',
//               fontWeight: activeTab === `tab${tabNum}` ? 'bold' : 'normal',
//               opacity: activeTab === `tab${tabNum}` ? 1 : 0.6,
//             }}
//             onClick={() => setActiveTab(`tab${tabNum}`)}
//           >
//             {tabNum}
//           </IonText>
//         ))}
//       </div>

//       <div className="text-center mx-auto max-w-[100vw] sm:w-[50rem]">
//         {activeTab === 'tab0' && <Why handleTab={(tab) => setActiveTab('tab1')} />}
//         {activeTab === 'tab1' && <Step1 formData={formData} updateFormData={updateFormData} handleTab={(tab) => setActiveTab(tab)} />}
//         {activeTab === 'tab2' && <Step2 formData={formData} updateFormData={updateFormData} handleTab={(tab) => setActiveTab(tab)} />}
//         {activeTab === 'tab3' && <Step3 formData={formData} updateFormData={updateFormData} handleTab={(tab) => setActiveTab(tab)} />}
//         {activeTab === 'tab4' && <Step4 formData={formData} updateFormData={updateFormData} onSave={onClickApply}  handleTab={(tab) => setActiveTab(tab)} />}
//         {activeTab === 'tab5' && user && <ThankYou user={user} />}
//       </div>
//     </>
  
//   );

//   return (
// <IonContent   style={{ "--background": "#f4f4e0" }} fullscreen={true} scrollY={true}>
//   <div className='pt-8 pb-12'>
//           {user ? <ThankYou user={user} /> : <MyTabs />}
//     </div>
//   </IonContent>
//   );
// }

// // Supporting components also in the same file

// function ComfortLevelSelector({ comfortLevel, setComfortLevel }) {
//   const levels = [1, 2, 3, 4, 5];

//   return (
//     <IonCol className="pt-4">
//       <IonLabel
//         className="mont-medium"
//         color="success"
//         style={{ fontWeight: 'bold', marginTop: '1rem', display: 'block' }}
//       >
//         How comfortable are you sharing your work with others?
//       </IonLabel>
// <div>
//       <IonGrid style={{ marginTop: '1rem' }}>
//         <IonRow className="ion-justify-content-center" style={{ gap: '0.5rem' }}>
//           {levels.map((level) => (
//             <IonCol size="auto" key={level}>
//               <div
//                 onClick={() => setComfortLevel(level)}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '0.75rem 1rem',
//                   borderRadius: '9999px',
//                   userSelect: 'none',
//                   backgroundColor: comfortLevel === level ? '#059669' : 'transparent', // emerald-600 bg if selected
//                   color: comfortLevel === level ? 'white' : '#065f46', // white text if selected else emerald-800
//                   fontWeight: comfortLevel === level ? '700' : '500',
//                   transition: 'background-color 0.3s, color 0.3s',
//                   boxShadow: comfortLevel === level ? '0 2px 6px rgba(5, 150, 105, 0.5)' : 'none',
//                   textAlign: 'center',
//                   minWidth: '2.5rem',
//                 }}
//               >
//                 <IonText className="open-sans-medium">{level}</IonText>
//               </div>
//             </IonCol>
//           ))}
//         </IonRow>
//       </IonGrid>
//       </div>
//     </IonCol>
//   );
// }

// const FeedbackFrequencySelector = ({ feedbackFrequency, setFeedbackFrequency }) => {
//   const options = [
//     { label: 'Daily', value: 'daily' },
//     { label: 'Weekly', value: 'weekly' },
//     { label: 'Monthly', value: 'monthly' },
//     { label: 'Occasionally', value: 'occasionally' },
//     { label: 'Rarely', value: 'rarely' },
//   ];

//   return (
//     <>
//       <IonLabel
//         className="mont-medium"
//         color="success"
//         style={{ fontWeight: 'bold', marginTop: '1rem' }}
//       >
//         How often do you seek feedback on your writing?
//       </IonLabel>
//       <div className="ion-margin-top flex justify-center flex-wrap gap-2">
//         {options.map(option => {
//           const selected = feedbackFrequency === option.value;
//           return (
//             <div
//               key={option.value}
//               onClick={() => setFeedbackFrequency(option.value)}
//               className={`cursor-pointer rounded-full min-w-max px-6 py-2 flex items-center justify-center select-none ${
//                 selected
//                   ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold shadow-md'
//                   : 'bg-transparent text-emerald-700 hover:bg-emerald-200'
//               }`}
//               role="button"
//               tabIndex={0}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   setFeedbackFrequency(option.value);
//                 }
//               }}
//             >
//               <IonText className="open-sans-medium text-center">{option.label}</IonText>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// const WorkshopPreferenceSelector = ({ workshopPreference, setWorkshopPreference }) => {
//   const options = [
//     { label: 'In-person', value: 'in-person' },
//     { label: 'Online', value: 'online' },
//     { label: 'Both', value: 'both' },
//   ];

//   return (

//     <>
//       <IonLabel
//         // className="mont-medium"
//         color="success"
//         // style={{ fontWeight: 'bold', marginTop: '1rem' }}
//       >
//         Would you prefer in-person workshops, online, or both?
//       </IonLabel>
//       <div className="ion-margin-top flex justify-center flex-wrap gap-2">
//         {options.map(option => {
//           const selected = workshopPreference === option.value;
//           return (
//             <div
//               key={option.value}
//               onClick={() => setWorkshopPreference(option.value)}
//               className={`cursor-pointer rounded-full min-w-max px-6 py-2 flex items-center justify-center select-none ${
//                 selected
//                   ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold shadow-md'
//                   : 'bg-transparent text-emerald-700 hover:bg-emerald-200'
//               }`}
//               role="button"
//               tabIndex={0}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   setWorkshopPreference(option.value);
//                 }
//               }}
//             >
//               <IonText className="open-sans-medium text-center">{option.label}</IonText>
//             </div>
//           );
//         })}
//       </div>
//     </>
//     // </IonContent>
//   );
// };
import { Preferences } from '@capacitor/preferences';
import { IonContent, IonLabel } from '@ionic/react';

import "../App.css";
import { useState, useContext, useEffect } from 'react';
import Context from '../context';
import Paths from '../core/paths';
import authRepo from '../data/authRepo';
import ThankYou from './auth/ThankYou';
import logo from "../images/logo/icon.png";
import { useSelector } from 'react-redux';

/* =========================
   DESIGN TOKENS
========================= */

const primaryButton =
  "w-full bg-emerald-600 text-white rounded-2xl py-3 font-semibold active:scale-[0.98] transition";

const secondaryButton =
  "w-full bg-emerald-50 text-emerald-700 rounded-2xl py-3 font-semibold";

const card =
  "bg-cream border border-emerald-100 rounded-2xl p-5 flex flex-col gap-2";

/* FORCE COLUMN LAYOUT ALWAYS */
const question =
  "text-emerald-700 text-sm font-medium";

const input =
  "w-full text-[1.05rem] outline-none bg-transparent text-emerald-900 placeholder-emerald-400";

/* =========================
   ANIMATION
========================= */

function StepTransition({ step, children }) {
  return (
    <div
      key={step}
      style={{ animation: "fadeSlide 0.35s ease-out" }}
    >
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

  const [activeTab, setActiveTab] = useState('tab0');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    igHandle: "",
    whyApply: "",
    communityNeeds: "",
    howFindOut: "",
    selectedGenres: [],
    otherGenre: "",
  });

  useEffect(() => {
    if (currentProfile?.id) setUser(currentProfile);
  }, [currentProfile]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const updateFormData = (data) =>
    setFormData(prev => ({ ...prev, ...data }));

  /* =========================
     APPLY
========================= */

  const onClickApply = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const form = {
        ...formData,
        email: formData.email?.toLowerCase(),
        genres: formData.selectedGenres.includes("Other")
          ? [...formData.selectedGenres.filter(g => g !== "Other"), formData.otherGenre]
          : formData.selectedGenres,
      };

      const data = await authRepo.apply(form);

      await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });

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
        <div className="p-4 flex-col space-y-4 bg-cream min-h-screen">

          <img src={logo} className="w-20 mx-auto mb-4" />

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {/* NAME */}
          <div className={card}>
            <label className={question}>Name</label>
            <input
              className={input}
              value={local.fullName}
              onChange={e => setLocal({ ...local, fullName: e.target.value })}
              placeholder="Jane Doe"
            />
          </div>

          {/* EMAIL */}
          <div className={card}>
            <label className={question}>Email *</label>
            <input
              className={input}
              value={local.email}
              onChange={e => setLocal({ ...local, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          {/* IG */}
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
     STEP 2 (FIXED COLUMN LAYOUT)
========================= */

  const Step2 = () => {
    const [local, setLocal] = useState(formData);

    return (
      <StepTransition step="tab2">
        <div className="p-4f flex-col space-y-6 bg-cream">

          {/* QUESTION ABOVE INPUT ALWAYS */}
          <div className={card}>
            <label className={question}>
              What would make a writing space meaningful?
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
              What do you look for in a writing community?
            </label>

            <textarea
              className={input}
              rows={4}
              value={local.communityNeeds}
              onChange={e => setLocal({ ...local, communityNeeds: e.target.value })}
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

  const Step3 = () => {
    const toggle = (g) => {
      const exists = formData.selectedGenres.includes(g);
      const updated = exists
        ? formData.selectedGenres.filter(x => x !== g)
        : [...formData.selectedGenres, g];

      updateFormData({ selectedGenres: updated });
    };

    return (
      <StepTransition step="tab3">
        <div className="p-4 flex-col space-y-4 bg-cream">

          <div className={card}>
            <label className={question}>Genres</label>

            <div className="flex flex-wrap gap-2 mt-2">
              {["Fiction", "Poetry", "Non-fiction", "Fantasy", "Other"].map(g => (
                <div
                  key={g}
                  onClick={() => toggle(g)}
                  className={`px-4 py-2 rounded-full border ${
                    formData.selectedGenres.includes(g)
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {g}
                </div>
              ))}
            </div>
          </div>

          <button className={primaryButton} onClick={() => setActiveTab("tab4")}>
            Continue
          </button>

        </div>
      </StepTransition>
    );
  };

  /* =========================
     STEP 4
========================= */

  const Step4 = () => {
    const [local, setLocal] = useState(formData);

    const submit = async () => {
      updateFormData(local);
      await onClickApply();
    };

    return (
      <StepTransition step="tab4">
        <div className="p-4 space-y-4 bg-cream">

          <div className={card}>
            <label className={question}>How did you find us?</label>

            <textarea
              className={input}
              rows={3}
              value={local.howFindOut}
              onChange={e => setLocal({ ...local, howFindOut: e.target.value })}
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

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

  /* =========================
     SUCCESS STATE (FIXED)
========================= */

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6">
        <ThankYou user={user} />
      </div>
    );
  }

  /* =========================
     RENDER
========================= */

  return (
    <IonContent style={{ "--background": "#f4f4e0" ,"--padding-bottom":"10em"}} fullscreen>
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