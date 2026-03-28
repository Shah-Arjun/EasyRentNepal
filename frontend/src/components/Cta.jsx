import React from 'react'
import { assets } from '../assets/data'
import { useNavigate } from 'react-router-dom'

const Cta = () => {
  const navigate = useNavigate()


  return (
    <section className="bg-[#fffbee] pt-16 xl:pt-22">
      <div className="max-padd-container mx-2 md:mx-auto p-px">
        <div className="flex flex-col items-center justify-center text-center py-12 md:py-16 rounded-[15px]">
          <div className="flexCenter bg-black/80 text-white px-3 py-1.5 ring-1 ring-slate-900/10 gap-1 rounded-full text-xs">
              <img src={assets.rocket} alt="rocketImg" width={17} className="invert"/>
            <span>Trusted by Property Experts</span>
          </div>
          <h2 className="h2 mt-2 ">
            Rent Faster with <span className='text-secondary'> Smart Price Prediction </span> <br />
          </h2>
          <p className="text-slate-500 mt-2 max-w-lg max-md:text-sm">Get personalized property recommendations, verified listings, and rent predictions to find your perfect home faster and with confidence.</p>
         <button type="button" onClick={()=> { navigate('/listing'); }} className="flex items-center gap-2 hover:gap-5 btn-secondary mt-4">
            Explore Properties Now
            <span className='flex items-center justify-center w-6 h-6 p-1 rounded-full border'>
              <img src={assets.right} alt="rightIcon" width={20} />
            </span>
        </button>
        </div>
      </div>
    </section>
  )
}

export default Cta