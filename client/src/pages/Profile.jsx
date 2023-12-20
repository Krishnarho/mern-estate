import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateStart, updateFailure, updateSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutUserStart, signoutUserSuccess, signoutUserFailure } from '../redux/features/user/userSlice';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { FaTrashAlt, FaPenSquare } from "react-icons/fa";

export default function Profile() {
	const { currentUser, loading, error } = useSelector(state => state.user)
	const dispatch = useDispatch();
	const [file, setFile] = useState(undefined)
	const [filePerc, setFilePerc] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [formData, setFormData] = useState({})
	const [editSuccess, setEditSuccess] = useState(false)
	const [isEditable, setIsEditable] = useState(false)
	const [showListing, setShowListing] = useState([])
	const [listingError, setListingError] = useState(false)
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
			setTimeout(() => {
				setEditSuccess(false)
			}, 1500)
			setIsEditable(false)
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
			dispatch(deleteUserFailure(err.message))
		}
	}

	const handleSignout = async () => {
		try {
			dispatch(signoutUserStart())
			const res = await fetch(`/api/auth/signout/${currentUser._id}`)
			const data = await res.json();
			if (data.success === false) {
				dispatch(signoutUserFailure(data.message))
			}
			dispatch(signoutUserSuccess(data));
		} catch (err) {
			dispatch(signoutUserFailure(err.message))
		}
	}

	const handleListing = async () => {
		try {
			setListingError(false);
			const res = await fetch(`/api/user/listings/${currentUser._id}`)
			const data = await res.json()
			//console.log(data);
			if (data.success === false) {
				setListingError(true)
				return
			}
			setShowListing(data)
		} catch (error) {
			setListingError(true)
		}
	}

	const handleDeleteListing = async (listingId) => {
		console.log(listingId);
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: "DELETE"
			});
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return
			}
			setShowListing((prev) => prev.filter(listing => listing._id !== listingId))
		} catch (error) {
			console.log(error.message)
		}
	}

	return (
		<div className='p-3 max-w-lg mx-auto shadow-md rounded mt-3'>
			<h1 className='text-center text-3xl mt-3 font-semibold'>Profile</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input
					disabled={!isEditable}
					onChange={e => setFile(e.target.files[0])}
					type='file' ref={fileRef} hidden accept='image/*'
				/>
				<img
					src={formData.avatar || currentUser.avatar}
					onClick={() => fileRef.current.click()}
					alt="avatar"
					className={`rounded-full h-24 w-24 object-cover self-center mt-4 ${!isEditable ? 'cursor-default' : 'cursor-pointer'}`}
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
					className='rounded border p-3 focus:outline-none' placeholder='username' id='username'
					defaultValue={currentUser.username}
					onChange={handleChange}
					disabled={!isEditable}
				/>
				<input
					type="email"
					className='rounded border p-3 focus:outline-none' placeholder='email' id='email'
					defaultValue={currentUser.email}
					onChange={handleChange}
					disabled={!isEditable}
				/>
				<input
					type="password"
					className='rounded border p-3 focus:outline-none'
					placeholder='password' id='password'
					onChange={handleChange}
					disabled={!isEditable}
				/>
				<button
					hidden={isEditable}
					type='button'
					className='bg-cyan-500 text-white mt-2 py-2 uppercase rounded hover:opacity-95 disabled:opacity-80'
					onClick={() => setIsEditable(true)}
				>Edit</button>
				<button
					hidden={!isEditable}
					disabled={loading}
					className='bg-sky-500 text-white mt-2 py-2 uppercase rounded hover:opacity-95 disabled:opacity-80'
				>{loading ? 'Loading...' : 'Save'}</button>
				<Link to='/create-listing'
					className='bg-purple-500 text-white text-center rounded uppercase mt-1 py-2 hover:opacity-80'
				>Create listing</Link>
				<div className='flex justify-between mt-2 text-red-700 text-sm'>
					<span
						onClick={handleDeleteUser}
						className='cursor-pointer'
					>Delete account</span>
					<span
						onClick={handleSignout}
						className='cursor-pointer'
					>Sign out</span>
				</div>

				{error && <p className='text-red-700 text-center'>{error}</p>}
				{editSuccess && <p className='text-green-700 text-center'>User updated successfully!!</p>}
				{showListing && showListing.length === 0 &&
					<button
						type='button'
						onClick={handleListing}
						className='text-green-700'
					>Show Listings</button>
				}
				<p className='text-red-700'>
					{listingError ? 'Error showing listings' : ''}
				</p>
				{showListing && showListing.length > 0 &&
					<div className='flex flex-col gap-4'>
						<h1 className='text-2xl font-semibold text-center'>Your Listing</h1>
						{
							showListing.map(listing => (
								<div key={listing._id}
									className='flex justify-between items-center border gap-4 p-3 rounded-lg'
								>
									<Link to={`/listing/${listing._id}`}>
										<img src={listing.imageUrls[0]} alt="listing Cover" className='w-16 h-18 object-contain' />
									</Link>
									<Link to={`/listing/${listing._id}`} className='text-slate-700 truncate font-semibold hover:underline flex-1'>
										<p className=''>{listing.name}</p>
									</Link>
									<div className='flex flex-col justify-center mt-2 gap-2'>
										<button
											type='button'
											onClick={() => handleDeleteListing(listing._id)}
											className='text-red-700'
										><FaTrashAlt /></button>
										<Link to={`/update-listing/${listing._id}`}>
											<button className='text-green-700'><FaPenSquare /></button>
										</Link>
									</div>
								</div>
							))
						}
					</div>
				}
			</form>
		</div>
	)
}
