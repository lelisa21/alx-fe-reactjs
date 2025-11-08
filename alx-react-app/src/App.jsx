import { useState } from 'react'
import WelcomeMessage from './components/WelcomeMessage.jsx'
import Header from './Header'
import MainContent from './MainContent'
import Footer from './Footer'
import UserProfile from './components/UserProfile.jsx'
import './App.css'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <MainContent />
      <WelcomeMessage />
      <UserProfile  name="Alice" age="25" bio="Loves hiking and photography" />
      <Footer />
    </>
  )
}

export default App
