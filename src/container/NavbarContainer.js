import React from 'react'
import {connect, useSelector} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
// import { useStore } from 'react-redux'
// import "../node_modules/jquery/dist/jquery.min.js";
// import "../node_modules/bootstrap/dist/js/bootstrap.min.js"
// import {Navbar,Nav,NavDropdown,Form,FormControl,Button,ListGroup,OverlayTrigger,Popover} from 'react-bootstrap'
// import {SET_CURRENT_USER} from "../actions/UserActions"
// import SearchBar from "../components/SearchBar"
function NavbarContainer(){
    let loggedIn = useSelector((state)=>{return state.users.loggedIn;});
//    constructor(){
//      super()
//      this.state={filtered: []}
//    }
//    componentDidMount(){
    //  this.props.getCurrentUser()
   
// filterFunction(e){
//      let input = e.target.value
//   let filtered = this.props.users.filter(x=>{
   
//   let  user = x.attributes
//   return  user.name.includes(input) || user.username.includes(input)

//   })

//  let list = filtered.map((x,i)=>{

//   return(
//   <ListGroup.Item>  <a key={i}> {x.attributes.name}</a></ListGroup.Item>)

//  })
//  this.setState({filtered: list}) 
//     }
    
    
    // handleLogOut(){
    //     this.props.endSession()
    // }
const renderif=()=>{
//       console.log("xxxx",this.props.loggedIn)
 
     if (loggedIn){
            return(
              <nav id="sidebar">
       
            <div className="sidebar-header">
                <h3>Pb</h3>
            </div>


            <ul className="list-unstyled components">
                <li className="active">
                    <a href="/">Home</a>
                </li>
                <li><a href={`/user/${this.props.currentUser.id}`}>Profile</a></li>
                <li><a href={`/private/collection`}>Private Collection</a>
                
                    </li> 
                <li><a href={'/library/1'}>Public Library</a></li>
                <li><a onClick={()=>this.handleLogOut()}href="/">Log Out</a></li>
            </ul>
        </nav>

)
        }else{
            return(
            <nav id="sidebar">
                <div className="sidebar-header">
                    <span><a href="/">Pb</a></span>
                </div>
                <ul className="list-unstyled components">
                    <li className="">
                       <a href="/">Home</a>
                    </li>
                    <li className="">
                        <a href="/discovery">Discovery</a>
                    </li>
                    <li>
                        <a href={'/login'}>Log In</a>
                    </li>
            </ul>
        </nav>
            )}}
  

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