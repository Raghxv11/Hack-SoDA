import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {
  const [isAboutHovered, setIsAboutHovered] = useState(false)

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const featuresSection = document.querySelector('#features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 w-[80%] sm:w-[70%] max-w-3xl">
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center shadow-lg border border-black/10">
        <Link href="/" className="text-lg sm:text-xl font-bold text-[#22c55e] hover:text-[#16a34a] transition-colors">
          Gradify
        </Link>
        <div className="flex items-center space-x-4">
          <a 
            href="#features" 
            onClick={handleAboutClick}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
              isAboutHovered ? 'bg-[#22c55e] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            onMouseEnter={() => setIsAboutHovered(true)}
            onMouseLeave={() => setIsAboutHovered(false)}
          >
            About
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
