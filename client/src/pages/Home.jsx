import { Link } from 'react-router-dom';
// image slider package
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useEffect, useState } from 'react';
import ListingItem from '../components/ListingItem';

export default function Home() {
	SwiperCore.use([Navigation]);
	const [offerListing, setOfferListing] = useState([]);
	const [rentListing, setRentListing] = useState([]);
	const [saleListing, setSaleListing] = useState([]);

	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch('/api/listing/get?offer=true&limit=4');
				const data = await res.json();
				setOfferListing(data);
				fetchRentListings();
			} catch (err) {
				console.log(err)
			}
		};

		const fetchRentListings = async () => {
			try {
				const res = await fetch('/api/listing/get?type=rent&limit=4');
				const data = await res.json();
				setRentListing(data);
				fetchSaleListings();
			} catch (err) {
				console.log(err)
			}
		};

		const fetchSaleListings = async () => {
			try {
				const res = await fetch('/api/listing/get?type=sale&limit=4');
				const data = await res.json();
				setSaleListing(data);
			} catch (err) {
				console.log(err)
			}
		};

		fetchOfferListings();
	}, [])
	return (
		<div>
			{/* top part */}
			<div className='flex flex-col gap-4 py-28 px-3 max-w-6xl mx-auto'>
				<h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'> Find your next <span className='text-slate-500'>Perfect</span>
					<br />place with ease
				</h1>
				<p className='text-slate-700 text-xs sm:text-sm'>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores cupiditate deleniti itaque quaerat. Similique ad libero tempore dolorum unde hic temporibus recusandae accusantium, excepturi tenetur iusto ab officia. A, fugit!
				</p>
				<Link to={`/search`} className='text-blue-800 text-xs sm:text-sm hover:underline font-bold'>
					Let's get started...
				</Link>
			</div>

			{/* Swiper */}
			<Swiper navigation>
				{offerListing && offerListing.length > 0 &&
					offerListing.map((listing) => (
						<SwiperSlide key={listing._id}>
							<div
								style={{
									background: `url(${listing.imageUrls[0]}) no-repeat center`,
									backgroundSize: 'cover',
								}}
								className='h-[320px] sm:h-[550px]'
							></div>
						</SwiperSlide>
					))
				}
			</Swiper>

			{/* listings of offer, rent and sale */}
			<div className='flex flex-col gap-7 w-full max-w-6xl mx-auto p-3'>
				{offerListing && offerListing.length > 0 && (
					<div className=''>
						<div className='my-3'>
							<h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
							<Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more...</Link>
						</div>
						<div className='flex flex-wrap gap-4'>
							{offerListing.map(listing => (
								<ListingItem key={listing._id} listing={listing} />
							))}
						</div>
					</div>
				)}
				{rentListing && rentListing.length > 0 && (
					<div className=''>
						<div className='my-3'>
							<h2 className='text-2xl font-semibold text-slate-600'>Recent Rent</h2>
							<Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more...</Link>
						</div>
						<div className='flex flex-wrap gap-4'>
							{
								rentListing.map(listing => (
									<ListingItem key={listing._id} listing={listing} />
								))
							}

						</div>
					</div>
				)}
				{saleListing && saleListing.length > 0 && (
					<div className=''>
						<div className='my-3'>
							<h2 className='text-2xl font-semibold text-slate-600'>Recent Sale</h2>
							<Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more...</Link>
						</div>
						<div className='flex flex-wrap gap-4'>
							{
								saleListing.map(listing => (
									<ListingItem key={listing._id} listing={listing} />
								))
							}

						</div>
					</div>
				)}
			</div>
		</div>
	)
}
