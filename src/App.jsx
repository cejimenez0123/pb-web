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
      import { IonApp, IonPage } from '@ionic/react';
import PrivateRoute from './PrivateRoute';
import LoggedRoute from './LoggedRoute';
import Paths from './core/paths';
import AboutContainer from './container/AboutContainer';
import  Context from "./context"
import AddStoryToCollectionContainer from './container/collection/AddStoryToCollection';
import CollectionContainer from './container/collection/CollectionContainer';
import AddToCollectionContainer from './container/collection/AddToCollection';
import EditCollectionContainer from './container/collection/EditCollectionContainer.jsx';
import SignUpContainer from './container/auth/SignUpContainer.jsx';
import WorkshopContainer from './container/collection/WorkshopContainer.jsx';
import ResetPasswordContainer from './container/auth/ResetPassword.jsx';
import Alert from './components/Alert.jsx';
import { getRecommendedCollectionsProfile } from './actions/CollectionActions.js';
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
import DeviceCheck from './components/DeviceCheck.jsx';
import Dialog from './components/Dialog.jsx';
import getLocalStore from './core/getLocalStore.jsx';
import setLocalStore from './core/setLocalStore.jsx';



function App(props) {
  const navigate = useNavigate()
  const isNative = DeviceCheck()
  const isPhone = useMediaQuery({ query: '(max-width: 750px)' });
  const isHorizPhone =  useMediaQuery({
    query: '(min-width: 750px)'
  })

  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const dispatch = useDispatch()
  const [formerPage, setFormerPage] = useState(null);
  const [isSaved,setIsSaved]=useState(true)
  const profile = useSelector(state=>state.users.profileInView)
  const [token,setToken]=useState(null)
 
  const [seo,setSeo]=useState({title:"Plumbum",heading:"Plumbum" ,image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website",url:"https://plumbum.app"})
   const currentProfile = useSelector(state=>state.users.currentProfile)
  const [olderPath,setOlderPath]=useState(null)
  const location = useLocation()
  const [success,setSuccess]=useState(null)
  const [error,setError]=useState(null)
  const page = useRef(null);
  const dialog = useSelector(state=>state.users.dialog??{text:"",title:"",agree:()=>{},onClose:()=>{},isOpen:false,agreeText:"agree",disagreeText:"Close"})
  useEffect(()=>{
    if(currentProfile){
      dispatch(getRecommendedCollectionsProfile())
    }
    getLocalStore("token",isNative).then(toke=>setToken(toke))
  }
    
  ,[])
useEffect(()=>{
 
  

if(token&&!currentProfile){
    dispatch(getCurrentProfile({token,isNative}))
}
  },[token])
  useEffect(()=>{
  
      setOlderPath(location.pathname)
  
  },[location.pathname])
  useEffect(() => {
    if(currentProfile){
      navigate(Paths.myProfile())
      return
    }
    
    if (isFirstLaunch&&!currentProfile&&isNative) {
    
     return
    }
  }, [currentProfile]);
  useEffect(() => {
    const checkFirstLaunch = async () => {
    
      let value = await getLocalStore('hasSeenOnboarding',isNative)
      if (value === null) {
        setLocalStore("hasSeenOnboarding",true,isNative)
    
        setIsFirstLaunch(true);
        navigate("/onboarding")
      } else {
        setIsFirstLaunch(false);
      }
    };

   return ()=>{checkFirstLaunch()}
  }, []);
  
  return (
    <IonApp >   
      <Context.Provider value={{isPhone,isHorizPhone,seo,setSeo,currentProfile,formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>

      <IonPage  ref={page} className=' App pb-8 pt-12 background-blur bg-gradient-to-br from-slate-100 to-emerald-100'>
     

      <head>
  <meta charset="UTF-8" />
  <Helmet>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description}/>
  <meta property="og:title" content={seo.heading}/>
  <meta property="og:description" content={seo.description}/>
  <meta property="og:image" content={seo.logoChem} />
  <meta property="og:url" content={seo.url} />
  </Helmet>
</head>
    

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
      
   
      
       
     
        {!isPhone&&!location.pathname.includes("/onboard")&&!location.pathname.includes("/signup")?<div className='fixed h-[4rem] top-0 w-[100vw] shadow-lg z-50'>
           <NavbarContainer 
    
        currentProfile={currentProfile}/></div>:null}
       <SearchDialog presentingElement={page} />
       <Dialog dialog={dialog} presentingElement={page} />
<Alert />
<div >
      <Routes >
     <Route path='/' element={<AboutContainer/>}/>
      <Route path={"/login"} element={<LogInContainer/>}/> 
      <Route path={"/onboard"} element={<OnboardingContainer/>}/>

          <Route path={Paths.home()} 
                        element={
                          <PrivateRoute>
                          <DashboardContainer 
                          /></PrivateRoute>
                        }
            />
            <Route exact path={Paths.notifications()}
            element={<PrivateRoute><NotificationContainer currentProfile={currentProfile}/></PrivateRoute>}/>
    
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
        <LoggedRoute loggedOut={!currentProfile}
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
      loggedOut={!currentProfile}
     currentProfile={currentProfile}><NewsletterContainer/></LoggedRoute>}/>
     <Route exact path={'/reset-password' }
     element={<ResetPasswordContainer/>}/>
     <Route path={Paths.collection.route()}
     element={<CollectionContainer/>}/>
     <Route path={'/signup'}
     element={<LoggedRoute 
      loggedOut={!currentProfile}
      currentProfile={currentProfile}><SignUpContainer/></LoggedRoute>}/>
       <Route path={'/register'}
     element={<LoggedRoute 
      loggedOut={!currentProfile}
      currentProfile={currentProfile}><UserReferralContainer/></LoggedRoute>}/>
       <Route path={Paths.feedback()}
     element={<FeedbackContainer/>}/>
     <Route path={Paths.addToCollection.route}
     element={        <PrivateRoute
    
      ><AddToCollectionContainer/></PrivateRoute>}/>
     <Route path={Paths.addStoryToCollection.route}
     element={<PrivateRoute 
     
     ><AddStoryToCollectionContainer/></PrivateRoute>}/>
     <Route path={Paths.editCollection.route()}
      element={<PrivateRoute 
      ><EditCollectionContainer/></PrivateRoute>}/>
     

       <Route path={Paths.hashtag.route()}
      element={<HashtagContainer/>}/>
     <Route path={Paths.links()}
     element={<LinksContainer/>}/>

   
 
        <Route path={Paths.apply()}
        element={<LoggedRoute
          loggedOut={!currentProfile}
           currentProfile={currentProfile}><ApplyContainer/></LoggedRoute>}/>
         <Route path={Paths.apply()+"/newsletter"}
        element={<LoggedRoute 
          loggedOut={!currentProfile}
        currentProfile={currentProfile}><ApplyContainer/></LoggedRoute>}/>

      <Route
      path={Paths.myProfile()}
      element={
        <PrivateRoute >
          <MyProfileContainer profile={props.currentProfile} 
          currentProfile={currentProfile}
                             presentingElement={page}
                             pagesInView={props.pagesInView} 
                              booksInView={props.booksInView}
                          
                              />
       </PrivateRoute>
      }
    />
      <Route path={Paths.workshop.reader()}
    element={<PrivateRoute><WorkshopContainer/></PrivateRoute>}/>
    <Route 
    path={Paths.workshop.route()}
    element={<PrivateRoute><WorkshopContainer/></PrivateRoute>}/>
    <Route path="/profile/:id" element={
      <ProfileContainer profile={profile}/>
      }/>
    <Route path="/subscribe" 
    element={<EmailPreferences/>}/>
    <Route path="*" element={<NotFound/>}/>
    

    <Route  
        path={Paths.editor.image()}
        element={ 
          <PrivateRoute >
            
          <EditorContainer 
          

            />
      </PrivateRoute>
        }/>

       <Route
      exact path={Paths.editor.link()}
      element={
        <PrivateRoute 
      
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
        <PrivateRoute >
            <EditorContainer 
              htmlContent={props.htmlContent} 
              currentProfile={props.currentProfile} 
              />
        </PrivateRoute>
      }/>

      <Route path="/profile/edit" element={
 
        <PrivateRoute >
        <SettingsContainer />
        </PrivateRoute>
      }/>
      
    </Routes>
    </div>
    {isPhone&&!location.pathname.includes("/onboard")&&!location.pathname.includes("/signup")?<div className='fixed bottom-0 w-[100vw] shadow-lg z-50'> 
    <NavbarContainer 
        // loggedIn={currentProfile}
        currentProfile={currentProfile}/></div>:null}
       
    </IonPage>
    
    {/* </div> */}
    {/* </div> */}
   
    </Context.Provider>
    </IonApp>
  );
}

function mapDispatchToProps(dispatch){
  return{ 

    getPublicLibraries:()=>dispatch(getPublicLibraries()),
    getPublicStories:()=>dispatch(getPublicStories()),
    // fetchHomeCollection:(params)=>dispatch(fetchHomeCollection(params)),
    setSignedInTrue:()=>dispatch(setSignedInTrue()),
    setSignedInFalse:()=>dispatch(setSignedInFalse()),
  }
}
function mapStateToProps(state){
  return{
    profile: state.users.profileInView,
    signedIn: state.users.signedIn,
    // bookInView: state.books.bookInView,
    // booksInView: state.books.booksInView,
    currentProfile: state.users.currentProfile,
    pageInView: state.pages.pageInView,
    pagesInView: state.pages.pagesInView,
   
    bookLoading: state.books.loading,
    userLoading: state.users.loading
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)