import './App.css';
import { connect} from "react-redux"
import {Route, Routes} from 'react-router-dom';
import {  getPublicStories } from './actions/PageActions';
import DashboardContainer from './container/DashboardContainer';
import LogInContainer from './container/auth/LogInContainer';
import NavbarContainer from './container/NavbarContainer';
import DiscoveryContainer from './container/DiscoveryContainer';
import EditorContainer from './container/page/EditorContainer'
import PageViewContainer from './container/page/PageViewContainer'
import BookViewContainer from './container/book/BookViewContainer'
import MyProfileContainer from './container/MyProfileContainer';
import CreateBookContainer from './container/book/CreateBookContainer';
import CreateLibraryContainer from './container/library/CreateLibraryContainer';
import SettingsContainer from './container/SettingsContainer';
import ProfileContainer from './container/ProfileContainer';
import UpdateLibraryContainer from './container/library/UpdateLibraryContainer';
import AddPageToBookContainer from './container/book/AddPageToBookContainer';
import ApplyContainer from './container/auth/ApplyContainer';
import AddItemsToLibraryContainer from './container/library/AddItemsToLibraryContainer';
import SearchDialog from './components/SearchDialog';
import {  fetchBookmarkLibrary,
          getPublicLibraries } from './actions/LibraryActions';
import checkResult from './core/checkResult';
import {  getPublicBooks } from './actions/BookActions';
import {  getCurrentProfile,
          fetchAllProfiles,
          fetchFollowBooksForProfile,
          fetchFollowLibraryForProfile,
          fetchFollowProfilesForProfile,
          fetchHomeCollection,
          setSignedInTrue,
          setSignedInFalse,
          getPageApprovals} from './actions/UserActions'
import history from './history';
import PrivateRoute from './PrivateRoute';
import { useEffect} from 'react';
import LoggedRoute from './LoggedRoute';
import EditBookContainer from './container/book/EditBookContainer';
import LibraryViewContainer from './container/library/LibraryViewContainer';
import useAuth from './core/useAuth';
import Paths from './core/paths';
import AboutContainer from './container/AboutContainer';
import {Helmet} from "react-helmet";
import useScrollTracking from './core/useScrollTracking';

