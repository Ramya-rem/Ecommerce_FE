import Navbar from "../../components/Navbar"
import HeroSection from "../../components/HeroSection"
import CategorySection from "../../components/CategorySection"
import FeaturedDesserts from "../../components/FeaturedDesserts"
import Marquee from "../../components/Marquee"
import Footer from "../../components/Footer"

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedDesserts />
        <Marquee />
      </main>
      <Footer />
    </div>
  )
}

export default Homepage
