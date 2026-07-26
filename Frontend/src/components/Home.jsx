import React from 'react'
import HeroSection from './HeroSection'
import Navbar from './shared/Navbar'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './Footer'


const Home = () => {
  return (
  <div>
  <Navbar></Navbar>,
  <HeroSection></HeroSection>,
  <CategoryCarousel></CategoryCarousel>,
  <LatestJobs></LatestJobs>,
  <Footer></Footer>
  </div>
  )
}

export default Home