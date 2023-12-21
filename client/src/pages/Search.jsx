import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem';

function Search() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const [searchData, setSearchData] = useState({
        keyword: '',
        type: 'all',
        offer: false,
        parking: false,
        furnished: false,
        sort: 'created_at',
        order: 'desc'
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const keywordUrl = urlParams.get('keyword');
        const typeUrl = urlParams.get('type');
        const offerUrl = urlParams.get('offer');
        const parkingUrl = urlParams.get('parking');
        const furnishedUrl = urlParams.get('furnished');
        const sortUrl = urlParams.get('sort');
        const orderUrl = urlParams.get('order');

        if (keywordUrl || typeUrl || offerUrl || parkingUrl || furnishedUrl || sortUrl || orderUrl) {
            setSearchData({
                keyword: keywordUrl || '',
                type: typeUrl || 'all',
                offer: offerUrl === 'true' ? true : false,
                parking: parkingUrl === 'true' ? true : false,
                furnished: furnishedUrl === 'true' ? true : false,
                sort: sortUrl || 'created_at',
                order: orderUrl || 'desc'
            })
        }

        const fetchListings = async () => {
            const searchQuery = urlParams.toString();
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get?${searchQuery}`);
                const data = await res.json();
                setListings(data);
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setError(true)
            }
        };
        fetchListings();

    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'keyword') {
            setSearchData({ ...searchData, keyword: e.target.value })
        }

        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSearchData({ ...searchData, type: e.target.id })
        }

        if (e.target.id === 'offer' || e.target.id === 'furnished' || e.target.id === 'parking') {
            setSearchData({ ...searchData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false }) // since we are getting the value of checked from url it can be boolean (1st condition) or can be string (2nd condition)
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';

            setSearchData({ ...searchData, sort, order });
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('keyword', searchData.keyword);
        urlParams.set('type', searchData.type);
        urlParams.set('offer', searchData.offer);
        urlParams.set('parking', searchData.parking);
        urlParams.set('furnished', searchData.furnished);
        urlParams.set('sort', searchData.sort);
        urlParams.set('order', searchData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }
    return (
        <div className='flex flex-col md:flex-row w-full max-w-7xl mx-auto'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSearch}
                    className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'> Search: </label>
                        <input
                            type="text" id='keyword'
                            className='w-full rounded-lg p-2 border'
                            value={searchData.keyword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type: </label>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox" id='all' className='w-5'
                                checked={searchData.type === 'all'}
                                onChange={handleChange}
                            />
                            <span>All</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox" id='rent' className='w-5'
                                checked={searchData.type === 'rent'}
                                onChange={handleChange}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox" id='sale' className='w-5'
                                checked={searchData.type === 'sale'}
                                onChange={handleChange}
                            />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox" id='offer' className='w-5'
                                checked={searchData.offer}
                                onChange={handleChange}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities: </label>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox" id='parking' className='w-5'
                                checked={searchData.parking}
                                onChange={handleChange}
                            />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox" id='furnished' className='w-5'
                                checked={searchData.furnished}
                                onChange={handleChange}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <label className='font-semibold'>Sort: </label>
                        <select
                            id="sort_order" className='p-3 border rounded-lg'
                            defaultValue={'created_at_desc'}
                            onChange={handleChange}
                        >
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                        </select>
                    </div>
                    <button
                        className='p-3 w-full bg-slate-700 text-white uppercase rounded-lg hover:opacity-95'
                    >Search</button>
                </form>
            </div>
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold sm:border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
                <div className='flex flex-wrap gap-4 p-7'>
                    {!loading && listings.length === 0 &&
                        <p className='text-slate-500 text-xl'>No listing found..</p>
                    }
                    {loading &&
                        <p className='text-slate-700 w-full text-center text-xl'>Loading...</p>
                    }
                    {!loading && listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Search