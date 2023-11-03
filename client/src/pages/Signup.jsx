import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const register = async (e) => {	
    e.preventDefault(); 
	if(data.password === data.cPassword){
		try { 
			const response = await fetch('/api/auth/signup', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})
			const dataAPI = await response.json();
			console.log(dataAPI);
			if (dataAPI.success === false) {
				setLoading(false);
				setError(dataAPI.message);
				return;
			  }
			  setLoading(false);
			  setError(null);
			  navigate('/sign-in');
		} catch (error) {
			console.log(error.message)
		}
	} else{
		setError('Password does not match!')
	}
  };
  return (
    <div className='mx-auto sm:max-w-md sm:rounded-lg sm:shadow-md my-3 bg-white'>
      <h1 className='text-center my-3 font-semibold text-xl sm:rounded-t-lg  bg-green-500 text-white py-3 mt-0 sm:text-3xl'>Sign Up</h1>
      <form className='my-5 px-2 pb-5' onSubmit={register}>
	  	{error && <p className='text-red-500 text-center mt-5'>{error}</p>}
        <label id="username">Username:</label>
        <input type="text" id="username" className='text-sm border rounded focus:outline-green-500 mb-3 p-2 w-full' onChange={onChange} required/>
        <label id="email">Email:</label>
        <input type="email" id="email" className='text-sm border rounded focus:outline-green-500 mb-3 p-2 w-full' onChange={onChange} required/>
        <label id="password">Password:</label>
        <input type="password" id="password" className='text-sm border rounded focus:outline-green-500 mb-3 p-2 w-full' onChange={onChange} required/>
        <label id="cPassword">Confirm Password:</label>
        <input type="password" id="cPassword" className='text-sm border rounded focus:outline-green-500 mb-3 p-2 w-full' onChange={onChange} required/> 
        <button disabled={loading} type="submit" className='mx-auto block mt-5 bg-green-500 py-2 px-5 rounded-md text-white text-md  hover:opacity-95 disabled:opacity-85'>{loading ? 'Loading...' : 'Register'}</button>
        <span className='block text-center mt-5 text-sm'>Have an account... <Link to="/sign-in" className='text-blue-500 hover:underline'>Sign in</Link></span>
      </form>
    </div>
  )
}
