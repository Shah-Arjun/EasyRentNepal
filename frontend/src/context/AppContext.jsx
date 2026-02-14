import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyProperties } from '../assets/data'
import { useUser } from "@clerk/clerk-react";

const Appcontext = createContext()

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();
    const { user } = useUser();
    const [properties, setProperties] = useState([]);
    const [showAgencyReg, setShowAgencyReg] = useState(false)
    


    const getProperties = () => {
        setProperties(dummyProperties)
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
        setShowAgencyReg
    };

    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}

export const useAppContext = () => useContext(Appcontext)