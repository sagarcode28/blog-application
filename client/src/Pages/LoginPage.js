import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContent';


function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    async function login(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            })
        } else {
            alert('Wrong Credentials');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <form className='login' onSubmit={login}>
            <h1>Welcome Back!</h1>
            <p style={{textAlign: "center"}}>Please Enter the Username and Password to Login...</p>
            <input type='text' placeholder='Username' value={username} onChange={event => setUsername(event.target.value)} />
            <input type='password' placeholder='Password' value={password} onChange={event => setPassword(event.target.value)} />
            <button>Login</button>
        </form >
    )
}

export default LoginPage