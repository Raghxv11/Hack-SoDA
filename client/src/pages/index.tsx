import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Charts from '@/components/charts'

const metricsData = [
  { criteria: 'Grammar', scored: '92', total: '100' },
  { criteria: 'Content', scored: '88', total: '100' },
  { criteria: 'Structure', scored: '95', total: '100' },
];

export default function Component() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      title: "Bulk Uploads",
      description: "Grade multiple assignments simultaneously, saving precious time",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    },
    {
      title: "Plagiarism Detection",
      description: "Automatic plagiarism checking to ensure academic integrity",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Smart Visualizations",
      description: "Detailed analytics and visual insights for better assessment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Custom Rubrics",
      description: "Create and apply personalized grading criteria",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: "Handwritten Support",
      description: "Process both digital and handwritten assignments",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-gray-100 bg-[length:40px_40px] [background-image:linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]" />

      {/* Content Container */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section - Increased top padding */}
        <main className="container mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-12 sm:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24"> {/* Increased bottom margin */}
              <h1 className="mb-12 text-6xl sm:text-7xl md:text-9xl font-extrabold inline-block" style={{
                color: '#22c55e',
                textShadow: `
                  4px 4px 0 #000,
                  -3px -3px 0 #000,  
                  3px -3px 0 #000,
                  -3px 3px 0 #000,
                  3px 3px 0 #000,
                  6px 6px 0 #000,
                  8px 8px 0 #000
                `,
                transform: `translateZ(${scrollY * 0.1}px) rotateX(${scrollY * 0.05}deg)`
              }}>
                GRADIFY
              </h1>
              <div className="space-y-8 mb-16"> {/* Increased spacing */}
                <p className="text-2xl sm:text-3xl md:text-4xl text-gray-800 font-semibold">
                  Grade assignments faster and smarter with AI
                </p>
                <p className="text-lg sm:text-xl text-gray-600">
                  Explore our time saving AI-powered grader for teachers at Gradify
                </p>
              </div>
              <Link href="/assignment">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xl relative overflow-hidden transition-all duration-300 ease-in-out active:translate-y-[1px] border-2 border-black"
                  style={{
                    boxShadow: '5px 5px 0 #000',
                  }}
                >
                  Start Grading
                </Button>
              </Link>
            </div>

            {/* Chart Section */}
            <div className="mb-24 p-8 border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] bg-white/80 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-8 text-center">Smart Analytics Dashboard</h2>
              <Charts criteria={metricsData} />
            </div>

            {/* Features Grid - Reorganized */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto" id="features">
              {/* First Row - 2 Cards */}
              <div 
                className="p-6 border-2 border-black rounded-lg shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-[#22c55e] rounded-lg flex items-center justify-center mb-4 border-2 border-black">
                  <div className="text-white">
                    {features[0].icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{features[0].title}</h3>
                <p className="text-gray-600">{features[0].description}</p>
              </div>

              <div 
                className="p-6 border-2 border-black rounded-lg shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-[#22c55e] rounded-lg flex items-center justify-center mb-4 border-2 border-black">
                  <div className="text-white">
                    {features[1].icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{features[1].title}</h3>
                <p className="text-gray-600">{features[1].description}</p>
              </div>

              {/* Second Row - Center Card */}
              <div className="md:col-span-2 max-w-xl mx-auto">
                <div 
                  className="p-6 border-2 border-black rounded-lg shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all duration-200 bg-white/80 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-[#22c55e] rounded-lg flex items-center justify-center mb-4 border-2 border-black">
                    <div className="text-white">
                      {features[2].icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{features[2].title}</h3>
                  <p className="text-gray-600">{features[2].description}</p>
                </div>
              </div>

              {/* Third Row - 2 Cards */}
              <div 
                className="p-6 border-2 border-black rounded-lg shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-[#22c55e] rounded-lg flex items-center justify-center mb-4 border-2 border-black">
                  <div className="text-white">
                    {features[3].icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{features[3].title}</h3>
                <p className="text-gray-600">{features[3].description}</p>
              </div>

              <div 
                className="p-6 border-2 border-black rounded-lg shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-[#22c55e] rounded-lg flex items-center justify-center mb-4 border-2 border-black">
                  <div className="text-white">
                    {features[4].icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{features[4].title}</h3>
                <p className="text-gray-600">{features[4].description}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
