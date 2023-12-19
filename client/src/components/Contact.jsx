import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Contact(props) {
    const listing = props.listing;
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json();
                setLandlord(data);
            } catch (err) {
                console.log(err.message)
            }
        };
        fetchUser();
    }, [listing.userRef])

    const onChange = (e) => {
        setMessage(e.target.value);
    }
    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name}</span></p>
                    <textarea name="message" id="message" rows="2"
                        className='w-full p-3 rounded-lg border'
                        onChange={onChange}
                        placeholder='Enter your message..'
                        value={message}
                    ></textarea>
                    <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className={` ${message === '' ? 'bg-slate-300 pointer-events-none' : 'bg-slate-700 pointer-events-auto'} p-3 rounded-lg uppercase text-center text-white  hover:opacity-95`}
                    >Send Message</Link>
                </div>
            )}
        </>
    )
}

export default Contact