import './App.css';
import { useDispatch,connect,useSelector} from "react-redux"
import { useEffect, useState ,useRef, useLayoutEffect, useContext} from 'react';
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
      import { IonApp, setupIonicReact, IonRouterOutlet, IonText, useIonRouter, IonFooter} from '@ionic/react';
      import { IonContent,IonPage } from '@ionic/react';
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
import { Redirect, Route } from 'react-router-dom'
import AboutContainer from './container/AboutContainer.jsx';
import PageWrapper from './core/PageWrapper.jsx';

setupIonicReact()


function App(props) {
  const {currentProfile} =props
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



const ionRouter = useIonRouter();
const location = ionRouter.routeInfo?.pathname ?? "";

  const [seo,setSeo]=useState({title:"Plumbum",heading:"Plumbum" ,image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website",url:"https://plumbum.app"})

const [presentingEl, setPresentingEl] = useState(null);
  const [success,setSuccess]=useState(null)
  const [error,setError]=useState(null)

  const dialog = useSelector(state=>state.users.dialog)



const [firstLaunchChecked, setFirstLaunchChecked] = useState(false);
  const initAuth = async () => {
    const { value } = await Preferences.get({ key: "token" });
    if (value ) {
      // This triggers the Redux action to fill currentProfile
      dispatch(getCurrentProfile()); 
    }
  };
useEffect(() => {

  return ()=>initAuth();
}, [dispatch]);
useLayoutEffect(()=>{
  initAuth()
},[])
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

  


  const showNav = !(
  Capacitor.isNativePlatform() &&
  (location.includes("/signup") ||
   location.includes("/login") ||
   location.includes("/onboard"))
);
const navbarBot = Capacitor.isNativePlatform() || isTablet;


 return (

    <ErrorBoundary>
        <Context.Provider value={{ setPresentingEl,isTablet,isPhone,isNotPhone:!isPhone,isHorizPhone,seo,setSeo,formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>

  <IonApp>
  <IonReactRouter>
      
      {/* <IonPage ref={page} style={{ "--padding-bottom": "20rem" }}  > */}
        {/* <IonContent fullscreen={true}> */}
             
           {!navbarBot?<div className='fixed h-[4rem] top-0 w-[100vw] shadow-lg z-50'>
           <NavbarContainer 
    
        currentProfile={currentProfile}/></div>:null}
              <div >
 
       {/* <SearchDialog  presentingElement={page} /> */}
       
       <Dialog dialog={dialog} presentingElement={presentingEl} />
<Alert />
    <IonRouterOutlet>   
       <Route exact path={Paths.login()}
                  render={()=> 
             
        <LoggedRoute 
        currentProfile={currentProfile}
        >  <PageWrapper>
            <LogInContainer  currentProfile={currentProfile} logIn={props.logIn}/>
                      </PageWrapper>
            </LoggedRoute>

       }
     />
     <Route exact path="/" render={() => 
         <PageWrapper>{
     isFirstLaunch?Capacitor.isNativePlatform()?<Redirect to={Paths.onboard} />:<Redirect to={Paths.about()}/>:<Redirect to={Paths.login()}/>}   
     </PageWrapper>}
/>
<Route exact path="/about" render={() => 
    <PageWrapper>
     <AboutContainer/></PageWrapper>}
/>
<Route exact path="/search" render={() => 
     <SearchDialog />}
/>


   
      <Route path={Paths.onboard} render={()=><PageWrapper><OnboardingContainer/></PageWrapper>}/>


            <Route exact path={Paths.notifications()}
            render={()=><PrivateRoute currentProfile={currentProfile}><PageWrapper>
              <NotificationContainer currentProfile={currentProfile}/></PageWrapper></PrivateRoute>}/>
         <Route
    exact path={Paths.myProfile}
      render={()=>  <PrivateRoute>
        <PageWrapper> 
          <MyProfileContainer

                       
                      
                           />
                           </PageWrapper>
                           </PrivateRoute> }
    />
          <Route exact path="/discovery" 
                render={()=>
                   <PageWrapper> 
                    <DiscoveryContainer/>
                     </PageWrapper>
                      
                  
                  }
            />
          <Route exact path={"/privacy"}
                  render={()=><PageWrapper><PrivacyNoticeContrainer/></PageWrapper>}
                  />
    
      <Route exact path={Paths.calendar()}
     render={()=><PageWrapper><CalendarContainer/></PageWrapper>}/>
          <Route exact path={Paths.newsletter() }
     render={()=><LoggedRoute 
 currentProfile={currentProfile}
     ><PageWrapper><NewsletterContainer/></PageWrapper></LoggedRoute>}/>
     <Route exact path={'/reset-password' }
     render={()=><PageWrapper><ResetPasswordContainer/></PageWrapper>}/>
     <Route path={Paths.collection.route()}
     render={()=><PageWrapper><CollectionContainer currentProfile={currentProfile}/></PageWrapper>}/>
     <Route path={'/signup'}
                render={()=><LoggedRoute 
                            currentProfile={currentProfile}><PageWrapper>
                              <SignUpContainer/></PageWrapper>
                          </LoggedRoute>}/>
      <Route path={'/register'}
                render={()=><LoggedRoute 
                    currentProfile={currentProfile}><PageWrapper>
                        <UserReferralContainer/></PageWrapper></LoggedRoute>}/>
       <Route path={Paths.feedback()}
            render={()=><PageWrapper><FeedbackContainer/></PageWrapper>}/>
     <Route path={Paths.addToCollection.route}
               render={()=> <PrivateRoute
      currentProfile={currentProfile}
  
      >
            <PageWrapper><AddToCollectionContainer/>
      </PageWrapper>
            </PrivateRoute>}/>
     <Route 
            path={Paths.addStoryToCollection.route}
              render={()=><PrivateRoute 
                 currentProfile={currentProfile}
                    >
                           <PageWrapper> 
                            <AddStoryToCollectionContainer/>  </PageWrapper> 
                      </PrivateRoute>}/>
     <Route path={Paths.editCollection.route()}
      render={()=>
      <PrivateRoute 
        currentProfile={currentProfile}
      >     <PageWrapper>     <EditCollectionContainer/>  </PageWrapper> 
      </PrivateRoute>}/>
     

       <Route path={Paths.hashtag.route()}
            render={()=>
                <PageWrapper> 
            <HashtagContainer/>  </PageWrapper> 
          }/>
        <Route path={Paths.links()}
                 render={()=>  <PageWrapper> <LinksContainer/>  </PageWrapper> }
          />
      

      <Route path={Paths.workshop.reader()}
    render={()=><PrivateRoute      
     currentProfile={props.currentProfile}>  <PageWrapper> <WorkshopContainer/>  </PageWrapper> </PrivateRoute>}/>
    <Route 
    path={Paths.workshop.route()}
    render={()=><PrivateRoute
      currentProfile={props.currentProfile}
    >  <PageWrapper> <WorkshopContainer/>  </PageWrapper> </PrivateRoute>}/>
    <Route path="/profile/:id/view" render={()=>
      <PageWrapper>   <ProfileContainer/>  </PageWrapper> 
      }/>

 
    <Route path="/subscribe" 
    render={()=>  <PageWrapper> <EmailPreferences/>  </PageWrapper> }/>
    {/* <Route path="*" render={()=><NotFound/>}/> */}
    <Route  
        path={"/story/:type/edit"}
        render={()=> 
          <PrivateRoute>
              <PageWrapper> 
          <EditorContainer 
          
presentingElement={page}
            />  </PageWrapper> 
      </PrivateRoute>
        }/>

            <Route
      path={Paths.editPage.route()}
      render={()=>
        <PrivateRoute currentProfile={currentProfile} >
            <PageWrapper> 
            <EditorContainer 
              htmlContent={props.htmlContent} 
              currentProfile={currentProfile} 
              />
                </PageWrapper> 
        </PrivateRoute>
      }/>
      <Route path={Paths.page.route()} render={()=>
        <PageWrapper> 
          <PageViewContainer page={props.pageInView}/>  </PageWrapper> }
    /> 


      <Route path="/profile/edit" render={()=>
 
        <PrivateRoute  >
            <PageWrapper> 
        <SettingsContainer />
          </PageWrapper> 
        </PrivateRoute>
      }/>
       <Route path={"/terms"} render={()=>
         <PageWrapper> 
          <TermsContainer />  </PageWrapper> }
    /> 
  
   </IonRouterOutlet>
    {/* {navbarBot && showNav && (
    <IonFooter className="ion-no-border">
      <NavbarContainer currentProfile={currentProfile} />
    </IonFooter>
  )} */}

       {navbarBot&&showNav?
          <IonFooter>
   <div className="fixed w-[100vw] bottom-0 shadow-lg z-50 bg-white">
  <NavbarContainer currentProfile={currentProfile} />
</div>
</IonFooter>
     :null}   
     </div>
{/* </IonPage>  */}
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


