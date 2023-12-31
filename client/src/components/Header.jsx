import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
	const { currentUser } = useSelector(state => state.user)
	const [keyword, setKeyword] = useState('')
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set('keyword', keyword);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	}

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchKeywordFromUrl = urlParams.get('keyword');
		if (searchKeywordFromUrl) {
			setKeyword(searchKeywordFromUrl);
		}
	}, [location.search])

	return (
		<header className='bg-slate-200 shadow-md p-1 sm:p-3'>
			<div className="flex justify-between items-center max-w-6xl mx-auto p-3">
				<Link to="/">
					<h1 className='font-black text-sm sm:text-xl flex flex-wrap'>
						<span className='text-green-500 md:text-3xl'>Sirsa</span>
						<span className='text-green-700  md:text-3xl'>Estate</span>
					</h1>
				</Link>
				<form
					onSubmit={handleSearch}
					className='bg-slate-100 p-1 sm:p-2 rounded-lg flex items-center'>
					<input
						type="text"
						placeholder='Search...'
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						className='bg-transparent w-24 focus:outline-none sm:w-64' />
					<button>
						<FaSearch className='text-slate-600' />
					</button>
				</form>
				<ul className='flex space-x-4 items-center text-green-700 text-sm sm:text-md font-bold'>
					<Link to="/"><li className='hidden sm:inline hover:underline'>Home</li></Link>
					<Link to="/about"><li className='hidden sm:inline hover:underline'>About</li></Link>
					<Link to="/profile">
						{currentUser ? (<img className='rounded w-7 h-7 object-cover' src={currentUser.avatar} alt="profile" />) : (<li className='hover:underline'> Sign In</li>)}
					</Link>
				</ul>
			</div>
		</header>
	)
}
