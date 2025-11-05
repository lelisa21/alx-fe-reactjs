import ProfilePage from './ProfilePage';
import { UserContext } from './UserContext';

function App() {
     const userData =   { name: "John Doe", email: "john.doe@example.com"}
   
  return (
    <UserContext.Provider value={userData}>
      <ProfilePage />
    </UserContext.Provider>
  );
}
export default App;
