import React, { useState } from 'react'

const Login = () => {

  const [state , setState] = useState('Sign Up');

  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [name , setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  }

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div>
        <p>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointments.</p>
        <div>
          <p>Full Name</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
    </form>
  )
}

export default Login
