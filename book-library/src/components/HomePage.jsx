import Footer from './Footer';
import NavBar from './NavBar';
const HomePage = () => {
  return (
    <div>
    <NavBar />

    <div className="bg-[url(./home.png)] bg-center bg-cover p-4 my-4 min-h-100 font-bold text-center relative">
         <h1 className='text-shadow-available text-teal-500'>Welcome</h1>
         <p className='font-medium text-3xl text-blue-500 py-5 mt-6'>You are here because you Love Book Reading  yeah correct this is  For you Book Lover Knowledge Hunter, Enjoy Your Reading Get your Dream Wisdom!</p>
 
    </div>

    <Footer />
    </div>
  )
}

export default HomePage
