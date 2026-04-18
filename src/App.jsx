import './App.css';
import { useDispatch,connect,useSelector} from "react-redux"
import {  useEffect, useLayoutEffect, useRef, useState } from 'react';
import {  getPublicStories } from './actions/PageActions.jsx';
import LogInContainer from './container/auth/LogInContainer';
import NavbarContainer from './container/NavbarContainer';
import EditorContainer from './container/page/EditorContainer'
import PageViewContainer from './container/page/PageViewContainer'
import MyProfileContainer from './container/MyProfileContainer';
import SettingsContainer from './container/SettingsContainer';
import ProfileContainer from './container/profile/ProfileContainer.jsx';
import SearchDialog from './components/SearchDialog';
import PrivacyNoticeContrainer from './container/PrivacyNoticeContainer.jsx';
import {  
          setSignedInTrue,
          setSignedInFalse,
          getCurrentProfile,
      
      } from './actions/UserActions'
      import { IonApp, setupIonicReact, IonRouterOutlet,  useIonRouter, IonFooter, useIonViewWillEnter, IonLoading} from '@ionic/react';
 import LoggedRoute from './LoggedRoute';
import PrivateRoute from './PrivateRoute';

import Paths from './core/paths';
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
import { IonReactRouter} from "@ionic/react-router"
import ErrorBoundary from './ErrorBoundary.jsx';
import { Redirect, Route, useLocation } from 'react-router-dom'
import AboutContainer from './container/AboutContainer.jsx';
import PageWrapper from './core/PageWrapper.jsx';
import DashboardContainer from './container/DashboardContainer.jsx';
import { LoadScript } from '@react-google-maps/api';
import ContentHubContainer from './container/ContentHubContainer.jsx';
import DiscoveryContainer from './container/DiscoveryContainer.jsx';
import { SplashScreen } from '@capacitor/splash-screen';
import OAuthCallback from './container/page/OauthCallback.jsx';
// import '@ionic/react/css/palettes/dark.always.css';

import initSocialLogin from './components/initSocialLogin.jsx';
setupIonicReact()

