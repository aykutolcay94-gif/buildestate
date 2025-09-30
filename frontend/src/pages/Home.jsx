import React from 'react'
import Hero from '../components/Hero'
import Companies from '../components/Companies'
import Features from '../components/Features'
import Properties from '../components/propertiesshow'
import Steps from '../components/Steps'
import Testimonials from '../components/testimonial'
import Blog from '../components/Blog'
import PropertiesMap from '../components/PropertiesMap';

const Home = () => {
  return (
    <div>
      <Hero />
      
      {/* Properties Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <PropertiesMap />
        </div>
      </section>
      
      <Companies />
      <Features />
      <Properties />
      <Steps />
      <Testimonials />
      <Blog />
    </div>
  )
}

export default Home
