import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt, FaBath, FaBed, FaParking, FaChair } from 'react-icons/fa';
// image slider package
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import Contact from '../components/Contact';

function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [contact, setContact] = useState(false)
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false)
                setError(false);
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        };
        fetchListing();
    }, [params.listingId])


    return (
        <main>
            {loading && <p className='text-center mt-5 text-2xl'>Loading...</p>}
            {error && <p className='text-center mt-5 text-red-700'>Someting went wrong!</p>}
            {listing && !loading && !error &&
                <>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[300px] sm:h-[400px] md:h-[550px]'
                                    style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
                                ></div>
                            </SwiperSlide>
                        ))
                        }
                    </Swiper>

                    <div className='flex flex-col gap-4 max-w-4xl mx-auto my-7 p-3'>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - Rs.
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-NP')
                                : listing.regularPrice.toLocaleString('en-NP')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className=' mt-5 flex items-center gap-2 text-slate-600 text-sm'>
                            <FaMapMarkerAlt className='text-green-600' />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-teal-800 p-1 rounded-md text-white text-center w-full max-w-[200px]'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            <p className='bg-pink-800 p-1 rounded-md text-white text-center w-full max-w-[200px]'>
                                Rs. {+listing.regularPrice - +listing.discountPrice}
                            </p>
                        </div>
                        <p className='text-slate-700'>
                            <span className='font-semibold text-black'>Description- </span>
                            {listing.description}
                        </p>
                        <ul className='flex flex-wrap items-center gap-4 sm:gap-6 text-green-900 text-sm font-semibold'>
                            <li className='flex gap-1 items-center whitespace-nowrap'>
                                <FaBed className='text-lg' />
                                {listing.bedrooms}
                                {listing.bedrooms > 1 ? ' Beds' : ' Bed'}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap'>
                                <FaBath className='text-lg' />
                                {listing.bathrooms}
                                {listing.bedrooms > 1 ? ' Bathrooms' : ' Bathroom'}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap'>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap'>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && currentUser._id !== listing.userRef && !contact &&
                            <button
                                onClick={() => setContact(true)}
                                className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-95'
                            >contact landlord</button>
                        }
                        {contact && <Contact listing={listing} />}
                    </div>
                </>
            }
        </main >
    )
}

export default Listing