import logo from './logo.svg';
import './App.css';

import { connect,useSelector,useDispatch} from "react-redux"
import { BrowserRouter,HashRouter, Route, Routes, Redirect,withRouter,Navigate} from 'react-router-dom';
import { getPublicPages } from './actions/PageActions';
import PageReducer from './reducers/PageReducer';
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
import UpdateLibraryContainer from './container/UpdateLibraryContainer';
import { logIn,getCurrentProfile } from './actions/UserActions';
import { fetchBookmarkLibrary } from './actions/LibraryActions';
import { getPublicBooks } from './actions/BookActions';
import history from './history';
import PrivateRoute from './PrivateRoute';

import { useEffect,useState} from 'react';
import useAuth from './core/useAuth';
import LoggedRoute from './LoggedRoute';
import EditBookContainer from './container/EditBookContainer';
import LibraryViewContainer from './container/LibraryViewContainer';

// class CONTAINERS{
//     static EDITOR_CONTAINER = "editor-container"
// }

function App(props) {
  const dispatch = useDispatch()
    const [signedIn,setSignedIn] = useState(false)
    const [user,setUser]= useState(null)

    
    let auth = useAuth()
    const [authState,setAuthState]=useState(auth)
  useEffect(()=>{
    setAuthState(auth)
    if(!!authState.user && !props.currentProfile){
      const params = {
       userId: authState.user.uid
      }
      const subscriber = props.getCurrentProfile(params)

      return ()=> subscriber
    }
  
  },[])
  useEffect(()=>{
    if(props.currentProfile!=null){
      const params = {
        id: props.currentProfile.bookmarkLibraryId
      }
      props.fetchBookmarkLibrary(params)
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
      <NavbarContainer loggedIn={!!authState.users} authState={authState} profile={props.currentProfile}/>
 
        <Routes history={history} >
      <Route exact path="/" element={
      <DashboardContainer auth={auth} getPublicPages={props.getPublicPages} pagesInView={props.pagesInView}/>
      } />
      
      <Route path="/discovery" element={
      <DiscoveryContainer getPublicPages={props.getPublicPages} getPublicBooks={props.getPublicBooks} pagesInView={props.pagesInView}/>}/>
      <Route path="/login" 
      // element={
        
      element={ <LoggedRoute profile={!props.currentProfile}><LogInContainer logIn={props.logIn} loggedIn={auth.isSignedIn}/></LoggedRoute>}
     />

        
      <Route
      path="/profile/home"
      element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
          <MyProfileContainer currentProfile={props.currentProfile} 
                              pagesInView={props.pagesInView} 
                              authState={authState}
                              booksInView={props.booksInView}
                              librariesInView={props.librariesInView}/>
       </PrivateRoute>
      }
    />
    <Route path="/page/:id" element={
          <PageViewContainer page={props.pageInView}/>}
    /> 
    <Route path="/book/:id" element={
      <BookViewContainer book={props.bookInView} pages={props.pagesInView}/>
    }/>
    <Route
      path="/page/new"
      element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
            <EditorContainer htmlContent={props.htmlContent} currentProfile={props.currentProfile} auth={authState}/>
        </PrivateRoute>
      }/>
      <Route path="/book/new" element={
        <PrivateRoute loggedIn={!!props.currentProfile}>
          <CreateBookContainer pagesInView={props.pagesInView}/>
        </PrivateRoute>
      }/>
      <Route path="/book/:id/edit" element={
        <EditBookContainer book={props.bookInView} pages={props.pagesInView}/>
      }/>
      <Route path="/library/new" element={

        <CreateLibraryContainer/>
      }/>
      <Route path="/library/:id" element={
        <LibraryViewContainer
        />
      }/>
      <Route path="/profile/edit" element={
        <SettingsContainer />
      }/>
      <Route path="/library/:id/edit" element={
        <UpdateLibraryContainer/>}/>
      
    </Routes>

    
    </div>
  );
}

  // 
function mapDispatchToProps(dispatch){
  return{ 
    // signUp:(user)=>dispatch(signUp(user)),
    // logIn:(email,password)=>dispatch(logIn(email,password)),
    getCurrentProfile:(params)=>dispatch(getCurrentProfile(params)),
    getPublicBooks:()=>dispatch(getPublicBooks()),
    fetchBookmarkLibrary:(params)=>dispatch(fetchBookmarkLibrary(params)),
    // getUsers: ()=>dispatch(getUsers()),
    // savePage: (data)=>dispatch(savePage(data)),
    // getAllPages: ()=>dispatch(getAllPages()),
    // getInbox: ()=>dispatch(getInbox()),
    // setCurrentUser:()=>dispatch(SET_CURRENT_USER()),
    // getAllBooks:()=>dispatch(getAllBooks()),
    // getBook:(id)=>dispatch(getBook(id)),
    // getUser:(id)=>dispatch(getUser(id)),
    // getBooksOfUser:(id)=>dispatch(getBooksOfUser(id)),
    // getLibrary:(id)=>dispatch(getLibrary(id)),
    // endSession: ()=>dispatch(END_CURRENT_USER()),
    // getBooksOfLib:(id)=>dispatch(getBooksOfLibrary(id)),
    // getDrafts:(id)=>dispatch(getDraftsOfBook(id)),
    // updateUser: (user)=>dispatch(updateUser(user)),
    // getBookLibraries:()=>dispatch(getBookLibraries()),
    // getFollowersOfLibrary: (id)=>dispatch(getFollowersOfLibrary(id)),
    // followLibrary: (id)=>dispatch(followLibrary(id)),
    // deleteFollowLibrary: (id)=> dispatch(deleteFollowLibrary(id)),
    // updateLibrary: (hash)=>dispatch(updateLibrary(hash)),
    // deleteBookLibrary:(hash)=>dispatch(deleteBookLibrary(hash)),
    // getFollowedBooksOfUser: (id)=>dispatch(getFollowedBooksOfUser(id)),
    // getUserBookAccess: ()=>dispatch(getUserBookAccess()),
    // getLibraryPages:(id)=>dispatch(getLibraryPages(id)),
    getPublicPages:()=>dispatch(getPublicPages()),
    // getAllLibraries:()=>dispatch(getAllLibraries()),
    // recommendPages:(id,page_num)=>dispatch(recommendPages(id,page_num)),
    // getFollowedLibrariesOfUser:(id)=>dispatch(getFollowedLibrariesOfUser(id))
  }
}
function mapStateToProps(state){

  return{
    // users: state.users.users,
    loggedIn: state.users.loggedIn,
    bookInView: state.books.bookInView,
    booksInView: state.books.booksInView,
    // currentUser: state.users.currentUser,
    currentProfile: state.users.currentProfile,
    pageInView: state.pages.pageInView,
    // currentPage: state.pages.currentPage,
    // bookInView: state.books.bookInView,
    // booksOfUserr: state.books.booksOfUser,
    // pages: state.pages.pages,
    // inbox: state.pages.inbox,
    // books: state.books.books,
    // userInView: state.users.userInView,
    // booksInView: state.books.booksInView,
    pagesInView: state.pages.pagesInView,
    // libraryInView: state.libraries.libraryInView,
    librariesInView: state.libraries.librariesInView,
    // libraryFollowers: state.libraries.libraryFollowers,
    // followedBooks: state.books.followedBooksOfUser,
    // followedLibraries: state.libraries.followedLibraries
    
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)

