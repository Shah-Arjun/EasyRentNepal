import React, { useState } from 'react'
import { useAppContext } from '../context/Appcontext'
import { assets, cities } from '../assets/data'

const AgencyReg = () => {
    const {setShowAgencyReg} = useAppContext()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [contact, setContact] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")

  return (
    <div onClick={()=>setShowAgencyReg(false)} className='fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/80'>
        <form onClick={(e)=>e.stopPropagation()}className="flexCenter bg-white rounded-xl max-w-4xl max-md:mx-2 relative">
            <img src={assets.createPrp} alt="createPrp img" className='w-1/2 rounded-l-xl hidden md:block' />
            <div className='flex flex-col md:w-1/2 p-8 md:p-10'>
                <img onClick={()=>setShowAgencyReg(false)} src={assets.close} alt="" className='absolute top-4 right-4 h-6 w-6 p-1 cursor-pointer bg-secondary/50 rounded-full shadow-md'/>
                <h3 className='h3 mb-6'>Register Owner</h3>
                <div className='flex gap-2 xl:gap-3'>
                    <div>
                        <label htmlFor="name" className='medium-14'>Owner Name</label>
                        <input onChange={(e)=>setName(e.target.value)} value={name} id="name" type="text" placeholder='Type here...'
                        className='regular-14 border bg-secondary/10 
                        border-slate-900/10 rounded-lg w-full
                         px-3 py-1.5 mt-1 outline-none' required/>
                    </div>
                    <div>
                        <label htmlFor="contact" className='medium-14'>Contact</label>
                        <input onChange={(e)=>setContact(e.target.value)} value={contact} id="contact" type="text" placeholder='Type here...'
                        className='regular-14 border bg-secondary/10 
                        border-slate-900/10 rounded-lg w-full
                         px-3 py-1.5 mt-1 outline-none' required/>
                    </div>
                </div>
                <div className='w-full mt-4'>
                        <label htmlFor="email" className='medium-14'>Email</label>
                        <input onChange={(e)=>setEmail(e.target.value)} value={email} id="email" type="email" placeholder='Type here...'
                        className='regular-14 border bg-secondary/10 
                        border-slate-900/10 rounded-lg w-full
                         px-3 py-1.5 mt-1 outline-none' required/>
                    </div>
                    <div className='w-full mt-4'>
                        <label htmlFor="address" className='medium-14'>Address</label>
                        <input onChange={(e)=>setAddress(e.target.value)} value={address} id="address" type="address" placeholder='Type here...'
                        className='regular-14 border bg-secondary/10 
                        border-slate-900/10 rounded-lg w-full
                         px-3 py-1.5 mt-1 outline-none' required/>
                    </div>
                    <div className='w-full mt-4 max-w-60 mr-auto'>
                        <label htmlFor="city" className='medium-14'>City</label>
                        <select onChange={(e)=>setCity(e.target.value)} value={city} id="city" className='regular-14 border bg-secondary/10 
                        border-slate-900/10 rounded-lg w-full px-3 py-2.5 mt-1 outline-none' required>
                        <option value="">Select City</option>
                        {cities.map((city)=>(
                            <option key={city} value={city}>{city}</option>
                        ))}
                        </select>
                    </div>
                    <button className='btn-dark py-2 rounded-lg w-32 mt-6'>Register</button>
            </div>
        </form>
      
    </div>
  )
}

export default AgencyReg
