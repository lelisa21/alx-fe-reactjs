import { useState } from 'react'
import ProfilePage from './components/ProfilePage'
import UserDetails from './components/UserDetails'
import UserInfo from './components/UserInfo'
import UserContext from './components/UserContext'

function App() {
  const userData = { name: "Jane Doe", email: "jane.doe@example.com" };

  return (
    <div>
      <UserContext.Provider value={{userData}}>
        <ProfilePage/>
      </UserContext.Provider>
    </div>
    );
}

export default App;