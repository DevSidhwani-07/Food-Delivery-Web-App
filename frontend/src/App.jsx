import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Cart from './pages/Cart/Cart'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import VerifyPage from './pages/VerifyPage/VerifyPage'
import MyOrders from './pages/MyOrders/MyOrders'




const App = () => {
   // State to show or hide login popup
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
     {/* Show Login Popup if showLogin is true */}
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />

        {/* Define application routes */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/cart/verify/' element={<VerifyPage />} />
          <Route path='/myorders/' element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
    </>

  )
}

export default App
