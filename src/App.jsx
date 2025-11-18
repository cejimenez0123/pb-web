import './App.css';
import { useDispatch,connect,useSelector} from "react-redux"
import { useEffect, useState ,useRef,useLayoutEffect} from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate, useNavigate, useLocation } from 'react-router-dom';
import {  getPublicStories } from './actions/PageActions.jsx';
import DashboardContainer from './container/DashboardContainer';
import LogInContainer from './container/auth/LogInContainer';
import NavbarContainer from './container/NavbarContainer';
import DiscoveryContainer from './container/DiscoveryContainer';
import EditorContainer from './container/page/EditorContainer'
import PageViewContainer from './container/page/PageViewContainer'
import MyProfileContainer from './container/MyProfileContainer';
import SettingsContainer from './container/SettingsContainer';
import ProfileContainer from './container/profile/ProfileContainer.jsx';
import ApplyContainer from './container/auth/ApplyContainer';
import SearchDialog from './components/SearchDialog';
import PrivacyNoticeContrainer from './container/PrivacyNoticeContainer.jsx';
import {  getCurrentProfile,
          setSignedInTrue,
          setSignedInFalse,
      } from './actions/UserActions'
      import { IonApp, IonContent, IonPage, IonText } from '@ionic/react';
import PrivateRoute from './PrivateRoute';
import LoggedRoute from './LoggedRoute';
import Paths from './core/paths';
import AboutContainer from './container/AboutContainer';
import  Context from "./context"
import TermsContainer from './container/TermsContainer.jsx';
import AddStoryToCollectionContainer from './container/collection/AddStoryToCollection';
import CollectionContainer from './container/collection/CollectionContainer';
import AddToCollectionContainer from './container/collection/AddToCollection';
import EditCollectionContainer from './container/collection/EditCollectionContainer.jsx';
import SignUpContainer from './container/auth/SignUpContainer.jsx';
import WorkshopContainer from './container/collection/WorkshopContainer.jsx';
import ResetPasswordContainer from './container/auth/ResetPassword.jsx';
import Alert from './components/Alert.jsx';
import NotificationContainer from './container/profile/NotificationContainer.jsx';
import HashtagContainer from './container/hashtag/HashtagContainer.jsx';
import NotFound from './container/NotFound.jsx';
import EmailPreferences from './container/EmailPreferences.jsx';
import FeedbackContainer from './container/FeedbackContainer.jsx';
import NewsletterContainer from './container/auth/NewsletterContainer.jsx';
import UserReferralContainer from './container/auth/UseReferralContainer.jsx';
import LinksContainer from './container/LinksContainer.jsx';
import CalendarContainer from './container/CalendarContainer.jsx';
import Enviroment from './core/Enviroment.js';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from 'react-responsive';
import { Preferences } from '@capacitor/preferences';
import OnboardingContainer from './container/OnboardingContainer.jsx';
import Dialog from './components/Dialog.jsx';
import DeviceCheck from './components/DeviceCheck.jsx';
import { Capacitor } from '@capacitor/core';
function App(props) {
  const {currentProfile} = props
  const navigate = useNavigate()
  const isPhone = useMediaQuery({ query: '(max-width: 800px)' });
  const isHorizPhone =  useMediaQuery({
    query: '(min-width: 8000px)'
  })
    const isTablet =  useMediaQuery({
    query: '(max-width: 1100px)'
  })
  const isNative = DeviceCheck()

  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const dispatch = useDispatch()
  const [formerPage, setFormerPage] = useState(null);
  const [isSaved,setIsSaved]=useState(true)
  const profileInView = useSelector(state=>state.users.profileInView)

  const [seo,setSeo]=useState({title:"Plumbum",heading:"Plumbum" ,image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website",url:"https://plumbum.app"})
  
  const [olderPath,setOlderPath]=useState(null)
  const location = useLocation()
  const [success,setSuccess]=useState(null)
  const [error,setError]=useState(null)
  const page = useRef(null);
  const dialog = useSelector(state=>state.users.dialog??{text:"",title:"",agree:()=>{},onClose:()=>{},isOpen:false,agreeText:"agree",disagreeText:"Close"})


  useEffect(()=>{
  
      dispatch(getCurrentProfile())

   
  },[])
  useEffect(()=>{
      setOlderPath(location.pathname) 
  },[location.pathname])
 
  useEffect(() => {
    const checkFirstLaunch = async () => {
    if(isNative){
      let value = (await Preferences.get('hasSeenOnboarding')).value
      if (value === null) {
        Preferences.set({key:"hasSeenOnboarding",value:true})
        
        setIsFirstLaunch(true);
        navigate(Paths.onboard)
      } else {
        navigate(Paths.login())
        setIsFirstLaunch(false);
      }}
    };
    
   return ()=>{checkFirstLaunch()}
  }, []);
  const showNav = !(Capacitor.isNativePlatform()&&(location.pathname.includes("/signup")||location.pathname.includes("/login"))||(Capacitor.isNativePlatform()&&location.pathname.includes("/onboard")))
const navbarBot = ((Capacitor.isNativePlatform()||isTablet))
if(!navigator.onLine){
  return (
      <IonApp >
        <Context.Provider value={{isTablet,isPhone,isNotPhone:!isPhone,isHorizPhone,seo,setSeo,currentProfile:currentProfile,formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>
    
    <IonPage>
      <IonContent fullscreen={true}>
        {!navbarBot?  <NavbarContainer/>:null}
    <div className='flex flex-col text-emerald-800 justify-between text-opacity-70 lora-bold w-[100%] h-[100%] flex'>
        <div className='mx-auto my-24 text-center'>
      <IonText className='text-xl'>No Internet</IonText>
      {/* <p>The page you are looking for does not exist.</p> */}
      </div>
        {navbarBot&&showNav? <NavbarContainer/>:null}
    </div>
  
    </IonContent>
    </IonPage>
    </Context.Provider>
    </IonApp>
  );

}
 return (
    <IonApp >

      <Context.Provider value={{isTablet,isPhone,isNotPhone:!isPhone,isHorizPhone,seo,setSeo,currentProfile:currentProfile,formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>
     {/* <div> */}
     {/* <head>
  <meta charset="UTF-8" />
  <Helmet>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description}/>
  <meta property="og:title" content={seo.heading}/>
  <meta property="og:description" content={seo.description}/>
  <meta property="og:image" content={seo.logoChem} />
  <meta property="og:url" content={seo.url} />
  </Helmet>
</head>  */}
      <IonPage  ref={page} className=' App pb-8b h-[100vh] background-blur bg-gradient-to-br from-slate-100 to-emerald-100'>


    
    

  <link
  rel="stylesheet"
  href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
/>
<script src="/socket.io/socket.io.js"></script>


<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>

<script
  src="https://unpkg.com/react@16/umd/react.development.js"
  crossorigin
></script>
<script
  src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
  crossorigin
></script>
<script src="https://unpkg.com/react-quill@1.3.3/dist/react-quill.js"></script>
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
        <script src="https://kit.fontawesome.com/08dbe310f1.js" crossorigin="anonymous"></script>
         <script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>  
      
   
      
       
     
        {!navbarBot?<div className='fixed h-[4rem] top-0 w-[100vw] shadow-lg z-50'>
           <NavbarContainer 
    
        currentProfile={currentProfile}/></div>:null}
                <div className="pt-12"> 
 
       <SearchDialog presentingElement={page} />
       <Dialog dialog={dialog} presentingElement={page} />
<Alert />
       

      <Routes >
 
     <Route path={'/'} element={isFirstLaunch&&Capacitor.isNativePlatform()?<Navigate to="/onboard"/>:<AboutContainer/>} />
      <Route path={"/login"} element={<LogInContainer/>}/> 
      <Route path={"/onboard"} element={<OnboardingContainer/>}/>

          <Route path={Paths.home()} 
                        element={
                          <PrivateRoute currentProfile={currentProfile}>
                          <DashboardContainer 
                          /></PrivateRoute>
                        }
            />
            <Route exact path={Paths.notifications()}
            element={<PrivateRoute currentProfile={currentProfile}>
              <NotificationContainer currentProfile={currentProfile}/></PrivateRoute>}/>
    
          <Route exact path="/discovery" 
                  element={
                    <DiscoveryContainer 
                      getPublicLibraries={props.getPublicLibraries}
                      getPublicStories={props.getPublicStories} 
                      
                      pagesInView={props.pagesInView}
                      
                    />
                  }
            />
          <Route exact path={"/privacy"}
                  element={<PrivacyNoticeContrainer/>}
                  />
          <Route exact path="/login"  
                  element={ 
        <LoggedRoute 
        currentProfile={currentProfile}
        >
            <LogInContainer  currentProfile={currentProfile} logIn={props.logIn}/>
            </LoggedRoute>
          
       }
     />
      <Route exact path={Paths.calendar()}
     element={<CalendarContainer/>}/>
          <Route exact path={Paths.newsletter() }
     element={<LoggedRoute 
 
     currentProfile={currentProfile}><NewsletterContainer/></LoggedRoute>}/>
     <Route exact path={'/reset-password' }
     element={<ResetPasswordContainer/>}/>
     <Route path={Paths.collection.route()}
     element={<CollectionContainer currentProfile={currentProfile}/>}/>
     <Route path={'/signup'}
                element={<LoggedRoute 
                            currentProfile={currentProfile}>
                              <SignUpContainer/>
                          </LoggedRoute>}/>
      <Route path={'/register'}
                element={<LoggedRoute 
                    currentProfile={currentProfile}>
                        <UserReferralContainer/></LoggedRoute>}/>
       <Route path={Paths.feedback()}
            element={<FeedbackContainer/>}/>
     <Route path={Paths.addToCollection.route}
               element={ <PrivateRoute
      currentProfile={currentProfile}
      ><AddToCollectionContainer/>
            </PrivateRoute>}/>
     <Route 
            path={Paths.addStoryToCollection.route}
              element={<PrivateRoute 
                 currentProfile={currentProfile}
                    ><AddStoryToCollectionContainer/>
                      </PrivateRoute>}/>
     <Route path={Paths.editCollection.route()}
      element={
      <PrivateRoute 
        currentProfile={currentProfile}
      >       <EditCollectionContainer/>
      </PrivateRoute>}/>
     

       <Route path={Paths.hashtag.route()}
            element={
            <HashtagContainer/>
          }/>
        <Route path={Paths.links()}
                 element={<LinksContainer/>}
          />
        <Route path={Paths.onboard}
                  element={<LoggedRoute
                    
           currentProfile={currentProfile}><ApplyContainer/></LoggedRoute>}/>
         <Route path={Paths.apply()+"/newsletter"}
        element={<LoggedRoute 
          
        currentProfile={currentProfile}><ApplyContainer/></LoggedRoute>}/>

      <Route
      path={Paths.myProfile()}
      element={
        <PrivateRoute       currentProfile={props.currentProfile} >
          <MyProfileContainer
          currentProfile={currentProfile}
                             presentingElement={page}
                             pagesInView={props.pagesInView} 
                              booksInView={props.booksInView}
                          
                              />
       </PrivateRoute>
      }
    />
      <Route path={Paths.workshop.reader()}
    element={<PrivateRoute       currentProfile={props.currentProfile}><WorkshopContainer/></PrivateRoute>}/>
    <Route 
    path={Paths.workshop.route()}
    element={<PrivateRoute
      currentProfile={props.currentProfile}
    ><WorkshopContainer/></PrivateRoute>}/>
    <Route path="/profile/:id" element={
      <ProfileContainer profile={profileInView}/>
      }/>
    <Route path="/subscribe" 
    element={<EmailPreferences/>}/>
    <Route path="*" element={<NotFound/>}/>
    <Route  
        path={Paths.editor.image()}
        element={ 
          <PrivateRoute currentProfile={currentProfile}>
            
          <EditorContainer 
          
presentingElement={page}
            />
      </PrivateRoute>
        }/>

       <Route
     path={Paths.editor.link()}
      element={
        <PrivateRoute 
        currentProfile={currentProfile}
        >
            <EditorContainer 
         
              />
        </PrivateRoute>
      }/>
      <Route path={Paths.page.route()} element={
          <PageViewContainer page={props.pageInView}/>}
    /> 
       <Route
      path={Paths.editPage.route()}
      element={
        <PrivateRoute currentProfile={currentProfile} >
            <EditorContainer 
              htmlContent={props.htmlContent} 
              currentProfile={currentProfile} 
              />
        </PrivateRoute>
      }/>

      <Route path="/profile/edit" element={
 
        <PrivateRoute currentProfile={currentProfile} >
        <SettingsContainer />
        </PrivateRoute>
      }/>
       <Route path={"/terms"} element={
          <TermsContainer />}
    /> 
    </Routes>
    </div>
   
      {navbarBot&&showNav?
   <div className="fixed w-[100vw] bottom-0 shadow-lg z-50 bg-white">
  <NavbarContainer currentProfile={currentProfile} />
</div>

     :null}  
       {/* </div> */}

    </IonPage>
    
  
   
    </Context.Provider>
    {/* </div> */}
    </IonApp>
  );
}

function mapDispatchToProps(dispatch){
  return{ 

    getPublicLibraries:()=>dispatch(getPublicLibraries()),
    getPublicStories:()=>dispatch(getPublicStories()),
     setSignedInTrue:()=>dispatch(setSignedInTrue()),
    setSignedInFalse:()=>dispatch(setSignedInFalse()),
  }
}
function mapStateToProps(state){
  return{
    profile: state.users.profileInView,
    signedIn: state.users.signedIn,
    currentProfile: state.users.currentProfile,
    pageInView: state.pages.pageInView,
    pagesInView: state.pages.pagesInView,
   
    bookLoading: state.books.loading,
    userLoading: state.users.loading
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)