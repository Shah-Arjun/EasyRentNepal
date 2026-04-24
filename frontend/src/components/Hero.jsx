import React, { useState } from 'react'
import { assets } from '../assets/data'
import { cities } from '../assets/data'
import { Link, useNavigate } from 'react-router-dom'




const Hero = () => {
  const [location, setLocation] = useState('')
  const navigate = useNavigate()


  //function to handle search
  const handleSearch = (e) => {
    e.preventDefault()

    if (!location) return

    // navigate to listing page with location as query parameter
    navigate(`/listing?location=${location}`)
  }
  


  return (
    <section className="h-screen w-screen bg-[url('/src/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="max-padd-container h-screen w-screen">
        {/*Overlay*/}
        <div className="absolute inset-0 bg-black/20 z-0" />
        {/* Container */}
        <div className='relative flex justify-end mx-auto flex-col gap-4 h-full py-6 sm:pt-18 z-10'>
          {/*Content*/}
          <div className='flex flex-col mt-12 text-white '>
            <Link to="/listing" className='max-w-90 flex items-center border border-white medium-13 rounded-full px-4 pr-0.5 py-1 cursor-pointer gap-2 hover:gap-3 hover:bg-black/10 transition-all'>
              <span>Explore how we simplify your rental experience.</span>
              <img src={assets.right} alt="rightIcon" width={20} className='size-6 p-1 rounded-full bg-white'/>
            </Link>
            <h2 className='h2 capitalize leading-tight mt-3 my-2  text-white'>Your <span className='bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent'>perfect home</span> awaits in a place you’ll love.</h2>
          </div>


          {/* SEARCH FORM */}
          <form onSubmit={handleSearch} className='flex items-center justify-center bg-white text-gray-500 rounded-lg px-6 py-4 flex-row lg:flex-row gap-4 lg:gap-x-8 max-w-full ring-1 ring-slate-900/5 relative'>
            {/* location logo */}
            <div className='flex items-center justify-evenly'>
              <img src={assets.pin} alt="pinIcon" width={38} />
            </div>
            {/* input */}
            <input 
              list="destinations"   // connects input to datalist for autocomplete 
              id="destinationInput"
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='rounded border border-gray-300 px-3 py-2.5 text-sm outline-gray-500 w-full'
              placeholder='Enter your preferred location.'
              required
            />
            <datalist id='destinations'>
              {cities.map((city, index) => (
                <option value={city} key={index}/>
              ))}
            </datalist>

            {/* button */}
            <button type='submit' className='flex items-center justify-center gap-1 rounded-md bg-black p-2 md:py-3 md:px-6 lg:py-3 lg:px-6 text-white my-auto cursor-pointer'>
              <img src={assets.search} alt="searchIcon" width={20} className='invert w-8'/>
              <span className='hidden md:block lg:block'>Search</span>
            </button>
          </form>


        </div>
      </div>
    </section>
  )
}

export default Hero


