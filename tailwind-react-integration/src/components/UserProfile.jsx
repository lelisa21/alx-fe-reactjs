function UserProfile() {
  return (
    <div className="user-profile bg-gray-100 md:p-8 md:max-w-sm max-w-sm mx-auto my-20 rounded-lg shadow-lg hover:shadow-xl sm:p-4 sm:max-w-xs">
      <img src="https://via.placeholder.com/150" alt="User" className="rounded-full sm:w-24 sm:h-24 md:w-36 md:h-36 mx-auto hover:scale-110 transform duration-300 ease-in-out"/>
      <h1 className="md:text-xl text-blue-800 my-4 sm:text-lg hover:text-blue-500">John Doe</h1>
      <p className="text-gray-600 text-base sm:text-sm md:text-base">Developer at Example Co. Loves to write code and explore new technologies.</p>
    </div>
  );
}

export default UserProfile;
