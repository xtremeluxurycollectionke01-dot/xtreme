import DesignerShowcase from "./components/DesignerShowcase";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/NavBar";
import Newsletter from "./components/Newsletter";

/*export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <DesignerShowcase />
      <Newsletter />
      <Footer />
    </div>
  )
}*/

export default function Home() {
  return (
    <div className="bg-black">
      <Navbar />
      
      {/* HeroSection now handles its own height */}
      <HeroSection />

      {/* Rest of the page */}
      <div className="relative z-10">
        <FeaturedProducts />
        <DesignerShowcase />
        <Newsletter />
        <Footer />
      </div>
    </div>
  )
}
