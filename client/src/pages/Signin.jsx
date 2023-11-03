import React from 'react';
import { Link } from 'react-router-dom';

export default function Signin() {
  return (
    <div className='mx-auto sm:max-w-md sm:rounded-lg sm:shadow-md my-3 bg-white'>
      <h1 className='text-center my-3 font-semibold text-xl sm:rounded-t-lg  bg-green-500 text-white py-3 mt-0 sm:text-3xl'>Sign In</h1>
      <form className='my-5 px-2 pb-5'>
        <label id="username">Username / Email address:</label>
        <input type="text" id="username" className='text-sm border rounded focus:outline-green-500 mb-3 p-2 w-full' required/>
        <label id="password">Password:</label>
        <input type="password" id="password" className='text-sm border rounded focus:outline-green-500 mb-3 p-2 w-full' required/>
        <button type="submit" className='mx-auto block mt-5 bg-green-500 py-2 px-5 rounded-md text-white text-md hover:opacity-95 disabled:opacity-85'>Login</button>
        <span className='block text-center mt-5 text-sm'>Don't have an account... <Link to="/sign-up" className='text-blue-500 hover:underline'>Sign Up</Link></span>
      </form>
    </div>
  )
}
