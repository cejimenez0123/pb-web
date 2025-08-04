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
  IonCheckbox,
  IonList,
  IonText,
  IonItem
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
    comfortLevel: 1,
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

  // Components

  const Step1 = ({ formData, updateFormData, handleTab }) => {
    const handleNext = () => {
      handleTab();
    };

    return (
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText color="success" className="lora-bold">* Required</IonText>
            <IonText className="ion-text-center" color="success" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              Interest Form
            </IonText>
            <IonText className="ion-text-center" color="success">
              We’re building a space that’s nurturing, focused, and kind. This short application helps us make sure it’s the right fit — for you, and for the group.
            </IonText>

            <IonItem fill="outline" color="success" className="my-4">
              <IonLabel position="floating" className="mont-medium">Preferred Name</IonLabel>
              <IonInput
                value={formData.fullName}
                onIonChange={e => updateFormData({ fullName: e.detail.value })}
                placeholder="Jon Doe"
                clearInput
              />
            </IonItem>

            <IonItem fill="outline" color="success" className="my-4">
              <IonLabel position="floating" className="mont-medium">* Email</IonLabel>
              <IonInput
                type="email"
                value={formData.email}
                onIonChange={e => updateFormData({ email: e.detail.value })}
                placeholder="email@example.com"
                clearInput
              />
            </IonItem>

            {formData.email && !validateEmail(formData.email) && (
              <IonText color="danger" style={{ fontSize: '0.8rem' }}>
                Please use a valid email
              </IonText>
            )}

            <IonItem fill="outline" color="success" className="my-4">
              <IonLabel position="floating" className="mont-medium">IG Handle</IonLabel>
              <IonInput
                value={formData.igHandle}
                onIonChange={e => updateFormData({ igHandle: e.detail.value })}
                placeholder="*****"
                clearInput
              />
            </IonItem>

            <div className="btn-container btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0' }}>
              <IonText onClick={handleNext} className="emerald-gradient-text-btn text-white text-[1.3rem]" style={{ width: '100%' }}>
                Next Step
              </IonText>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const Step2 = ({ formData, updateFormData, handleTab }) => {
    const handleNext = () => {
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
            <div>
            <IonLabel className="mont-medium" color="success" style={{ marginTop: '1rem' }}>
              What would make a writing space meaningful for you?
            </IonLabel>
            <IonTextarea
              value={formData.whyApply}
              onIonChange={e => updateFormData({ whyApply: e.detail.value })}
              placeholder="Tell us what you'd love to see or experience in a space for writers like you."
              rows={4}
              cols={48}
              color="success"
              className="open-sans-medium w-[90%]"
            />
</div><div>
            <IonLabel className="mont-medium" color="success" style={{ marginTop: '1rem' }}>
              What do you look for in a writing community?
            </IonLabel>
            <IonTextarea
              value={formData.communityNeeds}
              onIonChange={e => updateFormData({ communityNeeds: e.detail.value })}
              rows={4}
              cols={48}
              color="success"
              className="open-sans-medium"
            />
</div>
<div className='text-right'>
            <div className="btn-container btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0' }}>
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

    const handleNext = () => {
      handleTab();
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
                onIonChange={e => updateFormData({ otherGenre: e.detail.value })}
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

            <div className="btn-container btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0', textAlign: 'right' }}>
              <IonText onClick={handleNext} className="emerald-gradient-text-btn text-white text-[1.3rem]" style={{ width: '100%' }}>
                Next Step
              </IonText>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const Step4 = ({ formData, updateFormData, onSave }) => {
    const handleSubmit = () => {
      onSave({
        workshopPreference: formData.workshopPreference,
        howFindOut: formData.howFindOut,
        platformFeatures: formData.platformFeatures,
      });
    };

    return (
      <IonGrid>
        <IonCol>
          <WorkshopPreferenceSelector
            workshopPreference={formData.workshopPreference}
            setWorkshopPreference={val => updateFormData({ workshopPreference: val })}
          />
          <IonRow>
            <IonLabel className="mont-medium" color="success" style={{ marginTop: '1rem' }}>
              How did you find out about Plumbum?
            </IonLabel>
            <IonTextarea
              rows={4}
              value={formData.howFindOut}
              onIonChange={e => updateFormData({ howFindOut: e.detail.value })}
              color="success"
              fill="outline"
              className="ion-margin-bottom border-1 border-emerald-400 rounded-full h-16 text-lg"
              style={{ lineHeight: '4rem' }}
            />
          </IonRow>

          <IonLabel className="mont-medium" color="success" style={{ marginTop: '1rem' }}>
            What features would make a writing platform most valuable to you?
          </IonLabel>
          <IonTextarea
            value={formData.platformFeatures}
            onIonChange={e => updateFormData({ platformFeatures: e.detail.value })}
            color="success"
            fill="outline"
            className="border-1 border-emerald-600"
            style={{ '--border-color': 'var(--ion-color-emerald-600)' }}
            rows={4}
          />

          <div className="btn-container text-right">
            <IonText
              onClick={handleSubmit}
              className="emerald-gradient-text-btn text-lg btn bg-emerald-600 rounded-full text-white"
              style={{
                opacity: validateEmail(formData.email) ? 1 : 0.6,
                pointerEvents: validateEmail(formData.email) ? 'auto' : 'none',
              }}
            >
              Apply
            </IonText>
          </div>
        </IonCol>
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
          <div className="text-right">
            <div className="btn-container btn bg-emerald-700 rounded-full" style={{ maxWidth: '20em', margin: '1em auto 0' }}>
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

      <div className="ion-padding-horizontal">
        {activeTab === 'tab0' && <Why handleTab={() => setActiveTab('tab1')} />}
        {activeTab === 'tab1' && <Step1 formData={formData} updateFormData={updateFormData} handleTab={() => setActiveTab('tab2')} />}
        {activeTab === 'tab2' && <Step2 formData={formData} updateFormData={updateFormData} handleTab={() => setActiveTab('tab3')} />}
        {activeTab === 'tab3' && <Step3 formData={formData} updateFormData={updateFormData} handleTab={() => setActiveTab('tab4')} />}
        {activeTab === 'tab4' && <Step4 formData={formData} updateFormData={updateFormData} onSave={onClickApply} handleTab={() => setActiveTab('tab5')} />}
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
        className="mont-medium"
        color="success"
        style={{ fontWeight: 'bold', marginTop: '1rem' }}
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
  );
};
