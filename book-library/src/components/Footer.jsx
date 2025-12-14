import { FacebookIcon, Instagram, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer>
        <img src="./logo.png" alt="Book Library" width= "40" />
        <div>
        Let's connect
         <Twitter />
         <FacebookIcon />
         <Instagram />
        </div>
 <div>
    Book Library   {new Date().getFullYear()}
 </div>
    </footer>
  )
}

export default Footer
