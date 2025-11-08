import { useState } from 'react'
import About from './components/About'
import Contact from './components/Contact'
import Home from './components/Home'
import Services from './components/Services'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'



function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
        <Navbar /> {/* The Navbar will appear on all pages */}
        <Routes>
      <Route path='/' element={<Home />} />
       <Route path='/about' element={<About/>} />
        <Route path='/services' element={<Services />} />
         <Route path='/contact' element={<Contact/>} />
    </Routes>
    
    </Router>
  )
}

export default App
