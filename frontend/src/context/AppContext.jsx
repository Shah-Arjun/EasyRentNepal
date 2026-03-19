import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { dummyProperties } from '../assets/data'
import { useUser } from "@clerk/clerk-react";
=======
import { useUser } from "@clerk/clerk-react";
import useAxios from '../hooks/useAxios'
>>>>>>> 443063d (Made updates to frontend code)

const Appcontext = createContext()

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();
    const { user } = useUser();
    const [properties, setProperties] = useState([]);
    const [showAgencyReg, setShowAgencyReg] = useState(false)
    const [isOwner, setIsOwner] = useState(true)
<<<<<<< HEAD
    


    const getProperties = () => {
        setProperties(dummyProperties)
=======
    const api = useAxios();
    

    const getProperties = async () => {
        try {
            const { data } = await api.get('/property');
            if (data.success) {
                setProperties(data.properties);
            }
        } catch (error) {
            console.error(error);
            // Fallback to empty array if backend is down
            setProperties([]);
        }
>>>>>>> 443063d (Made updates to frontend code)
    }

    useEffect(() => {
        getProperties()
    }, [])

    const value = {
        navigate,
        properties,
        currency,
        user,
        showAgencyReg,
<<<<<<< HEAD
        setShowAgencyReg
=======
        setShowAgencyReg,
        isOwner,
        setIsOwner
>>>>>>> 443063d (Made updates to frontend code)
    };

    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}

export const useAppContext = () => useContext(Appcontext)