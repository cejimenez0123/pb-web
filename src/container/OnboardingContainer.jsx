import { Preferences } from '@capacitor/preferences';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonTextarea,
  IonLabel,
  IonList,
  IonText,
  IonItem,
  useIonRouter
} from '@ionic/react';
import "../App.css"
import { useState, useContext, useEffect } from 'react';
import { debounce } from 'lodash';
import Context from '../context';
import Paths from '../core/paths';
import authRepo from '../data/authRepo';
import ThankYou from './auth/ThankYou';
import logo from "../images/logo/icon.png";
import { useDispatch } from 'react-redux';
import { getCurrentProfile, signUp } from '../actions/UserActions';
import { useSelector } from 'react-redux';
const inputStyle = {
  "--width": '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: '1.125rem',
  fontFamily: 'inherit',
  fontWeight: 600,
  // color: 'inherit',
  "--color":"inherit",
  "--boxShadow": 'none',
  "--padding": 0,

  '--background': 'transparent',
};

export default function OnboardingContainer(props) {
  const router = useIonRouter()
  const { seo, setSeo,  } = useContext(Context);

  const currentProfile = useSelector(state=>state.users.currentProfile)
  const genres = [
    "Fiction", "Non-fiction", "Poetry", "Drama/Playwriting", "Screenwriting",
    "Flash Fiction", "Memoir", "Short Stories", "Fantasy", "Science Fiction",
    "Horror", "Mystery/Thriller", "Romance", "Young Adult", "Children's Literature",
    "Historical Fiction", "Satire/Humor", "Experimental/Hybrid Forms", "Other"
  ];
  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState('tab0');
  const [formData, setFormData] = useState({
    idToken:"",
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
    comfortLevel: 1,
    platformFeatures: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    setSeo(prev => ({ ...prev, title: "Plumbum (Onboarding)" }));
  }, [setSeo]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||formData.idToken.length>10;



  const onClickApply = async () => {
    
    const idToken =formData.idToken
    if(idToken){
    let  data = await authRepo.apply(formData)
    console.log(data)
    await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });
    setUser(data?.user ?? data);

    }

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
  }

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  
const Step1 = ({ formData, updateFormData, handleTab }) => {

  const [localData, setLocalData] = useState({
    fullName: formData.fullName || "",
    email: formData.email || "",
    igHandle: formData.igHandle || ""
  });

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNext = () => {
    updateFormData(localData);
    handleTab('tab2');
  };

  const handleBack = () => {
    handleTab('tab0');
  };

  return (
    <IonGrid className='h-[60em]'>
      <IonRow>
        <IonList className='text-left w-[45em] mx-auto'>

          <IonText color="success" className="lora-bold">
            * Required
          </IonText>

          <IonText className="text-[1.5rem] font-bold">
            Interest Form
          </IonText>

          {/* Preferred Name */}
          <IonItem fill="outline" color="success" className="my-6">
            <div className="w-full">
              <IonLabel className="mont-medium">
                Preferred Name
              </IonLabel>
              <input
                type="text"
                value={localData.fullName}
                onChange={e =>
                  setLocalData(prev => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Jon Doe"
                className="w-full bg-transparent outline-none text-lg mt-2"
              />
            </div>
          </IonItem>

          {/* Email */}
          <IonItem fill="outline" color="success" className="my-6">
            <div className="w-full">
              <IonLabel className="mont-medium">
                * Email
              </IonLabel>
              <input
                type="email"
                value={localData.email}
                onChange={e =>
                  setLocalData(prev => ({ ...prev, email: e.target.value }))
                }
                placeholder="email@example.com"
                className="w-full bg-transparent outline-none text-lg mt-2"
              />
            </div>
          </IonItem>

          {localData.email && !validateEmail(localData.email) && (
            <IonText color="danger" className="text-sm">
              Please use a valid email
            </IonText>
          )}

          {/* IG Handle */}
          <IonItem fill="outline" color="success" className="my-6">
            <div className="w-full">
              <IonLabel className="mont-medium">
                IG Handle
              </IonLabel>
              <input
                type="text"
                value={localData.igHandle}
                onChange={e =>
                  setLocalData(prev => ({ ...prev, igHandle: e.target.value }))
                }
                placeholder="@yourhandle"
                className="w-full bg-transparent outline-none text-lg mt-2"
              />
            </div>
          </IonItem>

          {/* Navigation */}
          <IonRow className='flex justify-between mt-8'>
            <div className="btn bg-emerald-700 rounded-full px-6 py-2">
              <IonText onClick={handleBack} className="text-white text-lg">
                Back
              </IonText>
            </div>
            <div className="btn bg-emerald-700 rounded-full px-6 py-2">
              <IonText onClick={handleNext} className="text-white text-lg">
                Next Step
              </IonText>
            </div>
          </IonRow>

        </IonList>
      </IonRow>
    </IonGrid>
  );
};
const Step2 = ({ formData, updateFormData, handleTab }) => {

  const [localData, setLocalData] = useState({
    whyApply: formData.whyApply || "",
    communityNeeds: formData.communityNeeds || ""
  });

  const handleNext = () => {
    updateFormData(localData);
    handleTab('tab3');
  };

  const handleBack = () => {
    handleTab('tab1');
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol class='text-left w-[45em] mx-auto'>
<div className='h-[60em] text-left w-[45em] mx-auto'>
          <IonLabel className="mont-medium text-lg font-bold">
            Artist Statement
          </IonLabel>

          <IonLabel className="mont-medium mt-6 block">
            What would make a writing space meaningful for you?
          </IonLabel>
          <textarea
            value={localData.whyApply}
            onChange={e =>
              setLocalData(prev => ({ ...prev, whyApply: e.target.value }))
            }
            rows={4}
            className="w-[100%] border border-emerald-400 rounded-xl p-3 mt-2"
          />

          <IonLabel className="mont-medium mt-6 block">
            What do you look for in a writing community?
          </IonLabel>
          <textarea
            value={localData.communityNeeds}
            onChange={e =>
              setLocalData(prev => ({ ...prev, communityNeeds: e.target.value }))
            }
            rows={4}
            className="w-[100%] border border-emerald-400 rounded-xl p-3 mt-2"
          />

          <IonRow className="flex justify-between mt-8">
         <div onClick={handleBack} className="btn-container my-auto btn bg-emerald-700 border-none rounded-full" >
            <IonText  className="emerald-gradient-text-btn text-white text-[0.8rem] text-[1rem]" style={{ width: '100%' }}>
              Back
             </IonText>
          </div>
           <div onClick={handleNext} className="btn-container my-auto btn bg-emerald-700 border-none rounded-full" >
            <IonText  className="emerald-gradient-text-btn text-white text-[0.8rem] text-[1rem]" style={{ width: '100%' }}>
              Next Step
             </IonText>
          </div>
          </IonRow>
</div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};



  const Step3 = ({ formData, updateFormData, handleTab }) => {
    const toggleGenre = (genre) => {
      let newSelectedGenres;
      if (formData.selectedGenres.includes(genre)) {
        newSelectedGenres = formData.selectedGenres.filter(g => g !== genre);
      } else {
        newSelectedGenres = [...formData.selectedGenres, genre];
      }
      updateFormData({ selectedGenres: newSelectedGenres });
    };
    const handleBack = () => {
      handleTab("tab2");
    };

    const handleNext = () => {
      handleTab("tab4");
    };

    const selectedGenres = formData.selectedGenres || [];
    const otherGenre = formData.otherGenre || "";
    const comfortLevel = formData.comfortLevel;
    const feedbackFrequency = formData.feedbackFrequency;

    return (
      <IonGrid>
        <IonRow>
          <IonCol >
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
                        py-1 px-4 
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
                onIonInput={e => updateFormData({ otherGenre: e.target.value  })}
                color="success"
                className="ion-margin-top"
              />
            )}

            <ComfortLevelSelector
              comfortLevel={comfortLevel}
              setComfortLevel={val => updateFormData({ comfortLevel: val })}
            />
            <FeedbackFrequencySelector
              feedbackFrequency={feedbackFrequency}
              setFeedbackFrequency={val => updateFormData({ feedbackFrequency: val })}
            />
<IonRow>
<div className="btn-container btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0', textAlign: 'right' }}>
            
<IonText onClick={handleBack} className="emerald-gradient-text-btn text-white text-[1.3rem]" style={{ width: '100%' }}>
               Back
              </IonText>
            </div>
            <div className="btn-container btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0', textAlign: 'right' }}>
  
              <IonText onClick={handleNext} className="emerald-gradient-text-btn text-white text-[1.3rem]" style={{ width: '100%' }}>
                Next Step
              </IonText>
              </div>
              </IonRow>
      
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };


//   };
const Step4 = ({ formData, updateFormData, onSave }) => {
  // Local state for this step
  const [localData, setLocalData] = useState({
    workshopPreference: formData.workshopPreference || "both",
    howFindOut: formData.howFindOut || "",
    platformFeatures: formData.platformFeatures || "",
  });

  const handleSubmit = () => {
    // Push local state to parent before submitting
    updateFormData(localData);
    onSave();
  };

  return (
    <IonGrid>
      <IonCol className="text-left ion-padding">

        {/* Workshop Preference */}
        <IonLabel className="mont-medium font-bold block mb-2">
          Would you prefer in-person workshops, online, or both?
        </IonLabel>
        <WorkshopPreferenceSelector
          workshopPreference={localData.workshopPreference}
          setWorkshopPreference={val =>
            setLocalData(prev => ({ ...prev, workshopPreference: val }))
          }
        />

        {/* How did you find out? */}
        <IonLabel className="mont-medium font-bold block mt-6 mb-2">
          How did you find out about Plumbum?
        </IonLabel>
        <textarea
          rows={4}
          value={localData.howFindOut}
          onChange={e =>
            setLocalData(prev => ({ ...prev, howFindOut: e.target.value }))
          }
          placeholder="e.g., social media, friend, workshop"
          className="w-[100%] border border-emerald-400 rounded-xl p-3"
        />

        {/* Platform Features */}
        <IonLabel className="mont-medium font-bold block mt-6 mb-2">
          What features would make a writing platform most valuable to you?
        </IonLabel>
        <textarea
          rows={4}
          value={localData.platformFeatures}
          onChange={e =>
            setLocalData(prev => ({ ...prev, platformFeatures: e.target.value }))
          }
          placeholder="e.g., peer reviews, prompts, community groups"
          className="w-[100%] border border-emerald-400 rounded-xl p-3"
        />

        {/* Apply Button */}
        <div className="btn-container text-right mt-6">
          <IonText
            onClick={handleSubmit}
            className="emerald-gradient-text-btn text-lg btn bg-emerald-600 rounded-full text-white px-6 py-2"
            style={{
              opacity: validateEmail(formData.email) ? 1 : 0.6,
              pointerEvents: validateEmail(formData.email) ? "auto" : "none",
            }}
          >
            Apply
          </IonText>
        </div>

      </IonCol>
    </IonGrid>
  );
};
const Why = ({ handleTab, nav }) => {
  return (
    <div className='text-center py-8'>
    <IonGrid  className="fade-in">
      <IonRow className="justify-center">
        <IonCol size="12" sizeMd="8" className="text-left">
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="Plumbum Logo"
              className="rounded-lg"
              style={{ maxHeight: "10em" }}
            />
          </div>

          <IonText className="lora-medium block">
            <h2 className="text-2xl font-bold mb-2">What is Plumbum?</h2>
            <ul className="list-disc pl-6 space-y-2 text-[1rem]">
              <li>
                <strong>Writer-Focused:</strong> A space made for writers to
                grow, get feedback, and share their work — all in one place.
              </li>
              <li>
                <strong>Community First:</strong> Built from live workshops and
                honest conversations, not algorithms.
              </li>
              <li>
                <strong>Discovery Through People:</strong> Find new stories and
                voices through trust and interaction, not trends.
              </li>
              <li>
                <strong>Hybrid by Design:</strong> We mix feedback,
                self-promotion, and curation — because writers need all three.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-2">Why Join?</h2>
            <ul className="list-disc pl-6 space-y-2 text-[1rem]">
              <li>
                <strong>Real Feedback:</strong> Thoughtful input from people who
                care about craft, not clout.
              </li>
              <li>
                <strong>Creative Momentum:</strong> Stay in motion with events,
                prompts, and people who show up.
              </li>
              <li>
                <strong>Supportive Culture:</strong> Built slow and small on
                purpose, so we protect the vibe.
              </li>
              <li>
                <strong>Self & Story Promotion:</strong> A space where sharing
                your work doesn’t feel awkward — it’s expected.
              </li>
            </ul>
          </IonText>
         <IonRow className='flex mx-auto w-[100%] mx-auto justify-between'> 
            <div onClick={()=>router.push(Paths.login())} className='btn my-auto bg-transparent mt-4 border-none '><IonText  className=" text-emerald-800 text-[1.3rem]" style={{ width: '100%' }}>
                 Log In
             </IonText></div>
      
        <div onClick={handleTab} className="btn-container my-auto btn bg-emerald-700 border-none rounded-full" >
            <IonText  className="emerald-gradient-text-btn text-white text-[0.8rem] text-[1rem]" style={{ width: '100%' }}>
              Next Step
             </IonText>
          </div></IonRow>
        
        </IonCol>
      </IonRow>
    </IonGrid>
    </div>
  );
};



  const MyTabs = () => (
    <>
      <div className=" text-center my-12 mx-auto sm:w-[40em]">
        {[1, 2, 3, 4].map((tabNum) => (
          <IonText
            key={tabNum}
            className={`tab-btn ${activeTab === `tab${tabNum}` ? 'tab-active' : ''} emerald-gradient-text-btn`}
            style={{
              margin: '0 0.2em',
              // cursor: 'pointer',
              padding: '0.5rem 0.75rem',
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

      <div className="text-center mx-auto sm:w-[50rem]">
        {activeTab === 'tab0' && <Why handleTab={(tab) => setActiveTab('tab1')} />}
        {activeTab === 'tab1' && <Step1 formData={formData} updateFormData={updateFormData} handleTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'tab2' && <Step2 formData={formData} updateFormData={updateFormData} handleTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'tab3' && <Step3 formData={formData} updateFormData={updateFormData} handleTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'tab4' && <Step4 formData={formData} updateFormData={updateFormData} onSave={onClickApply} handleTab={() => setActiveTab('tab5')} />}
        {activeTab === 'tab5' && user && <ThankYou user={user} />}
      </div>
    </>
  
  );

  return (
<IonContent fullscreen={true}>
  <div className='pt-8 pb-12'>
          {user ? <ThankYou user={user} /> : <MyTabs />}
    </div>
  </IonContent>
  );
}

// Supporting components also in the same file

function ComfortLevelSelector({ comfortLevel, setComfortLevel }) {
  const levels = [1, 2, 3, 4, 5];

  return (
    <IonCol className="pt-4">
      <IonLabel
        className="mont-medium"
        color="success"
        style={{ fontWeight: 'bold', marginTop: '1rem', display: 'block' }}
      >
        How comfortable are you sharing your work with others?
      </IonLabel>
<div>
      <IonGrid style={{ marginTop: '1rem' }}>
        <IonRow className="ion-justify-content-center" style={{ gap: '0.5rem' }}>
          {levels.map((level) => (
            <IonCol size="auto" key={level}>
              <div
                onClick={() => setComfortLevel(level)}
                style={{
                  cursor: 'pointer',
                  padding: '0.75rem 1rem',
                  borderRadius: '9999px',
                  userSelect: 'none',
                  backgroundColor: comfortLevel === level ? '#059669' : 'transparent', // emerald-600 bg if selected
                  color: comfortLevel === level ? 'white' : '#065f46', // white text if selected else emerald-800
                  fontWeight: comfortLevel === level ? '700' : '500',
                  transition: 'background-color 0.3s, color 0.3s',
                  boxShadow: comfortLevel === level ? '0 2px 6px rgba(5, 150, 105, 0.5)' : 'none',
                  textAlign: 'center',
                  minWidth: '2.5rem',
                }}
              >
                <IonText className="open-sans-medium">{level}</IonText>
              </div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      </div>
    </IonCol>
  );
}

const FeedbackFrequencySelector = ({ feedbackFrequency, setFeedbackFrequency }) => {
  const options = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Occasionally', value: 'occasionally' },
    { label: 'Rarely', value: 'rarely' },
  ];

  return (
    <>
      <IonLabel
        className="mont-medium"
        color="success"
        style={{ fontWeight: 'bold', marginTop: '1rem' }}
      >
        How often do you seek feedback on your writing?
      </IonLabel>
      <div className="ion-margin-top flex justify-center flex-wrap gap-2">
        {options.map(option => {
          const selected = feedbackFrequency === option.value;
          return (
            <div
              key={option.value}
              onClick={() => setFeedbackFrequency(option.value)}
              className={`cursor-pointer rounded-full min-w-max px-6 py-2 flex items-center justify-center select-none ${
                selected
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold shadow-md'
                  : 'bg-transparent text-emerald-700 hover:bg-emerald-200'
              }`}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setFeedbackFrequency(option.value);
                }
              }}
            >
              <IonText className="open-sans-medium text-center">{option.label}</IonText>
            </div>
          );
        })}
      </div>
    </>
  );
};

const WorkshopPreferenceSelector = ({ workshopPreference, setWorkshopPreference }) => {
  const options = [
    { label: 'In-person', value: 'in-person' },
    { label: 'Online', value: 'online' },
    { label: 'Both', value: 'both' },
  ];

  return (

    <>
      <IonLabel
        // className="mont-medium"
        color="success"
        // style={{ fontWeight: 'bold', marginTop: '1rem' }}
      >
        Would you prefer in-person workshops, online, or both?
      </IonLabel>
      <div className="ion-margin-top flex justify-center flex-wrap gap-2">
        {options.map(option => {
          const selected = workshopPreference === option.value;
          return (
            <div
              key={option.value}
              onClick={() => setWorkshopPreference(option.value)}
              className={`cursor-pointer rounded-full min-w-max px-6 py-2 flex items-center justify-center select-none ${
                selected
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold shadow-md'
                  : 'bg-transparent text-emerald-700 hover:bg-emerald-200'
              }`}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setWorkshopPreference(option.value);
                }
              }}
            >
              <IonText className="open-sans-medium text-center">{option.label}</IonText>
            </div>
          );
        })}
      </div>
    </>
    // </IonContent>
  );
};
