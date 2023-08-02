import { Button } from 'bootstrap'
import React ,{useState,useEffect,useLayoutEffect} from 'react'
import "../App.css"
import { logIn,signUp} from '../actions/UserActions';
import { connect,useDispatch} from 'react-redux';
import history from '../history';

function LogInContainer(props) {
    const dispatch = useDispatch()
    const [suUsername, setSuUsername] = useState('');
    const [suEmail, setSuEmail] = useState('');
    const [suPassword, setSuPassword] = useState('');
    const [selfStatement,setSelfStatement] = useState('')
    const [profilePicture, setProfilePicture] = useState(null)
    const [privacy, setPrivacy] = useState(false)
    const [liEmail, setLiEmail] = useState('');
    const [liPassword, setLiPassword] = useState('');
    const handleNewUser = (event) => {
        event.preventDefault();
        console.log(`username ${suEmail} password ${suPassword}`)
        const params ={email:suEmail,password:suPassword,username:suUsername,profilePicture:profilePicture,selfStatement:selfStatement,privacy:privacy}
        dispatch(signUp(params)).then((result) => {
        
            history.push("/profile/home")
        }).catch((err) => {
            
        });;
        // Perform form submission logic here, e.g., sending data to the server
        
    };

    const handleLogIn = (event)=>{
        event.preventDefault()
        dispatch(logIn(liEmail,liPassword)).then((result) => {
            history.push("/profile/home")
        }).catch((err) => {
            
        });
    }
    return (
        <div id="LogInContainer">
            <SignInCard username={suUsername}
                        password={suPassword}
                        email={suEmail}
                        setUsername={setSuUsername}
                        setEmail={setSuEmail} 
                        setPassword={setSuPassword}
                        setProfilePicture={setProfilePicture}
                        setPrivacy={setPrivacy}
                        handleSubmit={handleNewUser}/>
            <LogInCard  password={liPassword} 
                        email={liEmail}
                        handleSubmit={handleLogIn}
                        setEmail={setLiEmail}
                        setPassword={(str)=>setLiPassword(str)}/>
        </div>
    )
}


function SignInCard(props) {

    return (<div className='sign-card'>
                <form onSubmit={props.handleSubmit} >
                    <input  type="text"
                            name='username' 
                            placeholder='Usernmae'
                            value={props.username}
                            onChange={(e) => props.setUsername(e.target.value)}/>
                    <input
                        type="email" placeholder='E mail' value={props.email} onChange={(e) => props.setEmail(e.target.value)}
                    />
                    <label>Private:<input name="privacy" onInput={(e)=>props.setPrivacy(e.target.value)}type="checkbox"/></label>
                    <textarea name="selfStatement"/>
                    <input type='text' value={props.password} name='password'placeholder='Password' onChange={(e) => props.setPassword(e.target.value)}/>
            <input type="file" name ='profile_picture' onInput={(e)=>props.setProfilePicture(e.target.value)}/>
            <button type="submit">Sign Up</button>
        </form>
    </div>)
}

function LogInCard(props){
    return(<div className='sign-card'>
        <form onSubmit={props.handleSubmit} >
            <input type="text" value={props.email} name='email'placeholder='email' onChange={(e) => props.setEmail(e.target.value)}/>
            <input type='text' value={props.password} name='password'placeholder='Password'onChange={(e) => props.setPassword(e.target.value)}/>
            <button type="submit">Log In</button>
        </form>
    </div>)
}


// function mapDispatchToProps(dispatch){
//     return{ 
//       signUp:(email,password,username,profilePicture,selfStatement,privacy)=>dispatch(signUp((email,password,username,profilePicture,selfStatement,privacy))),
//       logIn:(email,password)=>dispatch(logIn(email,password)),
//     }
//   }
//     function mapStateToProps(state){
//         return{

//         }
//     }
  export default LogInContainer