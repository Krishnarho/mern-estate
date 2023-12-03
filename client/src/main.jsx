import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { Home, About, Signin, Signup, Profile } from './pages/index'
import { store } from './redux/store.js';
import { Provider } from 'react-redux';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<App />}>
			<Route path="" element={<Home />} />
			<Route path="/about" element={<About />} />
			<Route path="/sign-in" element={<Signin />} />
			<Route path="/sign-up" element={<Signup />} />
			<Route path="/profile" element={<Profile />} />
		</Route>
	)
)

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>,
)
