import React, { useState } from 'react'

function RegisterPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev) {
        ev.preventDefault();
        const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-type': 'application/json' },
        });
        if (response.status === 200) {
            alert('registration Successful')
        } else {
            alert('registration Failed');
        }
    }

    return (

        <form className='register' onSubmit={register}>
            <h1>Register</h1>
            <p style={{textAlign: "center"}}>Please Enter the Username and Password to register...</p>
            <input type='text' placeholder='Username' value={username} onChange={ev => setUsername(ev.target.value)} />
            <input type='password' placeholder='Password'
                value={password} onChange={ev => setPassword(ev.target.value)}
            />
            <button>Register</button>
        </form>

    )
}

export default RegisterPage