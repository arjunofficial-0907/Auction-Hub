import React from 'react'
import Navbar from './components/Navbar'
import { Route, Router, Routes } from 'react-router-dom'
import Index from './pages/Index'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Listings from './pages/Listing'
import ListingDetail from './pages/ListingDetails'
import Sell from './pages/Sell'
import UserProfile from './pages/Userprofile'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar/>
      <main className='flex-1'>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
      </main>
      
    </div>
  )
}

export default App