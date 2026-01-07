import './App.css';
import { useDispatch,connect,useSelector} from "react-redux"
import { useEffect, useState ,useRef} from 'react';
import {  getPublicStories } from './actions/PageActions.jsx';
import LogInContainer from './container/auth/LogInContainer';
import NavbarContainer from './container/NavbarContainer';
import DiscoveryContainer from './container/DiscoveryContainer.jsx';
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
      import { IonApp, setupIonicReact, IonRouterOutlet} from '@ionic/react';
      import { IonContent,IonPage } from '@ionic/react';
 import LoggedRoute from './LoggedRoute';
import PrivateRoute from './PrivateRoute';

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
import { useMediaQuery } from 'react-responsive';
import { Preferences } from '@capacitor/preferences';
import OnboardingContainer from './container/OnboardingContainer.jsx';
import Dialog from './components/Dialog.jsx';
import { Capacitor } from '@capacitor/core';
import { IonReactRouter } from '@ionic/react-router';
import ErrorBoundary from './ErrorBoundary.jsx';
import { Redirect, Route } from 'react-router-dom'
setupIonicReact()
function App(props) {
  const {currentProfile} = props
  
  useEffect(()=>{
    if(!currentProfile){
      Preferences.clear().then()
    }
  },[currentProfile])
  // const router = useIonRouter()
  const isPhone = useMediaQuery({ query: '(max-width: 800px)' });
const isHorizPhone = useMediaQuery({ query: '(min-width: 800px)' });

    const isTablet =  useMediaQuery({
    query: '(max-width: 1100px)'
  })
  const isNative = Capacitor.isNativePlatform()

  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const dispatch = useDispatch()
  const [formerPage, setFormerPage] = useState(null);
  const [isSaved,setIsSaved]=useState(true)
  const profileInView = useSelector(state=>state.users.profileInView)

  const [seo,setSeo]=useState({title:"Plumbum",heading:"Plumbum" ,image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website",url:"https://plumbum.app"})

  const [olderPath,setOlderPath]=useState(null)

  const [success,setSuccess]=useState(null)
  const [error,setError]=useState(null)
  const page = useRef(null);
  const dialog = useSelector(state=>state.users.dialog??{text:"",title:"",agree:()=>{},onClose:()=>{},isOpen:false,agreeText:"agree",disagreeText:"Close"})


//   useEffect(()=>{
//       dispatch(getCurrentProfile()).then(res=>{
//          currentProfile&&currentProfile.id && dispatch(fetchNotifcations({profile:currentProfile}))
//       })
//   },[])
// useEffect(() => {
//     dispatch(getCurrentProfile()).then(() => {
//       if (currentProfile?.id) {
//         dispatch(fetchNotifcations({ profile: currentProfile }));
//       }
//     });
//   }, [dispatch]);

const [firstLaunchChecked, setFirstLaunchChecked] = useState(false);

useEffect(() => {
  const checkFirstLaunch = async () => {
    if (isNative) {
      const { value } = await Preferences.get({ key: 'hasSeenOnboarding' });
      if (value === null) {
        await Preferences.set({ key: "hasSeenOnboarding", value: 'true' });
        setIsFirstLaunch(true);
      }
    }
    setFirstLaunchChecked(true);
  };
  checkFirstLaunch();
}, [isNative]);



  const showNav = !(Capacitor.isNativePlatform()&&(location.includes("/signup")||location.includes("/login"))||(Capacitor.isNativePlatform()&&location.includes("/onboard")))
const navbarBot = ((Capacitor.isNativePlatform()||isTablet))

// if(!status.connected){f
//   return (
//       <IonApp >
//         <Context.Provider value={{isTablet,isPhone,isNotPhone:!isPhone,isHorizPhone,seo,setSeo,currentProfile:currentProfile,formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>
    
//     <IonPage>
//       <IonContent fullscreen={true}>
//         {!navbarBot?  <NavbarContainer/>:null}
//     <div className='flex flex-col text-emerald-800 justify-between text-opacity-70 lora-bold w-[100%] h-[100%] flex'>
//         <div className='mx-auto my-24 text-center'>
//       <IonText className='text-xl'>No Internet</IonText>
//       {/* <p>The page you are looking for does not exist.</p> */}
//       </div>
//         {navbarBot&&showNav? <NavbarContainer/>:null}
//     </div>
  
//     </IonContent>
//     </IonPage>
//     </Context.Provider>
//     </IonApp>
//   );

// }
console.log(currentProfile)
 return (

    <ErrorBoundary>
        <Context.Provider value={{isTablet,isPhone,isNotPhone:!isPhone,isHorizPhone,seo,setSeo,currentProfile:currentProfile,formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>

  <IonApp>
  <IonReactRouter>
      
      <IonPage ref={page}>
        <IonContent fullscreen={true}>   
           {!navbarBot?<div className='fixed h-[4rem] top-0 w-[100vw] shadow-lg z-50'>
           <NavbarContainer 
    
        currentProfile={currentProfile}/></div>:null}
              
 
       <SearchDialog  presentingElement={page} />
       <Dialog dialog={dialog} presentingElement={page} />
<Alert />
    <IonRouterOutlet>   

       

      {/* <IonRouterOutlet > */}
 
     <Route exact path="/" render={() => 
     isFirstLaunch?<Redirect to={Paths.onboard} />:<Redirect to={Paths.login()}/>}
/>

      <Route path={Paths.login()} render={()=><LogInContainer/>}/> 
      <Route path={Paths.onboard} render={()=><OnboardingContainer/>}/>


            <Route exact path={Paths.notifications()}
            render={()=><PrivateRoute currentProfile={currentProfile}>
              <NotificationContainer currentProfile={currentProfile}/></PrivateRoute>}/>
    
          <Route exact path="/discovery" 
                render={()=>
                    <DiscoveryContainer 
                     
                      
                    />
                  }
            />
          <Route exact path={"/privacy"}
                  render={()=><PrivacyNoticeContrainer/>}
                  />
          <Route exact path="/login"  
                  render={()=> 
        <LoggedRoute 
        currentProfile={currentProfile}
        >
            <LogInContainer  currentProfile={currentProfile} logIn={props.logIn}/>
            </LoggedRoute>
          
       }
     />
      <Route exact path={Paths.calendar()}
     render={()=><CalendarContainer/>}/>
          <Route exact path={Paths.newsletter() }
     render={()=><LoggedRoute 
 currentProfile={currentProfile}
     ><NewsletterContainer/></LoggedRoute>}/>
     <Route exact path={'/reset-password' }
     render={()=><ResetPasswordContainer/>}/>
     <Route path={Paths.collection.route()}
     render={()=><CollectionContainer currentProfile={currentProfile}/>}/>
     <Route path={'/signup'}
                render={()=><LoggedRoute 
                            currentProfile={currentProfile}>
                              <SignUpContainer/>
                          </LoggedRoute>}/>
      <Route path={'/register'}
                render={()=><LoggedRoute 
                    currentProfile={currentProfile}>
                        <UserReferralContainer/></LoggedRoute>}/>
       <Route path={Paths.feedback()}
            render={()=><FeedbackContainer/>}/>
     <Route path={Paths.addToCollection.route}
               render={()=> <PrivateRoute
      currentProfile={currentProfile}
      ><AddToCollectionContainer/>
            </PrivateRoute>}/>
     <Route 
            path={Paths.addStoryToCollection.route}
              render={()=><PrivateRoute 
                 currentProfile={currentProfile}
                    ><AddStoryToCollectionContainer/>
                      </PrivateRoute>}/>
     <Route path={Paths.editCollection.route()}
      render={()=>
      <PrivateRoute 
        currentProfile={currentProfile}
      >       <EditCollectionContainer/>
      </PrivateRoute>}/>
     

       <Route path={Paths.hashtag.route()}
            render={()=>
            <HashtagContainer/>
          }/>
        <Route path={Paths.links()}
                 render={()=><LinksContainer/>}
          />
        <Route path={Paths.onboard}
                  render={()=><LoggedRoute
                    
           currentProfile={currentProfile}><ApplyContainer/></LoggedRoute>}/>
         <Route path={Paths.apply()+"/newsletter"}
        render={()=><LoggedRoute 
          
        currentProfile={currentProfile}><ApplyContainer/></LoggedRoute>}/>

      <Route
      path={Paths.myProfile}
      render={()=>
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
    render={()=><PrivateRoute      
     currentProfile={props.currentProfile}><WorkshopContainer/></PrivateRoute>}/>
    <Route 
    path={Paths.workshop.route()}
    render={()=><PrivateRoute
      currentProfile={props.currentProfile}
    ><WorkshopContainer/></PrivateRoute>}/>
    <Route path="/profile/:id" render={()=>
      <ProfileContainer/>
      }/>
    <Route path="/subscribe" 
    render={()=><EmailPreferences/>}/>
    {/* <Route path="*" render={()=><NotFound/>}/> */}
    <Route  
        path={"/story/:type/edit"}
        render={()=> 
          <PrivateRoute currentProfile={currentProfile}>
            
          <EditorContainer 
          
presentingElement={page}
            />
      </PrivateRoute>
        }/>

     
      <Route path={Paths.page.route()} render={()=>
          <PageViewContainer page={props.pageInView}/>}
    /> 
       <Route
      path={Paths.editPage.route()}
      render={()=>
        <PrivateRoute currentProfile={currentProfile} >
            <EditorContainer 
              htmlContent={props.htmlContent} 
              currentProfile={currentProfile} 
              />
        </PrivateRoute>
      }/>

      <Route path="/profile/edit" render={()=>
 
        <PrivateRoute  >
        <SettingsContainer />
        </PrivateRoute>
      }/>
       <Route path={"/terms"} render={()=>
          <TermsContainer />}
    /> 
  
   </IonRouterOutlet>
       {navbarBot&&showNav?
   <div className="fixed w-[100vw] bottom-0 shadow-lg z-50 bg-white">
  <NavbarContainer currentProfile={currentProfile} />
</div>

     :null}  
</IonContent></IonPage> 
      </IonReactRouter>
      
    </IonApp>
  </Context.Provider>
  </ErrorBoundary>
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