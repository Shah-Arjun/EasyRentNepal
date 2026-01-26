import React, { createContext , useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyProperties } from '../assets/data'

const Appcontext = createContext()

export const AppContextProvider = ({children}) => {

    const navigate = useNavigate()
    const [properties, setProperties] = useState([])

    const getProperties = ()=>{
        setProperties(dummyProperties)
    }

    useEffect(()=>{
        getProperties()
    },[])

    const value = {
        navigate, properties
    }

  return (
    <Appcontext.Provider value={value}>
        {children}
    </Appcontext.Provider>
  )
}

export const useAppContext = ()=> useContext(Appcontext)