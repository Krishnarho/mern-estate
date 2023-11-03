import React,{useState} from 'react';
import { Link , useNavigate} from 'react-router-dom';

export default function Signin() {
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
    };

    const login = async (e) => {
        e.preventDefault(); 
            try { 
                const response = await fetch('/api/auth/signin', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                const dataAPI = await response.json();
                console.log(dataAPI)
                if (dataAPI.success === false) {
                    setLoading(false);
                    setError(dataAPI.message);
                    return;
                  }
                  setLoading(false);
                  setError(null);
                  navigate('/about');
            } catch (error) {
                setError(error.message)
            }
      };

  return (
    <div className='mx-auto sm:max-w-md sm:rounded-lg sm:shadow-md my-3 bg-white'>
      <h1 className='text-center my-3 font-semibold text-xl sm:rounded-t-lg  bg-green-500 text-white py-3 mt-0 sm:text-3xl'>Sign In</h1>
      <form className='my-5 px-2 pb-5' onSubmit={login}>
      {error && <p className='text-red-500 text-center mt-5'>{error}</p>}
        <label id="email">Email address:</label>
        <input type="email" id="email" className='text-sm border rounded focus:outline-green-500 mb-3 p-2 w-full' onChange={onChange} required/>
        <label id="password">Password:</label>
        <input type="password" id="password" className='text-sm border rounded focus:outline-green-500 mb-3 p-2 w-full' onChange={onChange} required/>
        <button disabled={loading} type="submit" className='mx-auto block mt-5 bg-green-500 py-2 px-5 rounded-md text-white text-md  hover:opacity-95 disabled:opacity-85'>{loading ? 'Loading...' : 'Login'}</button>
        <span className='block text-center mt-5 text-sm'>Dont have an account... <Link to="/sign-up" className='text-blue-500 hover:underline'>Sign Up</Link></span>
      </form>
    </div>
  )
}
