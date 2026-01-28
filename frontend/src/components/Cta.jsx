import React from 'react'
import { assets } from '../assets/data'

const Cta = () => {
  return (
    <section className="bg-[#fffbee] pt-16 xl:pt-22">
      <div className="max-padd-container mx-2 md:mx-auto p-px">
        <div className="flex flex-col items-center justify-center text-center py-12 md:py-16 rounded-[15px]">
          <div className="flexCenter bg-black/80 text-white px-3 py-1.5 ring-1 ring-slate-900/10 gap-1 rounded-full text-xs">
              <img src={assets.rocket} alt="rocketImg" width={17} className="invert"/>
            <span>Trusted by Experts</span>
          </div>
          <h2 className="h2 mt-2 ">
            Rent Faster with <span className='text-secondary'> Real Support </span> <br />
          </h2>
          <p className="text-slate-500 mt-2 max-w-lg max-md:text-sm">Find your perfect home faster with personalized recommendations, expert guidance, and results you can trust.</p>
          <button type="button" className="btn-secondary mt-4">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  )
}

export default Cta