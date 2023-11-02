import React from 'react';
import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md p-1 sm:p-3'>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
		<Link to="/">
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-green-500'>Sirsa</span>
            <span className='text-green-700'>Estate</span>
        </h1>
		</Link>
		<form className='bg-slate-100 p-1 sm:p-2 rounded-lg flex items-center'>
			<input type="text" placeholder='Search...' className='bg-transparent w-24 focus:outline-none sm:w-64' />
			<FaSearch className='text-slate-600'/>
		</form>
		<ul className='flex space-x-4 items-center text-green-700 text-sm sm:text-md font-bold'>
			<Link to="/"><li className='hidden sm:inline hover:underline'>Home</li></Link>
			<Link to="/about"><li className='hidden sm:inline hover:underline'>About</li></Link>
			<Link to="/sign-in"><li className='hover:underline'>Sign In</li></Link>
		</ul>
	  </div>
    </header>
  )
}
