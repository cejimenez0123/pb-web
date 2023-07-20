import { Button } from 'bootstrap'
import React ,{useState,useEffect,useLayoutEffect} from 'react'
import "../App.css"

export default function LogInContainer({logIn}) {
    const [suUsername, setSuUsername] = useState('');
    const [suEmail, setSuEmail] = useState('');
    const [suPassword, setSuPassword] = useState('');
    const [liEmail, setLiEmail] = useState('');
    const [liPassword, setLiPassword] = useState('');
  const [email, setEmail] = useState('');
    const handleNewUser = (event) => {
        event.preventDefault();
        // Perform form submission logic here, e.g., sending data to the server
        console.log('Username:', suUsername);
        console.log('Email:', suEmail);
    };
    const handleLogIn = (event)=>{
        event.preventDefault()
     
        console.log('Email:', liEmail);
    }
    return (
        <div id="LogInContainer">
            <SignInCard username={suUsername}
                        password={suPassword}
                        email={suEmail}
                        setUsername={setSuUsername}
                        setEmail={setSuEmail} 
                        setPassword={setSuPassword}
                        handleSubmit={handleNewUser}/>
            <LogInCard  password={liPassword} 
                        email={liEmail}
                        handleSubmit={handleLogIn}
                        setEmail={setLiEmail}
                        setPassword={setLiPassword}/>
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
                    <input type='text' value={props.password} name='password'placeholder='Password' onChange={(e) => props.setPassword(e.target.value)}/>
            <input type="file" name ='profile_picture'/>
            <button type="submit">Sign Up</button>
        </form>
    </div>)
}

function LogInCard(props){
    return(<div className='sign-card'>
        <form onSubmit={props.handleSubmit} >
            <input type="text" value={props.email} name='email'placeholder='email' onChange={(e) => props.setEmail(e.target.value)}/>
            <input type='text' value={props.password} name='password'placeholder='Password'onChange={(e) => props.setPassowrd(e.target.value)}/>
            <button type="submit">Log In</button>
        </form>
    </div>)
}