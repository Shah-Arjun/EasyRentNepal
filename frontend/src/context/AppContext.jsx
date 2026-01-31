import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyProperties } from '../assets/data'
import { useUser } from "@clerk/clerk-react";

const Appcontext = createContext()

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const { user } = useUser();

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
        user
    }

    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}

export const useAppContext = () => useContext(Appcontext)