import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/Appcontext'
import { useParams } from 'react-router-dom'
import PropertyImages from '../components/PropertyImages'
import { assets } from '../assets/data'

const PropertyDetails = () => {
    const { properties } = useAppContext()
    const [property, setProperty] = useState(null)
    const {id} = useParams()

    useEffect(() => {
        const property = properties.find((property) => property._id === id)
        property && setProperty(property)
    }, [properties])
    return (
        property && (
            <div className='bg-gradient-to-r from-[#fffbee] to-white py-28'>
                <div className='max-padd-container'>
                    {/* Image */}
                    <PropertyImages property = {property}/>
                     {/* Container*/}
                     <div>
                        {/* Left Side */}
                        <div>
                            <p>
                                <img src={assets.pin} alt="" width={19}/>
                                <span>{property.address}</span>
                            </p>
                        </div>
                     </div>
                </div>
            </div>

        )
    )
}

export default PropertyDetails