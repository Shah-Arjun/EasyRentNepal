import React from 'react'
import Title from './Title'
import { assets } from '../assets/data'

const About = () => {
  return (
    <section className="max-padd-container py-16 xl:py-28 !pt-36">
      {/* Container */}
      <div className="flex  items-center flex-col lg:flex-row gap-12">
        {/* Info - Left Side */}
        <div className="flex-1">
          <Title
            title1={"Your Trusted Home Rental Partner"}
            title2={"Helping You Every Step of the Way"}
            para={"Trust, clarity and simplicity are the core of everything we do to make your property journey easy."}
            titleStyles={"mb-10"}
          />

          <div className='flex flex-col gap-6 mt-5'>
            <div className='flex gap-3'>
              <img
                src={assets.calendarSecondary}
                alt=""
                width={20}
              />
              <p>In-app scheduling for property viewings</p>
            </div>
            <div className='flex gap-3'>
              <img
                src={assets.graph}
                alt=""
                width={20}
              />
              <p>100% transparent pricing</p>
            </div>
            <div className='flex gap-3'>
              <img
                src={assets.map}
                alt=""
                width={20}
              />
              <p>User-friendly interface for smooth navigation</p>
            </div>
            <div className='flex gap-3'>
              <img
                src={assets.pound}
                alt=""
                width={20}
              />
              <p>Access to off-market properties</p>
            </div>
          </div>
          {/* Rating */}
          <div className="flex items-center divide-x divide-gray-300 mt-11">
            <div className="flex -space-x-3 pr-3">
              <img src={assets.client1} alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-1" />
              <img src={assets.client2} alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-1" />
              <img src={assets.client3} alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-1" />
              <img src={assets.client4} alt="image" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-1" />
            </div>
            <div className="pl-3">
              <div className="flex items-center">
                <img src={assets.star} alt="starIcon" width={17} />
                <img src={assets.star} alt="starIcon" width={17} />
                <img src={assets.star} alt="starIcon" width={17} />
                <img src={assets.star} alt="starIcon" width={17} />
                <img src={assets.star} alt="starIcon" width={17} />
                <p className="text-gray-600 medium-16 ml-2">5.0</p>
              </div>
              <p className="text-sm text-gray-500">Trusted by <span className="font-medium text-gray-800">5,000+</span> users</p>
            </div>
          </div>
        </div>
        {/* Image - Right Side */}
        <div className="flex-1">
        <div className="relative flex justify-end">
          <img src={assets.about} alt="aboutImg" className="rounded-3xl" />
        </div>
        </div>
      </div>
    </section>
  )
}

export default About
