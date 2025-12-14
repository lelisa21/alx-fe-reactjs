
const NavBar = () => {
  return (
<nav>
 <div className="md:flex justify-between items-center gap-6">
    <img src="/logo.png" alt="Book Library"  width= "40"/>
     <div className="md:flex justify-between items-center gap-6">
 <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Browse</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">My Books</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Calendar</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Help</a>
     </div>  
     <button className="btn-primary text-2xl mr-5">Sign Up</button>
          </div>
</nav>
  )
}

export default NavBar
