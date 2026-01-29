import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/data'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
// import required modules
import { Autoplay } from 'swiper/modules';
import { useAppContext } from '../context/Appcontext';
import Item from './Item';


const FeaturedProperties = () => {

  const { properties } = useAppContext()

  return (
    <section className="max-padd-container py-16 xl:py-22 ">
      <span className="medium-18">Your New Home Awaits.</span>
      <h2 className='h2'>Discover Your Home Away From Home.</h2>
      <div className='flexBetween mt-8 mb-6'>
        <h5>
          <span className='font-bold'>Displaying 1-6</span> from 50+ properties</h5>
        <Link to={'/listing'} onClick={() => scrollTo(0, 0)} className='hg-secondary/10 ring-1 ring-slate-900/15 text-white text-2xl rounded-md p-2 flexCenter'>
          <img src={assets.sliders} alt="" />
        </Link>
      </div>
      {/* Container  */}
      <Swiper
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          600: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1124: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1300: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        modules={[Autoplay]}
        className="h-[488px] md:h-[533px] xl:h-[422-px] mt-5"
      >

        {properties.slice(0, 6).map((property) => (
          <SwiperSlide key={property._id}>
            <Item property={property} />
          </SwiperSlide>
        ))}

      </Swiper>
    </section>
  )
}

export default FeaturedProperties