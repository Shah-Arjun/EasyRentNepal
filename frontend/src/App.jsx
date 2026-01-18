import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Listing from './pages/Listing'
import Blog from './pages/Blog'
import Contact from './pages/Contact'


const App = () => {
  return (
    <main>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/listing" element={<Listing />} />  
        <Route path="/blog" element={<Blog />} />  
        <Route path="/contact" element={<Contact />} />  

      </Routes>
      <Footer/>

    </main>
  )
}

export default App
