import React from 'react'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div className='bg-gradient-to-r from-[#fffbee] to-white'>
      <Hero/>
      <About/>
      <FeaturedProperties/>
      <Faq/>
      <Cta/>
      <Testimonial/>
    </div>
  )
}

export default Home