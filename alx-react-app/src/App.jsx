
import React from 'react'
import WelcomeMessage from './components/WelcomeMessage'
import Header from './components/Header'
import MainContent from './components/MainContent'
import Footer from './components/Footer'
import UserProfile from './components/UserProfile'

const App = () => {
  return (
    <div>
        <Header />
        <MainContent />
        <Footer />

        <WelcomeMessage />

        <UserProfile name = "Laloo" age = {20} bio = "He is an Amazing Software Engineer" />
        <UserProfile name = "Abel" age = {22} bio = "He is an Amazing Full Stack Developer!" />
        <UserProfile name = "mikiyas" age = {24} bio = "He is an Amazing Frontend Developer!" />
     </div>
  )
}

export default App
