import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export default function Profile() {
	const { currentUser } = useSelector(state => state.user)
	const [file, setFile] = useState(undefined)
	const [filePerc, setFilePerc] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [formData, setFormData] = useState({})
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
	return (
		<div className='p-3 max-w-lg mx-auto shadow-md rounded mt-3'>
			<h1 className='text-center text-3xl mt-3 font-semibold'>Profile</h1>
			<form className='flex flex-col gap-4'>
				<input onChange={e => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
				<img src={formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} alt="avatar" className='rounded-full h-24 w-24 object-cover self-center mt-4 cursor-pointer' />
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
				<input type="text" className='rounded border p-3' placeholder='username' id='username' />
				<input type="email" className='rounded border p-3' placeholder='email' id='email' />
				<input type="password" className='rounded border p-3' placeholder='password' id='password' />
				<button className='bg-sky-500 text-white mt-2 py-1 uppercase rounded hover:opacity-95 disabled:opacity-80'>Update</button>
				<div className='flex justify-between mt-5 text-red-700 text-sm'>
					<span className='cursor-pointer'>Delete account</span>
					<span className='cursor-pointer'>Sign out</span>
				</div>
			</form>
		</div>
	)
}
