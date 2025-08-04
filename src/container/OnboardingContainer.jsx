import { Preferences } from '@capacitor/preferences';
import { useNavigate } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonTextarea,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonList,
  IonItem,
  IonButton,
  IonText,
} from '@ionic/react';

import { useState, useContext, useEffect } from 'react';
import { debounce } from 'lodash';

import Context from '../context';
import Paths from '../core/paths';
import authRepo from '../data/authRepo';
import ThankYou from './auth/ThankYou';
import logo from "../images/logo/logo-green.png";

export default function OnboardingContainer(props) {
  const navigate = useNavigate();
  const { seo, setSeo, error, setError } = useContext(Context);

  const genres = [
    "Fiction", "Non-fiction", "Poetry", "Drama/Playwriting", "Screenwriting",
    "Flash Fiction", "Memoir", "Short Stories", "Fantasy", "Science Fiction",
    "Horror", "Mystery/Thriller", "Romance", "Young Adult", "Children's Literature",
    "Historical Fiction", "Satire/Humor", "Experimental/Hybrid Forms", "Other"
  ];

  const [activeTab, setActiveTab] = useState('tab0');
  const [formData, setFormData] = useState({
    igHandle: "",
    fullName: "",
    email: "",
    whyApply: "",
    howFindOut: "",
    otherGenre: "",
    communityNeeds: "",
    workshopPreference: "both",
    feedbackFrequency: "daily",
    selectedGenres: [],
    comfortLevel: 0,
    platformFeatures: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    setSeo(prev => ({ ...prev, title: "Plumbum (Onboarding)" }));
  }, [setSeo]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const finishOnboarding = async () => {
    await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });
    navigate(Paths.myProfile(), { replace: true });
  };

  const onClickApply = debounce(async () => {
    if (validateEmail(formData.email)) {
      const form = {
        ...formData,
        email: formData.email.toLowerCase(),
        genres: formData.selectedGenres.includes("Other")
          ? [...formData.selectedGenres.filter(g => g !== "Other"), formData.otherGenre]
          : formData.selectedGenres,
      };
      try {
        let data;
        if (window.location.pathname.includes("newsletter")) {
          data = await authRepo.applyFromNewsletter(form);
        } else {
          data = await authRepo.apply(form);
        }
        await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });
        setUser(data?.user ?? data);
      } catch (err) {
        setUser(err);
      }
    }
  }, 200);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const Step1 = ({ onSave, handleTab }) => {
    const [igHandle, setIgHandle] = useState(formData.igHandle);
    const [fullName, setFullName] = useState(formData.fullName);
    const [email, setEmail] = useState(formData.email);

    const handleNext = () => {
      onSave({ igHandle, fullName, email });
      handleTab();
    };

    return (
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText color="success" className="lora-bold">* Required</IonText>
           <div>
            <IonText className="ion-text-center" color="success" style={{ fontSize: '1.5rem', fontWeight:'bold' }}>
              Interest Form
            </IonText>
            </div>
            <div>
            <IonText className="ion-text-center" color="success">
              We’re building a space that’s nurturing, focused, and kind. This short application helps us make sure it’s the right fit — for you, and for the group.
            </IonText>
            </div>
            <IonItem fill="outline" color="success" className="my-4">
              <IonLabel position="floating" className="mont-medium">Preferred Name</IonLabel>
              <IonInput
                value={fullName}
                onIonChange={e => setFullName(e.detail.value)}
                placeholder="Jon Doe"
                clearInput
              />
            </IonItem>

            <IonItem fill="outline" color="success" className="my-4">
              <IonLabel position="floating" className="mont-medium">* Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value)}
                placeholder="email@example.com"
                clearInput
              />
            </IonItem>
            {email && !validateEmail(email) && (
              <IonText color="danger" style={{ fontSize: '0.8rem' }}>
                Please use a valid email
              </IonText>
            )}

            <IonItem fill="outline" color="success" className="my-4">
              <IonLabel position="floating" className="mont-medium">IG Handle</IonLabel>
              <IonInput
                value={igHandle}
                onIonChange={e => setIgHandle(e.detail.value)}
                placeholder="*****"
                clearInput
              />
            </IonItem>

            <div className="btn-container">
              <IonText onClick={handleNext} className="emerald-gradient-text-btn">
                Next Step
              </IonText>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const Step2 = ({ onSave, handleTab }) => {
    const [whyApply, setWhyApply] = useState(formData.whyApply);
    const [communityNeeds, setCommunityNeeds] = useState(formData.communityNeeds);

    const handleNext = () => {
      onSave({ whyApply, communityNeeds });
      handleTab();
    };

    return (
      <IonGrid>
        <IonRow>
          <IonCol>
            <div>
            <IonLabel className="mont-medium" color="success" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              Artist Statement
            </IonLabel>
            </div>
            <IonLabel className="mont-medium" color="success" style={{ marginTop: '1rem' }}>
              What would make a writing space meaningful for you?
            </IonLabel>
            <IonTextarea
              value={whyApply}
              onIonChange={e => setWhyApply(e.detail.value)}
              placeholder="Tell us what you'd love to see or experience in a space for writers like you."
              rows={4}
              cols={58}
              color="success"
              className="open-sans-medium w-[90%]"
            />

            <IonLabel className="mont-medium" color="success" style={{ marginTop: '1rem' }}>
              What do you look for in a writing community?
            </IonLabel>
            <IonTextarea
              value={communityNeeds}
              onIonChange={e => setCommunityNeeds(e.detail.value)}
              rows={4}
              cols={58}
              color="success"
              className="open-sans-medium"
            />


<div className='text-right'>
          <div className="btn-container  btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0' }}>
          
            <IonText onClick={handleNext} className="emerald-gradient-text-btn text-white text-[1.3rem]" style={{ width: '100%' }}>
              Next Step
            </IonText>
            </div>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const Step3 = ({ onSave, handleTab }) => {
    const [selectedGenres, setSelectedGenres] = useState(formData.selectedGenres);
    const [otherGenre, setOtherGenre] = useState(formData.otherGenre);
    const [comfortLevel, setComfortLevel] = useState(formData.comfortLevel);
    const [feedbackFrequency, setFeedbackFrequency] = useState(formData.feedbackFrequency);

    const toggleGenre = (genre) => {
      setSelectedGenres(prev =>
        prev.includes(genre)
          ? prev.filter(g => g !== genre)
          : [...prev, genre]
      );
    };

    const handleNext = () => {
      onSave({ selectedGenres, otherGenre, comfortLevel, feedbackFrequency });
      handleTab();
    };

    return (
      <IonGrid>
        <IonRow>
          <IonCol>
           
            {/*  <IonLabel className="mont-medium" color="success max-h-[20em]" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              What genres do you write in?
            </IonLabel><IonList>
  {genres.map((genre, i) => (
    <IonItem key={i} detail={false}>
      <IonRow>
      <IonCheckbox
     
        checked={selectedGenres.includes(genre)}
        onIonChange={() => toggleGenre(genre)}
       
      />
      <IonLabel className="open-sans-medium" color="success">{genre}</IonLabel>
      </IonRow>
    </IonItem>
  ))}
</IonList> */}
<IonLabel className="mont-medium" color="success" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
  What genres do you write in?
</IonLabel>
<IonGrid>
  <IonRow className="ion-justify-content-start ion-align-items-center ion-padding-vertical" style={{ gap: '0.5rem' }}>
    {genres.map((genre, i) => {
      const selected = selectedGenres.includes(genre);
      return (
        <div
          key={i}
          className={`
            cursor-pointer 
            rounded-full 
            border 
            border-emerald-500 
            py-2 px-4 
            text-center 
            transition-colors duration-300 
            ${selected ? 'bg-emerald-500 text-white' : 'bg-transparent text-emerald-600 hover:bg-emerald-200'}
          `}
          onClick={() => toggleGenre(genre)}
        >
          <IonText className="open-sans-medium select-none">{genre}</IonText>
        </div>
      );
    })}
  </IonRow>
</IonGrid>

            {selectedGenres.includes("Other") && (
              <IonInput
              
                placeholder="Please specify"
                value={otherGenre}
                onIonChange={e => setOtherGenre(e.detail.value)}
                color="success"
                className="ion-margin-top"
              />
            )}

            <IonLabel className="mont-medium" color="success" style={{ fontWeight: 'bold', marginTop: '1rem' }}>
              How comfortable are you sharing your work with others?
            </IonLabel>
            <IonInput
              type="range"
              min={1}
              max={5}
              step={1}
              value={comfortLevel}
              onIonChange={e => setComfortLevel(parseInt(e.detail.value))}
              color="success"
            />
            <IonGrid>
              <IonRow className="ion-justify-content-between ion-padding-horizontal">
                {[1, 2, 3, 4, 5].map((n) => (
                  <IonCol size="auto" key={n} className="ion-text-center" color="success">
                    <IonText>{n}</IonText>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>

            <IonLabel className="mont-medium" color="success" style={{ fontWeight: 'bold', marginTop: '1rem' }}>
              How often do you seek feedback on your writing?
            </IonLabel>
            <IonSelect
              value={feedbackFrequency}
              onIonChange={e => setFeedbackFrequency(e.detail.value)}
              interface="popover"
              className="ion-margin-top"
              color="success"
            >
              <IonSelectOption value="daily">Daily</IonSelectOption>
              <IonSelectOption value="weekly">Weekly</IonSelectOption>
              <IonSelectOption value="monthly">Monthly</IonSelectOption>
              <IonSelectOption value="occasionally">Occasionally</IonSelectOption>
              <IonSelectOption value="rarely">Rarely</IonSelectOption>
            </IonSelect>
            <div className='text-right'>
          <div className="btn-container  btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0' }}>
          
            <IonText onClick={handleNext} className="emerald-gradient-text-btn text-white text-[1.3rem]" style={{ width: '100%' }}>
              Next Step
            </IonText>
            </div>
            </div>
            {/* <div className="btn-container">
              <IonText onClick={handleNext} className="emerald-gradient-text-btn">
                Next Step
              </IonText>
            </div> */}
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const Step4 = ({ onSave }) => {
    const [workshopPreference, setWorkshopPreference] = useState(formData.workshopPreference);
    const [howFindOut, setHowFindOut] = useState(formData.howFindOut);
    const [platformFeatures, setPlatformFeatures] = useState(formData.platformFeatures);

    const handleSubmit = () => {
      onSave({ workshopPreference, howFindOut, platformFeatures });
    };

    return (
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonLabel className="mont-medium" color="success">
              Would you prefer in-person workshops, online, or both?
            </IonLabel>
            <IonSelect
              value={workshopPreference}
              onIonChange={e => setWorkshopPreference(e.detail.value)}
              interface="popover"
              color="success"
            >
              <IonSelectOption value="in-person">In-person</IonSelectOption>
              <IonSelectOption value="online">Online</IonSelectOption>
              <IonSelectOption value="both">Both</IonSelectOption>
            </IonSelect>

            <IonLabel className="mont-medium" color="success" style={{ marginTop: '1rem' }}>
              How did you find out about Plumbum?
            </IonLabel>
            <IonInput
              value={howFindOut}
              onIonChange={e => setHowFindOut(e.detail.value)}
              color="success"
              className="ion-margin-bottom"
            />

            <IonLabel className="mont-medium" color="success" style={{ marginTop: '1rem' }}>
              What features would make a writing platform most valuable to you?
            </IonLabel>
            <IonTextarea
              value={platformFeatures}
              onIonChange={e => setPlatformFeatures(e.detail.value)}
              color="success"
            />

            <div className="btn-container">
              <IonText
                onClick={handleSubmit}
                className="emerald-gradient-text-btn"
                style={{
                  opacity: validateEmail(formData.email) ? 1 : 0.6,
                  pointerEvents: validateEmail(formData.email) ? 'auto' : 'none',
                }}
              >
                Apply
              </IonText>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const Why = ({ handleTab }) => (
    <IonGrid className="ion-padding-bottom">
      <IonRow>
        <IonCol>
          <img src={logo} alt="Plumbum Logo" style={{ maxHeight: '10em', display: 'block', margin: '0 auto', borderRadius: '0.5em' }} />
          <IonText className="lora-medium" color="success">
            <h2 style={{ textAlign: 'center' }}>What is Plumbum?</h2>
            <ul style={{ paddingLeft: '1.5em', marginTop: '1em' }}>
              <li><strong>Writer-Focused:</strong> A space made for writers to grow, get feedback, and share their work — all in one place.</li>
              <li><strong>Community First:</strong> Built from live workshops and honest conversations, not algorithms.</li>
              <li><strong>Discovery Through People:</strong> Find new stories and voices through trust and interaction, not trends.</li>
              <li><strong>Hybrid by Design:</strong> We mix feedback, self-promotion, and curation — because writers need all three.</li>
            </ul>

            <h2 style={{ textAlign: 'center', marginTop: '2em' }}>Why Join?</h2>
            <ul style={{ paddingLeft: '1.5em', marginTop: '1em' }}>
              <li><strong>Real Feedback:</strong> Thoughtful input from people who care about craft, not clout.</li>
              <li><strong>Creative Momentum:</strong> Stay in motion with events, prompts, and people who show up.</li>
              <li><strong>Supportive Culture:</strong> Built slow and small on purpose, so we protect the vibe.</li>
              <li><strong>Self & Story Promotion:</strong> A space where sharing your work doesn’t feel awkward — it’s expected.</li>
            </ul>
          </IonText>
<div className='text-right'>
          <div className="btn-container  btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0' }}>
            <IonText onClick={handleTab} className="emerald-gradient-text-btn text-white text-[1.3rem]" style={{ width: '100%' }}>
              Next Step
            </IonText>
          </div>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );

  const MyTabs = () => (
    <>
      <div className="ion-margin-vertical text-center ion-text-center">
        {[1, 2, 3, 4, 5].map((tabNum) => (
          <IonText
            key={tabNum}
            className={`tab-btn ${activeTab === `tab${tabNum}` ? 'tab-active' : ''} emerald-gradient-text-btn`}
            style={{
              margin: '0 0.2em',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              userSelect: 'none',
              borderRadius: '9999px',
              display: 'inline-block',
              fontWeight: activeTab === `tab${tabNum}` ? 'bold' : 'normal',
              opacity: activeTab === `tab${tabNum}` ? 1 : 0.6,
            }}
            onClick={() => setActiveTab(`tab${tabNum}`)}
          >
            {tabNum}
          </IonText>
        ))}
      </div>

      <div className="ion-padding-horizontal">
        {activeTab === 'tab0' && <Why handleTab={() => setActiveTab('tab1')} />}
        {activeTab === 'tab1' && <Step1 formData={formData} onSave={updateFormData} handleTab={() => setActiveTab('tab2')} />}
        {activeTab === 'tab2' && <Step2 formData={formData} onSave={updateFormData} handleTab={() => setActiveTab('tab3')} />}
        {activeTab === 'tab3' && <Step3 formData={formData} onSave={updateFormData} handleTab={() => setActiveTab('tab4')} />}
        {activeTab === 'tab4' && <Step4 formData={formData} onSave={(data) => { updateFormData(data); onClickApply(); }} handleTab={() => setActiveTab('tab5')} />}
        {activeTab === 'tab5' && user && <ThankYou user={user} />}
      </div>
    </>
  );

  return (
    <IonPage className='w-[100%] h-[100%]'>
      <IonContent fullscreen className="ion-padding-top ion-padding-horizontal">
        <div className="ion-text-center ion-margin-top" style={{ maxWidth: '600px', margin: 'auto' }}>
          {user ? <ThankYou user={user} /> : <MyTabs />}
        </div>
      </IonContent>
    </IonPage>
  );
}


// import { Preferences } from '@capacitor/preferences';
// import { useNavigate } from 'react-router-dom';
// import { useState, useContext } from 'react';
// import Context from '../context';
// import Paths from '../core/paths';
// import { useCallback } from 'react';
// import { useMediaQuery } from 'react-responsive';
// import { useEffect } from 'react';
// import { debounce } from 'lodash';
// import authRepo from '../data/authRepo'
// import ThankYou from './auth/ThankYou'
// import logo from "../images/logo/logo-green.png"
// export default function OnboardingContainer(props) {
//   const navigate = useNavigate();
  
//   const finishOnboarding = async () => {
//     onClickApply(async ()=>{
//        await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });
//       navigate(Paths.myProfile(), { replace: true });
//     })
   
//   };

//   const [activeTab, setActiveTab] = useState('tab0');
//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//   };

//   const genres = [
//     "Fiction", "Non-fiction", "Poetry", "Drama/Playwriting", "Screenwriting",
//     "Flash Fiction", "Memoir", "Short Stories", "Fantasy", "Science Fiction",
//     "Horror", "Mystery/Thriller", "Romance", "Young Adult", "Children's Literature",
//     "Historical Fiction", "Satire/Humor", "Experimental/Hybrid Forms", "Other"
//   ];



//     const isNotPhone = useMediaQuery({ query: '(min-width: 600px)' });
//     const { seo, setSeo } = useContext(Context);
  
//     useEffect(() => {
//       let soo = seo;
//       soo.title = "Plumbum (Onboarding)";
//       setSeo(soo);
//     }, [seo, setSeo]);
  

  
//     const [formData, setFormData] = useState({
//       igHandle: "",
//       fullName: "",
//       email: "",
//       whyApply: "",
//       howFindOut: "",
//       otherGenre: "",
//       communityNeeds: "",
//       workshopPreference: "",
//       feedbackFrequency: "",
//       selectedGenres: [],
//       comfortLevel: 0,
//       platformFeatures: "",
//     });

//   const [user, setUser] = useState(null);
//   const { error, setError } = useContext(Context);
//   const [betaTest, setBetaTester] = useState([]);
//   const onClickApply =debounce(async () => {
 
//     if (validateEmail(formData.email)) {
//       const form = {
//         ...formData,
//         email: formData.email.toLowerCase(),
//         genres: formData.selectedGenres.includes("Other")
//           ? [...formData.selectedGenres.filter((g) => g !== "Other"), formData.otherGenre]
//           : formData.selectedGenres,
//       };

//       try {
//         let data;
//         if (location.pathname.includes("newsletter")) {
//           data = await authRepo.applyFromNewsletter(form);
//         } else {
//           data = await authRepo.apply(form);
//         }
//         await Preferences.set({ key: 'hasSeenOnboarding',value:true });
//         setUser(data?data.user:data );
//       } catch (err) {
//         setUser(err);
//       }
//     }
  
  
// authRepo.apply(formData).then(data=>{
    
// if(data.user){
// setUser(data.user)
//     }else{
      
//       setUser(data)
//     }}).catch(err=>{
//       setUser(err)
//     })},[200])
 
//   const updateFormData = (newData) => {
//     setFormData((prevData) => ({ ...prevData, ...newData }));
//   };




//   const validateEmail = (email) => {
  
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };


//   const Step1 = ({ handleTab, onSave,formData }) => {
//      const [igHandle, setIgHandle] = useState(formData.igHandle??"");
//   const [fullName, setFullName] = useState(formData.fullName??"");
//   const [email, setEmail] = useState(formData.email??"");


//     const handleStep=()=>{
//       onSave({
//           fullName: fullName,
//           email:email ,
//           igHandle: igHandle,
//         })
//         handleTab()
//     }
   

//     return (
//       <div >
//         <h6 className="text-emerald-700 lora-bold text-sm">* Required</h6>
//         <div className="w-full my-8 text-center">
//           <h3 className="mx-auto text-2xl text-emerald-700  lora-bold my-2 w-fit">Interest Form</h3>
//           <h6 className="text-md mont-medium">We’re building a space that’s nurturing, focused, and kind. This short application helps us make sure it’s the right fit — for you, and for the group.</h6>
//         </div>

//         <label className="input text-[0.8rem] rounded-full mont-medium mt-4 text-emerald-700  py-8 font-bold mb-4 lg:py-8  bg-transparent border border-emerald-700  flex items-center gap-2">
//           Preferred Name
//           <input
//             type="text"
//             className="grow pl-4 text-emerald-700  w-full  bg-transparent"
//             name="fullName"
//             value={fullName}
//             onChange={(e)=>{
//               setFullName(e.target.value)
//             }}
//             placeholder="Jon Doe"
//           />
//         </label>

//         <label className="input mt-4 mb-2 rounded-full font-bold py-8  bg-transparent border border-emerald-700  text-emerald-700  flex items-center gap-2">
//           *<h6 className="font-bold mont-medium text-[0.8rem]"> Email</h6>
//           <input
//             type="text"
//             className="grow text-emerald-700  mont-medium pl-4 w-full  bg-transparent"
//             name="email"
//             value={email}
//             onChange={(e)=>{
//               setEmail(e.target.value)
//             }}
//           />
//         </label>
//         {email.length > 0 && !validateEmail(email) ? (
//           <h6 className="text-[0.8rem] mont-medium text-red-500">Please use a valid email</h6>
//         ) : null}

//         <label className="input mt-4 rounded-full mb-8 font-bold py-8 w-[100%]  bg-transparent text-emerald-700  border border-emerald-700  text-emerald-700  flex items-center">
//           <h6 className="font-bold mont-medium text-[0.8rem]">IG Handle </h6>
//           <input
//             type="text"
//             className="grow mont-medium text-emerald-700  mx-2"
//             name="igHandle"
//             value={igHandle}
//             onChange={(e)=>{
//               setIgHandle(e.target.value)
//             }}
//             placeholder="*****"
//           />
//         </label>
//         <div className='flex '>
//           <div className='flex-1' /><button className="max-w-[20em]   bg-emerald-900 text-white text-xl rounded-full" onClick={handleStep}>Next Step</button>
//         </div>
//       </div>
//     );
//   };
//   const Step2 = ({ handleTab, onSave, data }) => {
//     const [whyApply, setWhyApply] = useState(data.whyApply);
//     const [communityNeeds, setCommunityNeeds] = useState(data.communityNeeds ?? "");

//     const handleStep = () => {
//       onSave({
//         whyApply: whyApply,
//         communityNeeds: communityNeeds,
//       });
//       handleTab();
//     };

//     return (
//       <div className='flex flex-col max-h-[70vh] '>
//         <label className="text-xl font-bold mont-medium text-emerald-700 ">Artist Statement</label>
//         <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 font-bold mt-4">
//           What would make a writing space meaningful for you?
//         </label>
//         <textarea
//           name="whyApply"
//           value={whyApply}
//           onChange={(e) => setWhyApply(e.target.value)}
//           className="textarea  bg-transparent open-sans-medium w-full text-l h-min-24 border border-emerald-700  text-emerald-700 "
//           placeholder="Tell us what you'd love to see or experience in a space for writers like you."
//         />

//         <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 font-bold mt-4">
//           What do you look for in a writing community?
//         </label>
//         <textarea
//           name="communityNeeds"
//           value={communityNeeds}
//           onChange={(e) => setCommunityNeeds(e.target.value)}
//           className="textarea  bg-transparent open-sans-medium w-full text-l  h-min-24 border border-emerald-700  text-emerald-700 "
//         />

//         <div className='flex '>
//           <div className='flex-1' /><button className="max-w-[20em]   bg-emerald-900 text-white text-xl rounded-full" onClick={handleStep}>Next Step</button>
//         </div>
//       </div>
//     );
//   };const Step3 = ({ handleTab, onSave, data }) => {
//     const [selectedGenres, setSelectedGenres] = useState(data.selectedGenres ?? []);
//     const [otherGenre, setOtherGenre] = useState(data.otherGenre ?? "");
//     const [comfortLevel, setComfortLevel] = useState(data.comfortLevel ?? 0);
//     const [feedbackFrequency, setFeedbackFrequency] = useState(data.feedbackFrequency ?? "daily");

//     const handleGenreSelection = (genre) => {
//       setSelectedGenres((prev) =>
//         prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
//       );
//     };

//     const handleStep = () => {
//       onSave({
//         selectedGenres: selectedGenres,
//         otherGenre: otherGenre,
//         comfortLevel: comfortLevel,
//         feedbackFrequency: feedbackFrequency,
//       });
//       handleTab();
//     };

//     return (
//       <div>
//         <label className="text-emerald-700  text-l  mont-medium mb-2 pb-1 font-bold mt-4">
//           What genres do you write in?
//         </label>
//         <div className="flex pt-4 flex-wrap gap-3">
//           {genres.map((genre, index) => (
//             <label key={index} className="flex items-center ">
//               <input
//                 type="checkbox"
//                 value={genre}
//                 checked={selectedGenres.includes(genre)}
//                 onChange={() => handleGenreSelection(genre)}
//                 className="checkbox mx-1 border-black border-1"
//               />
//               <span className="text-emerald-700  open-sans-medium">{genre}</span>
//             </label>
//           ))}
//         </div>
//         {selectedGenres.includes("Other") && (
//           <input
//             type="text"
//             placeholder="Please specify"
//             name="otherGenre"
//             value={otherGenre}
//             onChange={(e) => setOtherGenre(e.target.value)}
//             className=" bg-transparent border border-emerald-700 open-sans-medium py-2 text-emerald-700  text-[1rem] text-l input mt-4"
//           />
//         )}
//         <label className="text-emerald-700  pt-4 text-m mont-medium mb-2 pb-1 font-bold mt-4">
//           How comfortable are you sharing your work with others?
//         </label>
//         <div className="flex flex-col items-center gap-4">
//           {/* Slider */}
//           <input
//             type="range"
//             min="1"
//             max="5"
//             step="1"
//             name="comfortLevel"
//             value={comfortLevel}
//             onChange={(e) => setComfortLevel(parseInt(e.target.value))}
//             className="range bg-emeald-600  w-full"
//           /></div>
//         <div className="flex justify-between w-[90%] mx-auto text-sm text-emerald-700 ">
//           <span>1</span>
//           <span>2</span>
//           <span>3</span>
//           <span>4</span>
//           <span>5</span>
//         </div>
//         <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
//           How often do you seek feedback on your writing?
//         </label>
//         <select
//           name="feedbackFrequency"
//           value={feedbackFrequency}
//           onChange={(e) => setFeedbackFrequency(e.target.value)}
//           className="select  bg-transparent border rounded-full border-emerald-700  text-emerald-700  w-full text-l sm:text-xl"
//         >
//           <option defaultValue={true} value="daily">Daily</option>
//           <option value="weekly">Weekly</option>
//           <option value="monthly">Monthly</option>
//           <option value="occasionally">Occasionally</option>
//           <option value="rarely">Rarely</option>
//         </select>
//         <div className='flex '>
//           <div className='flex-1' /><button className="max-w-[20em]   bg-emerald-900 text-white text-xl rounded-full" onClick={handleStep}>Next Step</button>
//         </div>
//       </div>
//     );
//   };
//   const Step4 = ({ onSave,data }) => {
//     const [workshopPreference, setWorkshopPreference] = useState(data.workshopPreference ?? "both");
//     const [howFindOut, setHowFindOut] = useState(data.howFindOut ?? "");
//     const [platformFeatures, setPlatformFeatures] = useState(data.platformFeatures ?? "");

//     const handleSubmit = () => {
      
//       onSave({
//         workshopPreference: workshopPreference,
//         howFindOut: howFindOut,
//         platformFeatures: platformFeatures,
//       });
    
//     };

//     return (
//       <div className='flex flex-col'>
//         <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 mt-4">
//           Would you prefer in-person workshops, online, or both?
//         </label>
//         <select
//           name="workshopPreference"
//           value={workshopPreference}
//           onChange={(e) => setWorkshopPreference(e.target.value)}
//           className="select rounded-full open-sans-medium  bg-transparent border border-emerald-700  text-emerald-700  w-full text-l sm:text-xl"
//         >
//           <option value="in-person">In-person</option>
//           <option value="online">Online</option>
//           <option defaultValue={true} value="both">Both</option>
//         </select>

//         <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
//           How did you find out about Plumbum?
//         </label>
//         <input
//           name="howFindOut"
//           value={howFindOut}
//           onChange={(e) => setHowFindOut(e.target.value)}
//           className=" bg-transparent border open-sans-medium border-emerald-700  py-8 text-emerald-700 text-l sm:text-xl input"
//         />

//         <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
//           What features would make a writing platform most valuable to you?
//         </label>
//         <textarea
//           name="platformFeatures"
//           value={platformFeatures}
//           onChange={(e) => setPlatformFeatures(e.target.value)}
//           className="textarea  bg-transparent w-full open-sans-medium text-l sm:text-xl h-min-24 border border-emerald-700  text-emerald-700 "
//         />
//         <div className='flex '>
//           <div className='flex-1' />
//           <button type="submit"
//            className={`mont-medium my-8 py-4 text-2xl text-white mont-medium px-20 mx-auto rounded-full ${validateEmail(formData.email) ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-purple-400 to-gray-500"} hover:bg-green-400 font-bold border-none shadow-sm`} 
//            onClick={handleSubmit}>Apply</button>
//         </div>
//       </div>
//     );
//   };
//   const ApplySubmit = () => {
//     const handleSubmit = () => {
     
//       console.log(JSON.stringify(formData))
 
//       alert("Application submitted!");
//       finishOnboarding(); // Example of what might happen after submission
//     };

//     return (
//       <div className='flex flex-col items-center'>
//     <div className='flex items-left'>{!validateEmail(email)?<p>Email is not valid</p>:null}</div>
//         <button   className={`mont-medium my-8 py-4 text-xl text-white mont-medium w-[14em] mx-auto rounded-full ${validateEmail(email)?"bg-gradient-to-r from-emerald-400 to-emerald-500":"bg-gradient-to-r from-purple-400 to-gray-500"} hover:bg-green-400 font-bold border-none shadow-sm`} onClick={handleSubmit}>
//           Submit Application
//         </button>
//       </div>
//     );
//   };
//   const Why=({handleTab})=>{
//     return(< ><div className=' pb-36'><section className="p-4 lora-medium text-emerald-800  text-left">
//       <img className="max-h-[10em] mx-auto mb-8 rounded-lg "src={logo}/>
//     <h2 className="text-xl font-bold mb-3 text-center">What is Plumbum?</h2>
//     <ul className="list-disc pl-6 space-y-2 text-base">
//       <li>
//         <strong>Writer-Focused:</strong> A space made for writers to grow, get feedback, and share their work — all in one place.
//       </li>
//       <li>
//         <strong>Community First:</strong> Built from live workshops and honest conversations, not algorithms.
//       </li>
//       <li>
//         <strong>Discovery Through People:</strong> Find new stories and voices through trust and interaction, not trends.
//       </li>
//       <li>
//         <strong>Hybrid by Design:</strong> We mix feedback, self-promotion, and curation — because writers need all three.
//       </li>
//     </ul>
//   </section>
  
//   <section className="p-4  lora-medium text-emerald-800 text-left">
//     <h2 className="text-xl font-bold mb-3 text-center">Why Join?</h2>
//     <ul className="list-disc pl-6 space-y-2 text-base">
//       <li>
//         <strong>Real Feedback:</strong> Thoughtful input from people who care about craft, not clout.
//       </li>
//       <li>
//         <strong>Creative Momentum:</strong> Stay in motion with events, prompts, and people who show up.
//       </li>
//       <li>
//         <strong>Supportive Culture:</strong> Built slow and small on purpose, so we protect the vibe.
//       </li>
//       <li>
//         <strong>Self & Story Promotion:</strong> A space where sharing your work doesn’t feel awkward — it’s expected.
//       </li>
//     </ul>
//   </section>
//   <div className='flex'>
//   <div className='flex-1' /><button className="max-w-[20em]   bg-emerald-900 text-white text-xl rounded-full" onClick={handleTab}>Next Step</button>
//   </div>
//   </div>
//   </>)
//   }
//   const MyTabs = () => {
//     return (
//       <>
//       <div className='absolute '>
//         <div className="tabs relative top-0 flex justify-around max-w-[100vw]">
       
//           <button
//             className={`tab ${activeTab === 'tab1' ? 'tab-active' : ''}`}
//             onClick={() => handleTabChange('tab1')}
//           >
//             1
//           </button>
//           <button
//             className={`tab ${activeTab === 'tab2' ? 'tab-active' : ''}`}
//             onClick={() => handleTabChange('tab2')}
//           >
//             2
//           </button>
//           <button
//             className={`tab ${activeTab === 'tab3' ? 'tab-active' : ''}`}
//             onClick={() => handleTabChange('tab3')}
//           >
//             3
//           </button>
//           <button
//             className={`tab ${activeTab === 'tab4' ? 'tab-active' : ''}`}
//             onClick={() => handleTabChange('tab4')}
//           >
//             4
//           </button>
//           <button
//             className={`tab ${activeTab === 'tab4' ? 'tab-active' : ''}`}
//             onClick={() => handleTabChange('tab5')}
//           >
//             5
//           </button>
//         </div>

//         <div className="mt-4 ">
//         {activeTab === 'tab0' && <div className='px-4'><Why  handleTab={() => handleTabChange('tab1')}  />
          
//         </div>}
//           {activeTab === 'tab1' && <div className='px-4'><Step1 formData={formData}
//           onSave={(data) => updateFormData(data)} 
          
//           handleTab={() => handleTabChange('tab2')} /></div>}
//           {activeTab === 'tab2' && <div className='px-4'>
//             <Step2 
//             data={formData}
//             onSave={(data) => updateFormData(data)} 
//           handleTab={() => handleTabChange('tab3')} /></div>}
//           {activeTab === 'tab3' && <div className='px-4'><Step3 
//           data={formData}
//           onSave={(data) => updateFormData(data)} 
//           handleTab={() => handleTabChange('tab4')} /></div>}
//           {activeTab === 'tab4' && <div className='px-4'>
//             <Step4 data={formData} onSave={(data) => 
//                {updateFormData(data)
                
//                 onClickApply()
//               }} handleTab={() => handleTabChange('tab5')} /></div>}
//           {activeTab === 'tab5'&& user && <div className='px-4'><ThankYou user={user} /></div>}
//         </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className='flex mt-6 flex-col items-center max-w-[100vw]'>
//       {user?<ThankYou user={user} />:<MyTabs />}
//     </div>
//   );
// }