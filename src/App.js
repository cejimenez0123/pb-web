import logo from './logo.svg';
import './App.css';
import { connect} from "react-redux"
import { BrowserRouter,HashRouter, Route, Routes, Redirect,withRouter} from 'react-router-dom';
import { getPublicPages } from './actions/PageActions';
import PageReducer from './reducers/PageReducer';
import DashboardContainer from './container/DashboardContainer';
import LogInContainer from './container/LogInContainer';
import NavbarContainer from './container/NavbarContainer';
import DiscoveryContainer from './container/DiscoveryContainer';
import EditorContainer from './container/EditorContainer'
import { logIn } from './actions/UserActions';
function App(props) {
  return (
    <div className="App">
      <header>
    
       </header>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous"/>
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"/>
       <NavbarContainer/>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Routes>
      <Route path="/page/new" element={<EditorContainer/>}/>
      <Route path="/discovery" element={<DiscoveryContainer getPublicPages={props.getPublicPages} pagesInView={props.pagesInView}/>}/>
      <Route path="/login" element={<LogInContainer logIn={props.logIn}/>}/>

      <Route exact path="/" element={
      <DashboardContainer getPublicPages={props.getPublicPages} pagesInView={props.pagesInView}/>
      } />
        
     </Routes>
    </div>
  );
}

  // 
function mapDispatchToProps(dispatch){
  return{ 
    // signUp:(user)=>dispatch(signUp(user)),
    logIn:(email,password)=>dispatch(logIn(email,password)),
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
console.log(`mapStateToProps${typeof state.pages.pagesInView}`)
  return{
    // users: state.users.users,
    // loggedIn: state.users.loggedIn,
    // currentUser: state.users.currentUser,
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
    // librariesInView: state.libraries.librariesInView,
    // libraryFollowers: state.libraries.libraryFollowers,
    // followedBooks: state.books.followedBooksOfUser,
    // followedLibraries: state.libraries.followedLibraries
    
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)

