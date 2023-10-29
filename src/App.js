import './App.css';
import { connect,useDispatch} from "react-redux"
import {Route, Routes} from 'react-router-dom';
import { getPublicPages } from './actions/PageActions';
import DashboardContainer from './container/DashboardContainer';
import LogInContainer from './container/LogInContainer';
import NavbarContainer from './container/NavbarContainer';
import DiscoveryContainer from './container/DiscoveryContainer';
import EditorContainer from './container/EditorContainer'
import PageViewContainer from './container/PageViewContainer'
import BookViewContainer from './container/BookViewContainer'
import MyProfileContainer from './container/MyProfileContainer';
import CreateBookContainer from './container/CreateBookContainer';
import CreateLibraryContainer from './container/CreateLibraryContainer';
import SettingsContainer from './container/SettingsContainer';
import ProfileContainer from './container/ProfileContainer';
import PicturePageContainer from './container/PicturePageContainer';
import UpdateLibraryContainer from './container/UpdateLibraryContainer';
import AddPageToBookContainer from './container/AddPageToBookContainer';
import { getCurrentProfile } from './actions/UserActions';
import { fetchBookmarkLibrary } from './actions/LibraryActions';
import { getPublicBooks } from './actions/BookActions';
import { getPublicLibraries } from './actions/LibraryActions';
import {  fetchAllProfiles,
          fetchFollowBooksForProfile,
          fetchFollowLibraryForProfile,
          fetchFollowProfilesForProfile} from './actions/UserActions'
import history from './history';
import PrivateRoute from './PrivateRoute';
import { useEffect} from 'react';
import LoggedRoute from './LoggedRoute';
import EditBookContainer from './container/EditBookContainer';
import LibraryViewContainer from './container/LibraryViewContainer';
import {auth} from "./core/di"

