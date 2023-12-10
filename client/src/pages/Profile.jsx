import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStart, updateFailure, updateSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/features/user/userSlice';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export default function Profile() {
	const { currentUser, loading, error } = useSelector(state => state.user)
	const dispatch = useDispatch();
	const [file, setFile] = useState(undefined)
	const [filePerc, setFilePerc] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [formData, setFormData] = useState({})
	const [editSuccess, setEditSuccess] = useState(false)
	const fileRef = useRef(null)

	useEffect(() => {
		if (file) {
			handleFileUpload(file)
		}
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			(error) => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setFormData({ ...formData, avatar: downloadURL })
				})
			}
		)
	}

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value })

	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'POST',
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify(formData)
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateFailure(data.message));
				return;
			}
			dispatch(updateSuccess(data))
			setEditSuccess(true);
		} catch (err) {
			dispatch(updateFailure(err.message))
		}
	}

	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart())
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: 'DELETE',
			})
			const data = res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (err) {
			dispatch(updateFailure(err.message))
		}
	}
	return (
		<div className='p-3 max-w-lg mx-auto shadow-md rounded mt-3'>
			<h1 className='text-center text-3xl mt-3 font-semibold'>Profile</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input
					onChange={e => setFile(e.target.files[0])}
					type='file' ref={fileRef} hidden accept='image/*'
				/>
				<img
					src={formData.avatar || currentUser.avatar}
					onClick={() => fileRef.current.click()}
					alt="avatar"
					className='rounded-full h-24 w-24 object-cover self-center mt-4 cursor-pointer'
				/>
				<p className='text-sm text-center'>
					{
						(fileUploadError) ? (
							<span className='text-red-700'> Error Image Upload (image must be less than 2 mb)</span>
						) : filePerc > 0 && filePerc < 100 ? (
							<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
						) : filePerc === 100 ? (
							<span className='text-green-700'>Image successfully uploaded!</span>
						) : (
							''
						)
					}
				</p>
				<input
					type="text"
					className='rounded border p-3' placeholder='username' id='username'
					defaultValue={currentUser.username}
					onChange={handleChange}
				/>
				<input
					type="email"
					className='rounded border p-3' placeholder='email' id='email'
					defaultValue={currentUser.email}
					onChange={handleChange}
				/>
				<input
					type="password"
					className='rounded border p-3'
					placeholder='password' id='password'
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className='bg-sky-500 text-white mt-2 py-1 uppercase rounded hover:opacity-95 disabled:opacity-80'
				>{loading ? 'Loading...' : 'Update'}</button>
				<div className='flex justify-between mt-5 text-red-700 text-sm'>
					<span
						onClick={handleDeleteUser}
						className='cursor-pointer'>Delete account</span>
					<span className='cursor-pointer'>Sign out</span>
				</div>

				<p className='text-red-700 text-center'>{error ? error : ''}</p>
				<p className='text-green-700 text-center'>
					{editSuccess ? 'User is updated successfully!' : ''}
				</p>
			</form>
		</div>
	)
}
