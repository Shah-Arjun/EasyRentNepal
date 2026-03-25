import React from 'react'
import { Route,Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Listing from './pages/Listing'
import Blog from './pages/Blog'
import BlogDetails from './pages/BlogDetails'
import Contact from './pages/Contact'
import PropertyDetails from './pages/PropertyDetails'
import MyBookings from './pages/MyBookings'
import AgencyReg from './components/AgencyReg'
import { useAppContext } from './context/AppContext'
import Sidebar from './components/owner/Sidebar'
import Dashboard from './pages/owner/Dashboard'
import AddProperty from './pages/owner/AddProperty'
import ListProperty from './pages/owner/ListProperty'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  const location = useLocation();    //gives current url
  const isOwnerPath = location.pathname.includes("owner");
  const { showAgencyReg } = useAppContext();


  return (
    <main>
      <ToastContainer position="bottom-right" />
      {!isOwnerPath && <Header />}
      {showAgencyReg && <AgencyReg />}
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/listing" element={<Listing />} />  
        <Route path="/listing/:id" element={<PropertyDetails />} />  
        <Route path="/blog" element={<Blog />} />  
        <Route path="/blog/:id" element={<BlogDetails />} />  
        <Route path="/contact" element={<Contact />} />  
        <Route path="/my-bookings" element={<MyBookings />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/owner' element={<Sidebar />}>
          <Route index element={<Dashboard />}/>
          <Route path='add-property' element={<AddProperty />}/>
          <Route path='list-property' element={<ListProperty />}/>
          <Route path='map' element={<Map />} />
        </Route>
        
      </Routes>
      {!isOwnerPath && <Footer/>}
    </main>
  );
};

export default App;
