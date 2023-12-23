import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md'

function ListingItem(props) {
    const listing = props.listing
    return (
        <div className='w-full sm:w-[330px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition duration-300'
                />
                <div className='flex flex-col gap-2 w-full p-3'>
                    <h2 className='truncate font-semibold text-slate-700'>{listing.name}</h2>
                    <div className='flex gap-1 items-center'>
                        <MdLocationOn className='text-teal-700' />
                        <p className='text-sm text-gray-600 truncate w-full'>
                            {listing.address}
                        </p>
                    </div>
                    <p className='text-sm text-slate-500 line-clamp-2'>
                        {listing.description}
                    </p>
                    <p className='text-slate-500 mt-2 font-semibold '>
                        Rs.
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('en-NP')
                            : listing.regularPrice.toLocaleString('en-NP')}
                        {listing.type === 'rent' && ' / Month'}
                    </p>
                    <div className='flex gap-4 text-xs font-bold text-teal-700'>
                        <span>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                        </span>
                        <span>
                            {listing.bathrooms > 1 ? `${listing.bedrooms} Baths` : `${listing.bedrooms} Bath`}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ListingItem