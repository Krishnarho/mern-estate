import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/features/user/userSlice';
import { useNavigate } from 'react-router-dom';

function GAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                })
            });
            const dataGoogle = await res.json();
            dispatch(signInSuccess(dataGoogle));
            navigate('/');
        } catch (error) {
            console.log('Could not sign in with Google', error)
        }
    }
    return (
        <button
            type="button"
            onClick={handleGoogle}
            className='mx-auto block mt-3 bg-gradient-to-r from-indigo-500 to-red-600 py-1 px-5 rounded-md text-white text-md  hover:opacity-95 disabled:opacity-85'
        > Continue with Google</button>
    )
}

export default GAuth