function App(props) {
    useEffect(()=>{
      fetchCurrentProfile()
  
    },[auth.currentUser])
  
  const fetchCurrentProfile = ()=>{
    if(auth.currentUser != null && !auth.currentUser.isAnonymous){
      const params = {
        userId: auth.currentUser.uid
      }
      const subscriber = props.getCurrentProfile(params)
  }
  }
 
  useEffect(()=>{
    if(props.currentProfile!=null){
      const params = {
        id: props.currentProfile.bookmarkLibraryId
      }
      const profileParams = {
        profile: props.currentProfile
      }
      props.fetchBookmarkLibrary(params)
      props.fetchFollowBooksForProfile(profileParams)
      props.fetchFollowLibraryForProfile(profileParams)
      props.fetchFollowProfilesForProfile(profileParams)
    }
  
  },[props.currentProfile])

   
  return (
    <div className="App">
       
      <header>
    
      </header>
  
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous"/>
        <script src="https://kit.fontawesome.com/08dbe310f1.js" crossorigin="anonymous"></script>
        <script type="text/javascript" src="Scripts/bootstrap.min.js"></script>
        <script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>  
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossOrigin="anonymous"/>
      <NavbarContainer loggedIn={props.currentProfile} profile={props.currentProfile}/>

        <Routes history={history} >
      <Route exact path="/" element={
      <DashboardContainer auth={auth} getPublicPages={props.getPublicPages} pagesInView={props.pagesInView}/>
      } />
      
      <Route path="/discovery" element={
        <DiscoveryContainer 
          getPublicLibraries={props.getPublicLibraries}
          getPublicPages={props.getPublicPages} 
          getPublicBooks={props.getPublicBooks} 
          pagesInView={props.pagesInView}
          fetchAllProfiles={props.fetchAllProfiles}/>}
      />
      <Route path="/login"  
        element={ 
          <LoggedRoute 
            profile={!props.currentProfile}
          >
            <LogInContainer logIn={props.logIn}
                            loggedIn={auth.isSignedIn}
            />
          </LoggedRoute>}
     />

        
      <Route
      path="/profile/home"
      element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
          <MyProfileContainer currentProfile={props.currentProfile} 
                              pagesInView={props.pagesInView} 
                    
                              booksInView={props.booksInView}
                              librariesInView={props.librariesInView}/>
       </PrivateRoute>
      }
    />
    <Route path="/profile/:id" element={
    <ProfileContainer profile={props.profileInView}/>}/>
    
    <Route path="/book/:id" element={
      <BookViewContainer 
        book={props.bookInView} 
        pages={props.pagesInView}/>
    }/>
    <Route  path="/page/image"  
        element={ 
          <PrivateRoute loggedIn={props.currentProfile}>
            <PicturePageContainer />

         </PrivateRoute>
        }/>
    <Route
      exact path="/page/new"
      element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
            <EditorContainer 
              htmlContent={props.htmlContent}
              currentProfile={props.currentProfile} 
              />
        </PrivateRoute>
      }/>
      <Route path="/page/:id" element={
          <PageViewContainer page={props.pageInView}/>}
    /> 
       <Route
      path="/page/:id/edit"
      element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
            <EditorContainer 
              htmlContent={props.htmlContent} 
              currentProfile={props.currentProfile} 
              />
        </PrivateRoute>
      }/>
      <Route path="/book/new" element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
          <CreateBookContainer pagesInView={props.pagesInView} booksInView={props.booksInView}/>
        </PrivateRoute>
      }/>
      <Route path="/book/:id/edit" element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
        <EditBookContainer book={props.bookInView} pages={props.pagesInView}/>
        </PrivateRoute>
      }/>
      <Route path="/library/new" element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
        <CreateLibraryContainer/>
        </PrivateRoute>
      }/>
      <Route path="/library/:id" element={
        <LibraryViewContainer
        />
      }/>
      <Route path="/profile/edit" element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
        <SettingsContainer />
        </PrivateRoute>
      }/>
      <Route path="/library/:id/edit" element={
         <PrivateRoute loggedIn={!!props.currentProfile}>
        <UpdateLibraryContainer/>
        </PrivateRoute>}/>
      <Route path="/book/:id/add" element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
          <AddPageToBookContainer/>
        </PrivateRoute>
      }/>
      
    </Routes>

    
    </div>
  );
}

  // 
function mapDispatchToProps(dispatch){
  return{ 
    getCurrentProfile:(params)=>dispatch(getCurrentProfile(params)),
    getPublicBooks:()=>dispatch(getPublicBooks()),
    fetchBookmarkLibrary:(params)=>dispatch(fetchBookmarkLibrary(params)),
    getPublicLibraries:()=>dispatch(getPublicLibraries()),
    getPublicPages:()=>dispatch(getPublicPages()),
    fetchAllProfiles:()=>dispatch(fetchAllProfiles()), 
    fetchFollowBooksForProfile:(params)=>dispatch(fetchFollowBooksForProfile(params)) ,
    fetchFollowLibraryForProfile:(params)=>dispatch(fetchFollowLibraryForProfile(params)),
    fetchFollowProfilesForProfile:(params)=>dispatch(fetchFollowProfilesForProfile(params))
  }
}
function mapStateToProps(state){

  return{
    profile: state.users.profileInView,
    loggedIn: state.users.loggedIn,
    bookInView: state.books.bookInView,
    booksInView: state.books.booksInView,
    currentProfile: state.users.currentProfile,
    // currentUser: state.users.currentUser,
    currentProfile: state.users.currentProfile,
    pageInView: state.pages.pageInView,
    pagesInView: state.pages.pagesInView,
    // libraryInView: state.libraries.libraryInView,
    librariesInView: state.libraries.librariesInView,
    
    // libraryFollowers: state.libraries.libraryFollowers,
    // followedBooks: state.books.followedBooksOfUser,
    // followedLibraries: state.libraries.followedLibraries
    
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)