const libraries = ["places"];
function App(props) {
  const {currentProfile} =props
const isHorizPhone = useMediaQuery({ query: '(min-width: 800px)' });
const {loading}=useSelector(state=>state.users)

  const isNative = Capacitor.isNativePlatform()

  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const dispatch = useDispatch()
  const [formerPage, setFormerPage] = useState(null);


const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;

initSocialLogin(CLIENT_ID, IOS_CLIENT_ID);


const ionRouter = useIonRouter();

  const [seo,setSeo]=useState({title:"Plumbum",heading:"Plumbum" ,image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website",url:"https://plumbum.app"})

const [presentingEl, setPresentingEl] = useState(null);
  const [success,setSuccess]=useState(null)
  const [error,setError]=useState(null)
const [token,setToken]=useState(null)
const [chuecking,setChecking]=useState(null)
  const {dialog,loading:userLoading} = useSelector(state=>state.users)

const hasFetchedProfile = useRef(false);
useEffect(()=>{
  const loadToken = async ()=>{
 const {value:token}= await Preferences.get({key:"token"})
 setToken(token)
  }
loadToken()
},[])
useEffect(() => {
  if (token && !hasFetchedProfile.current) {
    hasFetchedProfile.current = true;
    dispatch(getCurrentProfile());
  }
}, [token]);

document.documentElement.classList.add('dark');
useIonViewWillEnter(() => {
  const checkFirstLaunch = async () => {
        if (isNative) {
      const { value } = await Preferences.get({ key: 'hasSeenOnboarding' });
      if (value === null) {
        await Preferences.set({ key: "hasSeenOnboarding", value: 'true' });
  
      }else if(currentProfile){
        
        

        return
      }
  

    }
    setFirstLaunchChecked(true);
  };
 checkFirstLaunch();
}, [isNative]);
 useIonViewWillEnter(()=>{
    const splash = async ()=>await SplashScreen.show({
      showDuration:3000,
      autoHide: true,
      fadeInDuration:1000
  })
  splash()

 },[])

const isDesktop = useMediaQuery({ query: '(min-width: 60.1em)' }) // 768px
const isMobileOrTablet = useMediaQuery({ query: '(max-width: 60em)' })

const showTopNavbar = isDesktop && !isNative

const location = ionRouter?.routeInfo?.pathname

const hiddenPaths = ["/onboard", "/apply", "/login"];

const showBottomNavbar =
  ((isNative && !hiddenPaths.includes(location))||import.meta.env.VITE_NODE_ENV=="dev"); 

 return (

    <ErrorBoundary>
        <Context.Provider value={{setPresentingEl,isDesktop,isTablet:isMobileOrTablet,isPhone:isMobileOrTablet,isNotPhone:!isMobileOrTablet,isHorizPhone,seo,setSeo,formerPage,setFormerPage,setError,setSuccess,success}}>

    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >

  <IonApp>
  <IonReactRouter>
       {showTopNavbar &&
  <div className="fixed top-0 left-0 w-full z-50 w-[100%]">
    <NavbarContainer isDesktop={isDesktop} currentProfile={currentProfile} />
  </div>
}

              <div >
 
    
       
       <Dialog dialog={dialog} presentingElement={presentingEl} />
      
<Alert />
<div  >
    <IonRouterOutlet>   
       
 
     <Route exact path="/" render={() => 
         <PageWrapper>{
          currentProfile&&isNative?<ContentHubContainer/>:
  currentProfile? 
  <Redirect to={Paths.home} />:  
  isFirstLaunch && isNative?<Redirect to={Paths.onboard}/>:<Redirect to={Paths.about()}/>   }
     </PageWrapper>}
/>
<Route exact path="/about" render={() => 
    <PageWrapper  showBackbutton={false} >
     <AboutContainer/></PageWrapper>}
/>
<Route exact path="/search" render={() => 
<PageWrapper showSearchButton={false}>
     <SearchDialog /></PageWrapper>}
/>


   
      <Route path={Paths.onboard} render={()=><PageWrapper showBackbutton={false}  presentHeader={false}><OnboardingContainer/></PageWrapper>}/>


            <Route exact path={Paths.notifications()}
            render={()=><PageWrapper><PrivateRoute >
              <NotificationContainer currentProfile={currentProfile}/></PrivateRoute></PageWrapper>}/>
              <Route exact path={Paths.login}
                  render={()=> 
      
        <PageWrapper presentHeader={false
        
        } >
      {/* <LoggedRoute> */}

            <LogInContainer  currentProfile={currentProfile} logIn={props.logIn}/>
          {/* </LoggedRoute> */}
                     </PageWrapper>
         

       }
     />
    <Route
  path={Paths.home}
  render={() =>

      <PageWrapper showBackbutton={false}>
            <PrivateRoute>
        <ContentHubContainer />
        </PrivateRoute>
      </PageWrapper>

  }
/>
     <Route 
    exact path={Paths.dashboard}>

        <PageWrapper>
                <PrivateRoute>
          <DashboardContainer/>
          </PrivateRoute>
        </PageWrapper>
     
    </Route>
    <Route exact path={Paths.myProfile}
      render={()=>  
        <PageWrapper showBackbutton={false} >
          <PrivateRoute>
          <MyProfileContainer

                       
                      
                           />
                           </PrivateRoute> 
                           </PageWrapper>
                          }
    />
          <Route exact path="/discovery" 
                render={()=>
                   <PageWrapper showBackbutton={false} presentHeader={false} showSearchButton={true}> 
                    <DiscoveryContainer/>
                     </PageWrapper>
                      
                  
                  }
            />
          <Route exact path={"/privacy"}
                  render={()=><PageWrapper><PrivacyNoticeContrainer/></PageWrapper>}
                  />
    
      <Route exact path={Paths.calendar()}
     render={()=><PageWrapper showBackbutton={false} ><CalendarContainer/></PageWrapper>}/>
          <Route exact path={Paths.newsletter() }
     render={()=><LoggedRoute 
 currentProfile={currentProfile}
     ><PageWrapper><NewsletterContainer/></PageWrapper></LoggedRoute>}/>
     <Route exact path={'/reset-password' }
     render={()=><PageWrapper><ResetPasswordContainer/></PageWrapper>}/>
     <Route path={Paths.collection.route()}
     render={()=><PageWrapper><CollectionContainer currentProfile={currentProfile}/></PageWrapper>}/>
     <Route path={'/signup'}
                render={()=>
                            <PageWrapper>
                              <SignUpContainer/></PageWrapper>
                        }/>
      <Route path={'/register'}
                render={()=><LoggedRoute 
                    currentProfile={currentProfile}><PageWrapper>
                        <UserReferralContainer/></PageWrapper></LoggedRoute>}/>
       <Route path={Paths.feedback()}
            render={()=><PageWrapper><FeedbackContainer/></PageWrapper>}/>
     <Route path={Paths.addToCollection.route}
               render={()=>   <PageWrapper><PrivateRoute>
          <AddToCollectionContainer/>
   
            </PrivateRoute>   </PageWrapper>}/>
     <Route 
            path={Paths.addStoryToCollection.route}
              render={()=> <PageWrapper> <PrivateRoute 
                
                    >
                          
                            <AddStoryToCollectionContainer/> 
                      </PrivateRoute> </PageWrapper> }/>
     <Route path={Paths.editCollection.route()}
      render={()=>
          <PageWrapper>  
      <PrivateRoute 
        currentProfile={currentProfile}
      >      <EditCollectionContainer/>
      </PrivateRoute>  </PageWrapper> }/>
     

       <Route path={Paths.hashtag.route()}
            render={()=>
                <PageWrapper> 
            <HashtagContainer/>  </PageWrapper> 
          }/>
        <Route path={Paths.links()}
                 render={()=>  <PageWrapper> <LinksContainer/>  </PageWrapper> }
          />
      

      <Route path={Paths.workshop.reader()}
    render={()=><PageWrapper   showBackbutton={false}><PrivateRoute      
     currentProfile={props.currentProfile}>  <WorkshopContainer/>  </PrivateRoute> </PageWrapper>}/>
    <Route 
    path={Paths.workshop.route()}
    render={()=><PageWrapper key={Paths.workshop.route()} showBackbutton={false}><PrivateRoute
     key={Paths.workshop.route()}
      currentProfile={props.currentProfile}
    >   <WorkshopContainer
    
     key={Paths.workshop.route()}
     /> </PrivateRoute> </PageWrapper> }/>
    <Route path="/profile/:id/view" render={()=>
      <PageWrapper key={"/profile/:id/view"} >   <ProfileContainer  key={"/profile/:id/view"} />  </PageWrapper> 
      }/>

 
    <Route path="/subscribe" 
    render={()=>  <PageWrapper> <EmailPreferences/>  </PageWrapper> }/>
   
    <Route  
       exact path={"/story/:type/edit"}
        render={()=>       <PageWrapper>  
          <PrivateRoute>
       
          <EditorContainer 
    htmlContent={props.htmlContent} 
        currentProfile={currentProfile} 
            />  
      </PrivateRoute>
      </PageWrapper> 
        }/>
<Route
 exact path={Paths.editPage.route}
  render={() =>
    <PageWrapper>
    <PrivateRoute>
      
        <EditorContainer 
        htmlContent={props.htmlContent} 
        currentProfile={currentProfile} 
              />
 
    </PrivateRoute>
         </PageWrapper>
  }
/>
      <Route path={Paths.page.route()} render={()=>
        <PageWrapper> 
          <PageViewContainer page={props.pageInView}/>  </PageWrapper> }
    /> 


      <Route path={Paths.editProfile} render={()=>
  <PageWrapper showBackbutton={false}> 
        <PrivateRoute  >
           
        <SettingsContainer />
      
        </PrivateRoute>
            </PageWrapper> 
      }/>
       <Route path={"/terms"} render={()=>
         <PageWrapper> 
          <TermsContainer />  </PageWrapper> }
    /> 
  <Route
  exact
  path="/oauth2callback"
  render={() => (
    <PageWrapper presenHeader={false}>
      <OAuthCallback />
    </PageWrapper>
  )}
/>
   </IonRouterOutlet>
</div>

       {showBottomNavbar&&
          <IonFooter>
   <div className=" bg-cream">
  <NavbarContainer isDesktop={isDesktop} currentProfile={currentProfile} />
</div>
</IonFooter>
     }   
     </div>
{/* </IonPage>  */}
      </IonReactRouter>
      
    </IonApp>
</LoadScript>
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




