import './App.css';
import { useDispatch,connect} from "react-redux"
import { useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          fetchHomeCollection,
          setSignedInTrue,
          setSignedInFalse,
      } from './actions/UserActions'
import PrivateRoute from './PrivateRoute';
import { useEffect} from 'react';
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
import usePersistentCurrentProfile from './domain/usecases/useCurrentProfileCache.jsx';
import { useSelector } from 'react-redux';
import NotFound from './container/NotFound.jsx';
import EmailPreferences from './container/EmailPreferences.jsx';
import FeedbackContainer from './container/FeedbackContainer.jsx';
import NewsletterContainer from './container/auth/NewsletterContainer.jsx';
import UserReferralContainer from './container/auth/UseReferralContainer.jsx';
import LinksContainer from './container/LinksContainer.jsx';
import CalendarContainer from './container/CalendarContainer.jsx';
import Enviroment from './core/Enviroment.js';




function App(props) {



  const dispatch = useDispatch()
  const [formerPage, setFormerPage] = useState(null);
  const [isSaved,setIsSaved]=useState(true)
  const profile = useSelector(state=>state.users.profileInView)
  const [seo,setSeo]=useState({title:"Plumbum",image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website"})
  let prof = usePersistentCurrentProfile(()=>dispatch(getCurrentProfile()))

  const currentProfile= useSelector(state=>state.users.currentProfile??prof)
  const [success,setSuccess]=useState(null)
  const [error,setError]=useState(null)

  useEffect(()=>{
    if(currentProfile){
    dispatch(getRecommendedCollectionsProfile())
  }
  },[])

  return (

      <Context.Provider value={{seo,setSeo,currentProfile,formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>

      <div  className='App background-blur bg-gradient-to-br from-slate-100 to-emerald-100'>
      <div/>
      <div style={{position:"relative"}} >
  
    

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
       <NavbarContainer 
        loggedIn={props.currentProfile}
        profile={props.currentProfile}/>
        
        <SearchDialog  />
        <div className='screen'>
<Alert />
      <Routes >
          <Route path={Paths.home()} 
                        element={
                          <PrivateRoute>
                          <DashboardContainer 
                          /></PrivateRoute>
                        }
            />
            <Route path={Paths.notifications()}
            element={<PrivateRoute><NotificationContainer/></PrivateRoute>}/>
    
          <Route  path="/discovery" 
                  element={
                    <DiscoveryContainer 
                      getPublicLibraries={props.getPublicLibraries}
                      getPublicStories={props.getPublicStories} 
                      
                      pagesInView={props.pagesInView}
                      // fetchAllProfiles={props.fetchAllProfiles}
                    />
                  }
            />
          <Route path={"/privacy"}
                  element={<PrivacyNoticeContrainer/>}
                  />
          <Route  path="/login"  
                  element={ 
        <LoggedRoute>
            <LogInContainer logIn={props.logIn}/>
            </LoggedRoute>
          
       }
     />
      <Route path={Paths.calendar()}
     element={<CalendarContainer/>}/>
          <Route path={Paths.newsletter() }
     element={<LoggedRoute><NewsletterContainer/></LoggedRoute>}/>
     <Route path={'/reset-password' }
     element={<ResetPasswordContainer/>}/>
     <Route path={Paths.collection.route()}
     element={<CollectionContainer/>}/>
     <Route path={'/signup'}
     element={<LoggedRoute><SignUpContainer/></LoggedRoute>}/>
       <Route path={'/register'}
     element={<LoggedRoute><UserReferralContainer/></LoggedRoute>}/>
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
     
      <Route exact path={Paths.about()} element={
   <AboutContainer/>
      }/>
       <Route path={Paths.hashtag.route()}
      element={<HashtagContainer/>}/>
     <Route path={Paths.links()}
     element={<LinksContainer/>}/>
       <Route exact path={"/about"} element={
   <AboutContainer/>
      }/>
 
        <Route path={Paths.apply()}
        element={<LoggedRoute><ApplyContainer/></LoggedRoute>}/>
         <Route path={Paths.apply()+"/newsletter"}
        element={<LoggedRoute><ApplyContainer/></LoggedRoute>}/>
      <Route
      path={Paths.myProfile()}
      element={
        <PrivateRoute >
          <MyProfileContainer currentProfile={props.currentProfile} 
                              pagesInView={props.pagesInView} 
                              booksInView={props.booksInView}
                          
                              />
       </PrivateRoute>
      }
    />
      <Route path={Paths.workshop.reader()}
    element={<WorkshopContainer/>}/>
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
    </div>
    </div>

    </Context.Provider>

  );
}

function mapDispatchToProps(dispatch){
  return{ 

    getPublicLibraries:()=>dispatch(getPublicLibraries()),
    getPublicStories:()=>dispatch(getPublicStories()),
    fetchHomeCollection:(params)=>dispatch(fetchHomeCollection(params)),
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


