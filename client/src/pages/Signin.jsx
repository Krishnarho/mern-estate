import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/features/user/userSlice';
import GAuth from '../components/GAuth';

export default function Signin() {
	const [data, setData] = useState({});
	const { currentUser, error, loading } = useSelector(state => state.user)
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onChange = (e) => {
		setData({ ...data, [e.target.id]: e.target.value });
	};

	const login = async (e) => {
		e.preventDefault();
		try {
			dispatch(signInStart())
			const response = await fetch('/api/auth/signin', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})
			const dataAPI = await response.json();

			if (dataAPI.success === false) { // if there is error middleware in api gets called which returns an object with keys "success, statusCode, message"
				dispatch(signInFailure(dataAPI.message));
				return;
			}
			dispatch(signInSuccess(dataAPI))
			navigate('/');
		} catch (error) {
			dispatch(signInFailure(error.message))
		}
	};

	return currentUser === null ? (
		<div className='mx-auto sm:max-w-md sm:rounded-lg sm:shadow-md my-3 bg-white'>
			<h1 className='text-center my-3 font-semibold text-xl sm:rounded-t-lg  bg-green-500 text-white py-3 mt-0 sm:text-3xl'>Sign In</h1>
			<form className='my-5 px-2 pb-5 flex flex-col' onSubmit={login}>
				{error && <p className='text-red-500 text-center mt-5'>{error}</p>}
				<label id="email">Email address:</label>
				<input type="email" id="email" className='text-sm border rounded focus:outline-green-500 mb-3 p-2' onChange={onChange} required />
				<label id="password">Password:</label>
				<input type="password" id="password" className='text-sm border rounded focus:outline-green-500 mb-3 p-2' onChange={onChange} required />
				<button disabled={loading} type="submit" className='mt-5 bg-green-500 py-1 px-5 rounded-md text-white text-md  hover:opacity-95 disabled:opacity-85'>{loading ? 'Loading...' : 'Login'}</button>
				<GAuth />
				<span className='block text-center mt-5 text-sm'>Don't have an account... <Link to="/sign-up" className='text-blue-500 hover:underline'>Sign Up</Link></span>
			</form>
		</div>
	) : navigate('/profile')
}
