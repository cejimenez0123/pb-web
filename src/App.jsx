import './App.css';
import { useDispatch,connect} from "react-redux"
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {  getPublicStories } from './actions/PageActions';
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
import {  getPublicLibraries } from './actions/LibraryActions';
import PrivacyNoticeContrainer from './container/PrivacyNoticeContainer.jsx';
import checkResult from './core/checkResult';
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
import {Helmet} from "react-helmet";
import  Context from "./context"
import AddStoryToCollectionContainer from './container/collection/AddStoryToCollection';
import CollectionContainer from './container/collection/CollectionContainer';
import AddToCollectionContainer from './container/collection/AddToCollection';
import EditCollectionContainer from './container/collection/EditCollectionContainer.jsx';
import SignUpContainer from './container/auth/SignUpContainer.jsx';
import { getHashtags, getProfileHashtagCommentUse } from './actions/HashtagActions.js';
import WorkshopContainer from './container/collection/WorkshopContainer.jsx';
import ResetPasswordContainer from './container/auth/ResetPassword.jsx';
import Alert from './components/Alert.jsx';
import NotificationContainer from './container/profile/NotificationContainer.jsx';
import HashtagContainer from './container/hashtag/HashtagContainer.jsx';
function App(props) {

  const dispatch = useDispatch()
  const [formerPage, setFormerPage] = useState(null);
  const [isSaved,setIsSaved]=useState(true)
  const [success,setSuccess]=useState(null)
  const [error,setError]=useState(null)
  useEffect(()=>{
  if(localStorage.getItem("token")){
    props.getCurrentProfile()
  }

  },[localStorage.getItem("token")])
  useEffect(()=>{
    fetchData()
  },[props.currentProfile])
  const fetchData = ()=>{
    const {currentProfile}=props
    if(currentProfile){
      // dispatch(getHashtags())
      // dispatch(getProfileHashtagCommentUse({profileId:currentProfile.id}))
    }
 
  }

  return (
      <Context.Provider value={{formerPage,setFormerPage,isSaved,setIsSaved,error,setError,setSuccess,success}}>
                <Router>
      
      <div  className='App background-blur bg-gradient-to-br from-slate-100 to-emerald-100'>
      <div/>
      <div style={{position:"relative"}} >
       <Helmet>
                <meta charSet="utf-8" />
                <title>Plumbum</title>
                <meta name="description" content="The place for writers to connect" />
        </Helmet>
    

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
<script type="text/babel" src="/my-scripts.js"></script>
      {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous"/> */}
        <script src="https://kit.fontawesome.com/08dbe310f1.js" crossorigin="anonymous"></script>
        {/* <script type="text/javascript" src="Scripts/bootstrap.min.js"></script> */}
        <script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>  
        {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossOrigin="anonymous"/> */}
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
                            getPublicStories={props.getPublicStories} 
                            pagesInView={props.pagesInView}
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
     <Route path={'/reset-password' }
     element={<ResetPasswordContainer/>}/>
     <Route path={Paths.collection.route()}
     element={<CollectionContainer/>}/>
     <Route path={'/signup'}
     element={<LoggedRoute><SignUpContainer/></LoggedRoute>}/>
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
     
       <Route exact path={"/about"} element={
   <AboutContainer/>
      }/>
 
        <Route path={Paths.apply()}
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
      <ProfileContainer profile={props.profileInView}/>
      }/>
  
    

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
      <Route path="/page/:id" element={
          <PageViewContainer page={props.pageInView}/>}
    /> 
       <Route
      path="/page/:id/edit"
      element={
        <PrivateRoute loading={props.userLoading} loggedIn={!!props.currentProfile}>
            <EditorContainer 
              htmlContent={props.htmlContent} 
              currentProfile={props.currentProfile} 
              />
        </PrivateRoute>
      }/>

      <Route path="/profile/edit" element={
        
        <PrivateRoute loading={props.userLoading} loggedIn={props.currentProfile}>
        <SettingsContainer />
        </PrivateRoute>
      }/>
      
    </Routes>

    </div>
    </div>
    </div>
    </Router>
    </Context.Provider>
  );
}

function mapDispatchToProps(dispatch){
  return{ 
    getCurrentProfile:(params)=>dispatch(getCurrentProfile(params)),
    
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


