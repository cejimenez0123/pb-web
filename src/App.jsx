import './App.css';
import { useDispatch,connect,useSelector} from "react-redux"
import { useEffect, useState ,useRef, useLayoutEffect, useContext} from 'react';
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
import {  getCurrentProfile,
          setSignedInTrue,
          setSignedInFalse,
          setUserLoading,
      } from './actions/UserActions'
      import { IonApp, setupIonicReact, IonRouterOutlet,  useIonRouter, IonFooter, useIonViewWillEnter} from '@ionic/react';
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
import DashboardContainer from './container/DashboardContainer.jsx';
import { LoadScript } from '@react-google-maps/api';
import ContentHubContainer from './container/ContentHubContainer.jsx';
import DiscoveryContainer from './container/DiscoveryContainer.jsx';
import { SplashScreen } from '@capacitor/splash-screen';

setupIonicReact()

const libraries = ["places"];
function App(props) {
  const {currentProfile} =props
const isHorizPhone = useMediaQuery({ query: '(min-width: 800px)' });


  const isNative = Capacitor.isNativePlatform()

  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const dispatch = useDispatch()
  const [formerPage, setFormerPage] = useState(null);
  const [isSaved,setIsSaved]=useState(true)



const ionRouter = useIonRouter();
const location = ionRouter.routeInfo?.pathname??window.location

  const [seo,setSeo]=useState({title:"Plumbum",heading:"Plumbum" ,image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website",url:"https://plumbum.app"})

const [presentingEl, setPresentingEl] = useState(null);
  const [success,setSuccess]=useState(null)
  const [error,setError]=useState(null)
const [token,setToken]=useState(null)
const [chuecking,setChecking]=useState(null)
  const {dialog,loading:userLoading} = useSelector(state=>state.users)

const [firstLaunchChecked, setFirstLaunchChecked] = useState(false);


useIonViewWillEnter(() => {
  const checkFirstLaunch = async () => {
    await SplashScreen.show({
      showDuration: 3000,
      autoHide: true,
  })
    if (isNative) {
      const { value } = await Preferences.get({ key: 'hasSeenOnboarding' });
      if (value === null) {
        await Preferences.set({ key: "hasSeenOnboarding", value: 'true' });
        setIsFirstLaunch(true);
      }else if(currentProfile){
        


        // await SplashScreen.hide()
        return
      }
    }
    setFirstLaunchChecked(true);
  };
 checkFirstLaunch();
}, [isNative]);
 

const isDesktop = useMediaQuery({ query: '(min-width: 60.1em)' }) // 768px
const isMobileOrTablet = useMediaQuery({ query: '(max-width: 60em)' })

const showTopNavbar = isDesktop && !isNative
const showBottomNavbar = (isMobileOrTablet || isNative)  && import.meta.env.VITE_NODE_ENV=="prod"

 return (

    <ErrorBoundary>
        <Context.Provider value={{setPresentingEl,isDesktop,isTablet:isMobileOrTablet,isPhone:isMobileOrTablet,isNotPhone:!isMobileOrTablet,isHorizPhone,seo,setSeo,formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>

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
       <Route exact path={Paths.login()}
                  render={()=> 
      
        <PageWrapper presenHeader={false}>
      <PrivateRoute>
            <LogInContainer  currentProfile={currentProfile} logIn={props.logIn}/>
             </PrivateRoute>
                      </PageWrapper>
         

       }
     />
 
     <Route exact path="/" render={() => 
         <PageWrapper>{
  currentProfile? 
  <Redirect to={Paths.home} />:  
  isFirstLaunch && isNative?<Redirect to={Paths.onboard}/>:<Redirect to={Paths.about()}/>   }
     </PageWrapper>}
/>
<Route exact path="/about" render={() => 
    <PageWrapper presenHeader={false}>
     <AboutContainer/></PageWrapper>}
/>
<Route exact path="/search" render={() => 
<PageWrapper showSearchButton={false}>
     <SearchDialog /></PageWrapper>}
/>


   
      <Route path={Paths.onboard} render={()=><PageWrapper presenHeader={false}><OnboardingContainer/></PageWrapper>}/>


            <Route exact path={Paths.notifications()}
            render={()=><PageWrapper><PrivateRoute >
              <NotificationContainer currentProfile={currentProfile}/></PrivateRoute></PageWrapper>}/>
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
     render={()=><PageWrapper showBackbutton={false}  presenHeader={false}><CalendarContainer/></PageWrapper>}/>
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


      <Route path="/profile/edit" render={()=>
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
  
   </IonRouterOutlet>
</div>

       {showBottomNavbar&&
          <IonFooter>
   <div className=" bg-white">
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




