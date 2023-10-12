import React ,{useEffect, useState } from 'react'
import {connect, useSelector,useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import useAuth from '../core/useAuth'
import { useNavigate } from 'react-router-dom'
// import { useStore } from 'react-redux'
// import "../node_modules/jquery/dist/jquery.min.js";
// import "../node_modules/bootstrap/dist/js/bootstrap.min.js"
// import {Navbar,Nav,NavDropdown,Form,FormControl,Button,ListGroup,OverlayTrigger,Popover} from 'react-bootstrap'
// import {SET_CURRENT_USER} from "../actions/UserActions"
// import SearchBar from "../components/SearchBar"
function NavbarContainer({authState,profile}){
    const dispatch = useDispatch()
    const [signedIn,setSignedIn] = useState(false)
    const navigate = useNavigate()
    const [user,setUser]= useState(null)
    let loggedIn = useSelector((state)=>{return state.users.loggedIn;});
    
    let currentProfile= useSelector((state)=>{return state.users.currentProfile;});
    
        

   
    
   
    const renderif=()=>{
//       console.log("xxxx",this.props.loggedIn)
        if (!!currentProfile){
            return(
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" onClick={()=>{
                                        navigate("/")
                                    }}>Pb</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
              
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                      <a className="nav-link" onClick={()=>{
                                        navigate("/")
                                    }}>Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={()=>{
                            navigate("/profile/home")
                        }}>Profile</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" onClick={()=>{
                            navigate("/discovery")
                        }}>Discovery</a>
                    </li>
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                        Create
                      </a>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" onClick={()=>{
                            navigate("/page")}
                        }>Page</a>
                        <a onClickclassName="dropdown-item" href={()=>{
                            navigate("/book")
                        }}>Book</a>
                        <a className="dropdown-item" href={()=>{
                            navigate("/library")
                        }}>Library</a>
                        </div>
                    </li>
                   
                    <li className="nav-item">
                        <a className="nav-link">Log Out</a>
                    </li>
                    <li>
                    
                    </li>
                </ul>
                </div>
        </nav>
        )
        }else{
            return(
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">Pb</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span class="sr-only">(current)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/discovery">Discovery</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/login">Log In</a>
                        </li>
                    </ul>
                </div>
        </nav>
            )
        }}
    return renderif()

}   
function mapState(state){

  return{
//     users: state.users.users,
//   loggedIn: state.users.loggedIn,
//   currentUser: state.users.currentUser,
//   books: state.books.books,
//   libraries: state.libraries.libraries
}
}
function mapDispatch(dispatch){
  return{
    // getCurrentUser: ()=>dispatch(SET_CURRENT_USER())
}
}
export default connect(mapState,mapDispatch)(NavbarContainer)


