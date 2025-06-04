import { Preferences } from '@capacitor/preferences';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import Context from '../context';
import Paths from '../core/paths';
import { useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useEffect } from 'react';
import { debounce } from 'lodash';
import authRepo from '../data/authRepo'
import ThankYou from './auth/ThankYou'
import logo from "../images/logo/logo-green.png"
export default function OnboardingContainer(props) {
  const navigate = useNavigate();
  
  const finishOnboarding = async () => {
    onClickApply(async ()=>{
       await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });
      navigate(Paths.myProfile(), { replace: true });
    })
   
  };

  const [activeTab, setActiveTab] = useState('tab0');
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const genres = [
    "Fiction", "Non-fiction", "Poetry", "Drama/Playwriting", "Screenwriting",
    "Flash Fiction", "Memoir", "Short Stories", "Fantasy", "Science Fiction",
    "Horror", "Mystery/Thriller", "Romance", "Young Adult", "Children's Literature",
    "Historical Fiction", "Satire/Humor", "Experimental/Hybrid Forms", "Other"
  ];



    const isNotPhone = useMediaQuery({ query: '(min-width: 600px)' });
    const { seo, setSeo } = useContext(Context);
  
    useEffect(() => {
      let soo = seo;
      soo.title = "Plumbum (Onboarding)";
      setSeo(soo);
    }, [seo, setSeo]);
  

  
    const [formData, setFormData] = useState({
      igHandle: "",
      fullName: "",
      email: "",
      whyApply: "",
      howFindOut: "",
      otherGenre: "",
      communityNeeds: "",
      workshopPreference: "",
      feedbackFrequency: "",
      selectedGenres: [],
      comfortLevel: 0,
      platformFeatures: "",
    });

  const [user, setUser] = useState(null);
  const { error, setError } = useContext(Context);
  const [betaTest, setBetaTester] = useState([]);
  const onClickApply =debounce(async () => {
 
    if (validateEmail(formData.email)) {
      const form = {
        ...formData,
        email: formData.email.toLowerCase(),
        genres: formData.selectedGenres.includes("Other")
          ? [...formData.selectedGenres.filter((g) => g !== "Other"), formData.otherGenre]
          : formData.selectedGenres,
      };

      try {
        let data;
        if (location.pathname.includes("newsletter")) {
          data = await authRepo.applyFromNewsletter(form);
        } else {
          data = await authRepo.apply(form);
        }
        await Preferences.set({ key: 'hasSeenOnboarding',value:true });
        setUser(data?data.user:data );
      } catch (err) {
        setUser(err);
      }
    }
  
  
authRepo.apply(formData).then(data=>{
    
if(data.user){
setUser(data.user)
    }else{
      
      setUser(data)
    }}).catch(err=>{
      setUser(err)
    })},[200])
 
  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };




  const validateEmail = (email) => {
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const Step1 = ({ handleTab, onSave,formData }) => {
     const [igHandle, setIgHandle] = useState(formData.igHandle??"");
  const [fullName, setFullName] = useState(formData.fullName??"");
  const [email, setEmail] = useState(formData.email??"");


    const handleStep=()=>{
      onSave({
          fullName: fullName,
          email:email ,
          igHandle: igHandle,
        })
        handleTab()
    }
   

    return (
      <div >
        <h6 className="text-emerald-700 lora-bold text-sm">* Required</h6>
        <div className="w-full my-8 text-center">
          <h3 className="mx-auto text-2xl text-emerald-700  lora-bold my-2 w-fit">Interest Form</h3>
          <h6 className="text-md mont-medium">We’re building a space that’s nurturing, focused, and kind. This short application helps us make sure it’s the right fit — for you, and for the group.</h6>
        </div>

        <label className="input text-[0.8rem] rounded-full mont-medium mt-4 text-emerald-700  py-8 font-bold mb-4 lg:py-8  bg-transparent border border-emerald-700  flex items-center gap-2">
          Preferred Name
          <input
            type="text"
            className="grow pl-4 text-emerald-700  w-full  bg-transparent"
            name="fullName"
            value={fullName}
            onChange={(e)=>{
              setFullName(e.target.value)
            }}
            placeholder="Jon Doe"
          />
        </label>

        <label className="input mt-4 mb-2 rounded-full font-bold py-8  bg-transparent border border-emerald-700  text-emerald-700  flex items-center gap-2">
          *<h6 className="font-bold mont-medium text-[0.8rem]"> Email</h6>
          <input
            type="text"
            className="grow text-emerald-700  mont-medium pl-4 w-full  bg-transparent"
            name="email"
            value={email}
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
          />
        </label>
        {email.length > 0 && !validateEmail(email) ? (
          <h6 className="text-[0.8rem] mont-medium text-red-500">Please use a valid email</h6>
        ) : null}

        <label className="input mt-4 rounded-full mb-8 font-bold py-8 w-[100%]  bg-transparent text-emerald-700  border border-emerald-700  text-emerald-700  flex items-center">
          <h6 className="font-bold mont-medium text-[0.8rem]">IG Handle </h6>
          <input
            type="text"
            className="grow mont-medium text-emerald-700  mx-2"
            name="igHandle"
            value={igHandle}
            onChange={(e)=>{
              setIgHandle(e.target.value)
            }}
            placeholder="*****"
          />
        </label>
        <div className='flex '>
          <div className='flex-1' /><button className="max-w-[20em]   bg-emerald-900 text-white text-xl rounded-full" onClick={handleStep}>Next Step</button>
        </div>
      </div>
    );
  };
  const Step2 = ({ handleTab, onSave, data }) => {
    const [whyApply, setWhyApply] = useState(data.whyApply);
    const [communityNeeds, setCommunityNeeds] = useState(data.communityNeeds ?? "");

    const handleStep = () => {
      onSave({
        whyApply: whyApply,
        communityNeeds: communityNeeds,
      });
      handleTab();
    };

    return (
      <div className='flex flex-col max-h-[70vh] '>
        <label className="text-xl font-bold mont-medium text-emerald-700 ">Artist Statement</label>
        <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 font-bold mt-4">
          What would make a writing space meaningful for you?
        </label>
        <textarea
          name="whyApply"
          value={whyApply}
          onChange={(e) => setWhyApply(e.target.value)}
          className="textarea  bg-transparent open-sans-medium w-full text-l h-min-24 border border-emerald-700  text-emerald-700 "
          placeholder="Tell us what you'd love to see or experience in a space for writers like you."
        />

        <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 font-bold mt-4">
          What do you look for in a writing community?
        </label>
        <textarea
          name="communityNeeds"
          value={communityNeeds}
          onChange={(e) => setCommunityNeeds(e.target.value)}
          className="textarea  bg-transparent open-sans-medium w-full text-l  h-min-24 border border-emerald-700  text-emerald-700 "
        />

        <div className='flex '>
          <div className='flex-1' /><button className="max-w-[20em]   bg-emerald-900 text-white text-xl rounded-full" onClick={handleStep}>Next Step</button>
        </div>
      </div>
    );
  };const Step3 = ({ handleTab, onSave, data }) => {
    const [selectedGenres, setSelectedGenres] = useState(data.selectedGenres ?? []);
    const [otherGenre, setOtherGenre] = useState(data.otherGenre ?? "");
    const [comfortLevel, setComfortLevel] = useState(data.comfortLevel ?? 0);
    const [feedbackFrequency, setFeedbackFrequency] = useState(data.feedbackFrequency ?? "daily");

    const handleGenreSelection = (genre) => {
      setSelectedGenres((prev) =>
        prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
      );
    };

    const handleStep = () => {
      onSave({
        selectedGenres: selectedGenres,
        otherGenre: otherGenre,
        comfortLevel: comfortLevel,
        feedbackFrequency: feedbackFrequency,
      });
      handleTab();
    };

    return (
      <div>
        <label className="text-emerald-700  text-l  mont-medium mb-2 pb-1 font-bold mt-4">
          What genres do you write in?
        </label>
        <div className="flex pt-4 flex-wrap gap-3">
          {genres.map((genre, index) => (
            <label key={index} className="flex items-center ">
              <input
                type="checkbox"
                value={genre}
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreSelection(genre)}
                className="checkbox mx-1 border-black border-1"
              />
              <span className="text-emerald-700  open-sans-medium">{genre}</span>
            </label>
          ))}
        </div>
        {selectedGenres.includes("Other") && (
          <input
            type="text"
            placeholder="Please specify"
            name="otherGenre"
            value={otherGenre}
            onChange={(e) => setOtherGenre(e.target.value)}
            className=" bg-transparent border border-emerald-700 open-sans-medium py-2 text-emerald-700  text-[1rem] text-l input mt-4"
          />
        )}
        <label className="text-emerald-700  pt-4 text-m mont-medium mb-2 pb-1 font-bold mt-4">
          How comfortable are you sharing your work with others?
        </label>
        <div className="flex flex-col items-center gap-4">
          {/* Slider */}
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            name="comfortLevel"
            value={comfortLevel}
            onChange={(e) => setComfortLevel(parseInt(e.target.value))}
            className="range bg-emeald-600  w-full"
          /></div>
        <div className="flex justify-between w-[90%] mx-auto text-sm text-emerald-700 ">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
        <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
          How often do you seek feedback on your writing?
        </label>
        <select
          name="feedbackFrequency"
          value={feedbackFrequency}
          onChange={(e) => setFeedbackFrequency(e.target.value)}
          className="select  bg-transparent border rounded-full border-emerald-700  text-emerald-700  w-full text-l sm:text-xl"
        >
          <option defaultValue={true} value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="occasionally">Occasionally</option>
          <option value="rarely">Rarely</option>
        </select>
        <div className='flex '>
          <div className='flex-1' /><button className="max-w-[20em]   bg-emerald-900 text-white text-xl rounded-full" onClick={handleStep}>Next Step</button>
        </div>
      </div>
    );
  };
  const Step4 = ({ onSave,data }) => {
    const [workshopPreference, setWorkshopPreference] = useState(data.workshopPreference ?? "both");
    const [howFindOut, setHowFindOut] = useState(data.howFindOut ?? "");
    const [platformFeatures, setPlatformFeatures] = useState(data.platformFeatures ?? "");

    const handleSubmit = () => {
      
      onSave({
        workshopPreference: workshopPreference,
        howFindOut: howFindOut,
        platformFeatures: platformFeatures,
      });
    
    };

    return (
      <div className='flex flex-col'>
        <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 mt-4">
          Would you prefer in-person workshops, online, or both?
        </label>
        <select
          name="workshopPreference"
          value={workshopPreference}
          onChange={(e) => setWorkshopPreference(e.target.value)}
          className="select rounded-full open-sans-medium  bg-transparent border border-emerald-700  text-emerald-700  w-full text-l sm:text-xl"
        >
          <option value="in-person">In-person</option>
          <option value="online">Online</option>
          <option defaultValue={true} value="both">Both</option>
        </select>

        <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
          How did you find out about Plumbum?
        </label>
        <input
          name="howFindOut"
          value={howFindOut}
          onChange={(e) => setHowFindOut(e.target.value)}
          className=" bg-transparent border open-sans-medium border-emerald-700  py-8 text-emerald-700 text-l sm:text-xl input"
        />

        <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
          What features would make a writing platform most valuable to you?
        </label>
        <textarea
          name="platformFeatures"
          value={platformFeatures}
          onChange={(e) => setPlatformFeatures(e.target.value)}
          className="textarea  bg-transparent w-full open-sans-medium text-l sm:text-xl h-min-24 border border-emerald-700  text-emerald-700 "
        />
        <div className='flex '>
          <div className='flex-1' />
          <button type="submit"
           className={`mont-medium my-8 py-4 text-2xl text-white mont-medium px-20 mx-auto rounded-full ${validateEmail(formData.email) ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-purple-400 to-gray-500"} hover:bg-green-400 font-bold border-none shadow-sm`} 
           onClick={handleSubmit}>Apply</button>
        </div>
      </div>
    );
  };
  const ApplySubmit = () => {
    const handleSubmit = () => {
     
      console.log(JSON.stringify(formData))
 
      alert("Application submitted!");
      finishOnboarding(); // Example of what might happen after submission
    };

    return (
      <div className='flex flex-col items-center'>
    <div className='flex items-left'>{!validateEmail(email)?<p>Email is not valid</p>:null}</div>
        <button   className={`mont-medium my-8 py-4 text-xl text-white mont-medium w-[14em] mx-auto rounded-full ${validateEmail(email)?"bg-gradient-to-r from-emerald-400 to-emerald-500":"bg-gradient-to-r from-purple-400 to-gray-500"} hover:bg-green-400 font-bold border-none shadow-sm`} onClick={handleSubmit}>
          Submit Application
        </button>
      </div>
    );
  };
  const Why=({handleTab})=>{
    return(< ><div className=' pb-36'><section className="p-4 lora-medium text-emerald-800  text-left">
      <img className="max-h-[10em] mx-auto mb-8 rounded-lg "src={logo}/>
    <h2 className="text-xl font-bold mb-3 text-center">What is Plumbum?</h2>
    <ul className="list-disc pl-6 space-y-2 text-base">
      <li>
        <strong>Writer-Focused:</strong> A space made for writers to grow, get feedback, and share their work — all in one place.
      </li>
      <li>
        <strong>Community First:</strong> Built from live workshops and honest conversations, not algorithms.
      </li>
      <li>
        <strong>Discovery Through People:</strong> Find new stories and voices through trust and interaction, not trends.
      </li>
      <li>
        <strong>Hybrid by Design:</strong> We mix feedback, self-promotion, and curation — because writers need all three.
      </li>
    </ul>
  </section>
  
  <section className="p-4  lora-medium text-emerald-800 text-left">
    <h2 className="text-xl font-bold mb-3 text-center">Why Join?</h2>
    <ul className="list-disc pl-6 space-y-2 text-base">
      <li>
        <strong>Real Feedback:</strong> Thoughtful input from people who care about craft, not clout.
      </li>
      <li>
        <strong>Creative Momentum:</strong> Stay in motion with events, prompts, and people who show up.
      </li>
      <li>
        <strong>Supportive Culture:</strong> Built slow and small on purpose, so we protect the vibe.
      </li>
      <li>
        <strong>Self & Story Promotion:</strong> A space where sharing your work doesn’t feel awkward — it’s expected.
      </li>
    </ul>
  </section>
  <div className='flex'>
  <div className='flex-1' /><button className="max-w-[20em]   bg-emerald-900 text-white text-xl rounded-full" onClick={handleTab}>Next Step</button>
  </div>
  </div>
  </>)
  }
  const MyTabs = () => {
    return (
      <>
      <div className='absolute '>
        <div className="tabs relative top-0 flex justify-around max-w-[100vw]">
       
          <button
            className={`tab ${activeTab === 'tab1' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('tab1')}
          >
            1
          </button>
          <button
            className={`tab ${activeTab === 'tab2' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('tab2')}
          >
            2
          </button>
          <button
            className={`tab ${activeTab === 'tab3' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('tab3')}
          >
            3
          </button>
          <button
            className={`tab ${activeTab === 'tab4' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('tab4')}
          >
            4
          </button>
          <button
            className={`tab ${activeTab === 'tab4' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('tab5')}
          >
            5
          </button>
        </div>

        <div className="mt-4 ">
        {activeTab === 'tab0' && <div className='px-4'><Why  handleTab={() => handleTabChange('tab1')}  />
          
        </div>}
          {activeTab === 'tab1' && <div className='px-4'><Step1 formData={formData}
          onSave={(data) => updateFormData(data)} 
          
          handleTab={() => handleTabChange('tab2')} /></div>}
          {activeTab === 'tab2' && <div className='px-4'>
            <Step2 
            data={formData}
            onSave={(data) => updateFormData(data)} 
          handleTab={() => handleTabChange('tab3')} /></div>}
          {activeTab === 'tab3' && <div className='px-4'><Step3 
          data={formData}
          onSave={(data) => updateFormData(data)} 
          handleTab={() => handleTabChange('tab4')} /></div>}
          {activeTab === 'tab4' && <div className='px-4'>
            <Step4 data={formData} onSave={(data) => 
               {updateFormData(data)
                
                onClickApply()
              }} handleTab={() => handleTabChange('tab5')} /></div>}
          {activeTab === 'tab5'&& user && <div className='px-4'><ThankYou user={user} /></div>}
        </div>
        </div>
      </>
    );
  };

  return (
    <div className='flex mt-6 flex-col items-center max-w-[100vw]'>
      {user?<ThankYou user={user} />:<MyTabs />}
    </div>
  );
}