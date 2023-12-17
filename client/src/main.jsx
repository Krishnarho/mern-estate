import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import './index.css';
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { Home, About, Signin, Signup, Profile, CreateListing, UpdateListing } from './pages/index';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<App />}>
			<Route path="" element={<Home />} />
			<Route path="/about" element={<About />} />
			<Route path="/sign-in" element={<Signin />} />
			<Route path="/sign-up" element={<Signup />} />
			<Route element={<PrivateRoute />}>
				<Route path="/profile" element={<Profile />} />
				<Route path="/create-listing" element={<CreateListing />} />
				<Route path="/update-listing/:listingId" element={<UpdateListing />} />
			</Route>
		</Route>
	)
);

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<PersistGate loadin={null} persistor={persistor}>
			<RouterProvider router={router} />
		</PersistGate>
	</Provider>
);