function App(props) {
  const authState = useAuth()
  

  useEffect(()=>{
    props.fetchAllProfiles()
  },[]
  )
  useEffect(()=>{
    if(authState.user !== null && !authState.user.isAnonymous)  
      props.getCurrentProfile().then(result=>{
        checkResult(result,payload=>{
          fetchData()
  
      },err=>{
        
      })
  })},[])

  const fetchData = ()=>{
    if(props.currentProfile!=null){
      const params = {
        id: props.currentProfile.bookmarkLibraryId
      }
      const profileParams = {
        profile: props.currentProfile
      }
      
      props.fetchHomeCollection(profileParams)
      props.fetchBookmarkLibrary(params)
      props.getPageApprovals(profileParams)
      props.fetchFollowBooksForProfile(profileParams)
      props.fetchFollowLibraryForProfile(profileParams)
      props.fetchFollowProfilesForProfile(profileParams)
    }
 
  }
   
  return (
    <div >
      <div className='background-blur'>
      <div/>
      <div className='App'>
       <Helmet>
                <meta charSet="utf-8" />
                <title>Plumbum</title>
                <meta name="description" content="The place for writers to connect" />
        </Helmet>
    

  <link
  rel="stylesheet"
  href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
/>
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
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous"/>
        <script src="https://kit.fontawesome.com/08dbe310f1.js" crossorigin="anonymous"></script>
        <script type="text/javascript" src="Scripts/bootstrap.min.js"></script>
        <script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>  
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossOrigin="anonymous"/>
      <NavbarContainer 
        loggedIn={props.currentProfile}
        profile={props.currentProfile}/>
        <SearchDialog  />
        <div className='screen'>
        <Routes history={history} >
          <Route exact  path={Paths.home()} 
                        element={
                          <DashboardContainer 
                            getPublicStories={props.getPublicStories} 
                            pagesInView={props.pagesInView}
                          />
                        }
            />
          <Route  path="/discovery" 
                  element={
                    <DiscoveryContainer 
                      getPublicLibraries={props.getPublicLibraries}
                      getPublicStories={props.getPublicStories} 
                      getPublicBooks={props.getPublicBooks} 
                      pagesInView={props.pagesInView}
                      fetchAllProfiles={props.fetchAllProfiles}
                    />
                  }
            />
          <Route  path="/login"  
                  element={ 
          <LoggedRoute 
        
            loggedOut={!props.currentProfile}
          >
            <LogInContainer logIn={props.logIn}
            />
          </LoggedRoute>}
     />
      <Route path={Paths.about()} element={
   <AboutContainer/>
      }/>
 
        <Route path={Paths.apply()}
        element={<ApplyContainer/>}/>
      <Route
      path={Paths.myProfile()}
      element={
        <PrivateRoute >
          <MyProfileContainer currentProfile={props.currentProfile} 
                              pagesInView={props.pagesInView} 
                              booksInView={props.booksInView}
                              librariesInView={props.librariesInView}/>
       </PrivateRoute>
      }
    />
    <Route path="/profile/:id" element={
      <ProfileContainer profile={props.profileInView}/>
      }/>
    
    <Route  path="/book/:id" 
            element={
              <BookViewContainer 
        book={props.bookInView} 
        pages={props.pagesInView}/>
    }/>
    <Route  
        path="/page/image"  
        element={ 
          <PrivateRoute loggedIn={!!props.currentProfile}>
          <EditorContainer 
            htmlContent={props.htmlContent}
            currentProfile={props.currentProfile} 
            />
      </PrivateRoute>
        }/>
    <Route
      exact path="/page/text"
      element={
        <PrivateRoute  loading={props.userLoading} loggedIn={!!props.currentProfile}>
            <EditorContainer 
              htmlContent={props.htmlContent}
              currentProfile={props.currentProfile} 
              />
        </PrivateRoute>
      }/>
       <Route
      exact path="/page/link"
      element={
        <PrivateRoute loading={props.userLoading} loggedIn={!!props.currentProfile}>
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
        <PrivateRoute loading={props.userLoading} loggedIn={!!props.currentProfile}>
            <EditorContainer 
              htmlContent={props.htmlContent} 
              currentProfile={props.currentProfile} 
              />
        </PrivateRoute>
      }/>
      <Route path="/book/new" element={
        <PrivateRoute  loading={props.userLoading} loggedIn={!!props.currentProfile}>
          <CreateBookContainer pagesInView={props.pagesInView} booksInView={props.booksInView}/>
        </PrivateRoute>
      }/>
      <Route path="/book/:id/edit" element={
        <PrivateRoute loading={props.userLoading} loggedIn={!!props.currentProfile}>
        <EditBookContainer book={props.bookInView} pages={props.pagesInView}/>
        </PrivateRoute>
      }/>
      <Route path="/library/new" element={
        <PrivateRoute loading={props.userLoading} loggedIn={!!props.currentProfile}>
        <CreateLibraryContainer/>
        </PrivateRoute>
      }/>
      <Route path="/library/:id" element={
        <LibraryViewContainer
        />
      }/>
      <Route path="/profile/edit" element={
        
        <PrivateRoute loggedIn={props.currentProfile}>
        <SettingsContainer />
        </PrivateRoute>
      }/>
      <Route path="/library/:id/edit" element={
         <PrivateRoute loading={props.userLoading} loggedIn={!!props.currentProfile}>
        <UpdateLibraryContainer/>
        </PrivateRoute>}/>
      <Route path="/book/:id/add" element={
        <PrivateRoute loading={props.userLoading} loggedIn={!!props.currentProfile}>
          <AddPageToBookContainer/>
        </PrivateRoute>
      }/>
      <Route path="/library/:id/add" element={
        <PrivateRoute loading={props.userLoading} loggedIn={!!props.currentProfile}>
          <AddItemsToLibraryContainer/>
        </PrivateRoute>
      }/>
      
    </Routes>
    </div>
    </div>
    </div>
    </div>
  );
}

function mapDispatchToProps(dispatch){
  return{ 
    getCurrentProfile:(params)=>dispatch(getCurrentProfile(params)),
    getPublicBooks:()=>dispatch(getPublicBooks()),
    fetchBookmarkLibrary:(params)=>dispatch(fetchBookmarkLibrary(params)),
    getPublicLibraries:()=>dispatch(getPublicLibraries()),
    getPublicStories:()=>dispatch(getPublicStories()),
    fetchAllProfiles:()=>dispatch(fetchAllProfiles()), 
    fetchFollowBooksForProfile:(params)=>dispatch(fetchFollowBooksForProfile(params)) ,
    fetchFollowLibraryForProfile:(params)=>dispatch(fetchFollowLibraryForProfile(params)),
    fetchFollowProfilesForProfile:(params)=>dispatch(fetchFollowProfilesForProfile(params)),
    fetchHomeCollection:(params)=>dispatch(fetchHomeCollection(params)),
    setSignedInTrue:()=>dispatch(setSignedInTrue()),
    setSignedInFalse:()=>dispatch(setSignedInFalse()),
    getPageApprovals:(params)=>dispatch(getPageApprovals(params)),
  }
}
function mapStateToProps(state){
  return{
    profile: state.users.profileInView,
    signedIn: state.users.signedIn,
    bookInView: state.books.bookInView,
    booksInView: state.books.booksInView,
    currentProfile: state.users.currentProfile,
    pageInView: state.pages.pageInView,
    pagesInView: state.pages.pagesInView,
    librariesInView: state.libraries.librariesInView,
    bookLoading: state.books.loading,
    userLoading: state.users.loading
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)


