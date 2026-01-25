import React from 'react'
import { assets } from '../assets/data'
import { cities } from '../assets/data'

const Hero = () => {
  return (
    <section className="h-screen w-screen bg-[url('/src/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="max-padd-container h-screen w-screen">
        {/*Overlay*/}
        <div className="absolute inset-0 bg-black/20 z-0" />
        {/* Container */}
        <div className='relative flex justify-end mx-auto flex-col gap-4 h-full py-6 sm:pt-18 z-10'>
          {/*Content*/}
          <div className='flex flex-col mt-12 text-white '>
            <button className='max-w-90 flex items-center space-x-3 border border-white medium-13 rounded-full px-4 pr-0.5 py-1 cursor-pointer'>
              <span>Explore how we simplify your rental experience.</span>
              <span className='flexCenter size-6 p-1 rounded-full bg-white'>
                <img src={assets.right} alt="rightIcon" width={20} />
              </span>
            </button>
            <h2 className='h2 capitalize leading-tight mt-3 my-2  text-white'>Your <span className='bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent'>perfect home</span> awaits in a place you’ll love.</h2>
          </div>
          {/* SEARCH/BOOKING FORM */}
          <form className='bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col lg:flex-row gap-4 lg:gap-x-8 max-w-md lg:max-w-full ring-1 ring-slate-900/5 relative'>
            <div className='flex flex-col w-full'>
              <div className='flex items-center gap-2'>
                <img src={assets.pin} alt="pinIcon" width={20}/>
                <label htmlFor="destinationInput">Place</label>
              </div>
              <input 
               list="destinations"
               id="destinationInput"
               type="text" 
               className='rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
               placeholder='Enter your preferred place.'
               required
              />
              <datalist id='destinations'>
                {cities.map((city, index) => (
                  <option value={city} key={index}/>
                ))}
              </datalist>
            </div>
            <div className='flex flex-col w-full'>
              <div className='flex items-center gap-2'>
                <img src={assets.calendar} alt="calenderIcon" width={20} />
                <label htmlFor="CheckIn">Move-In Date</label>
              </div>
              <input type="date" id="CheckIn" 
              className='rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'/>
            </div>
            <div className='flex flex-col w-full'>
              <div className='flex items-center gap-2'>
                <img src={assets.user} alt="userIcon" width={20} />
                <label htmlFor="guests">Tenants</label>
              </div>
              <input id='guests' type='number' min={1} max={5}
              className='rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
              placeholder='1'/>
            </div>
            <button type='submit' className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-6 text-white my-auto cursor-pointer max-md:w-full max-md:py-1'>

              <img src={assets.search} alt="searchIcon" width={20} className='invert'/>
              <span>Search</span>
              </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Hero