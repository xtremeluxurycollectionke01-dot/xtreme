import DesignerShowcase from "./components/DesignerShowcase";
import FeaturedCollections from "./components/FeaturedCollections";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/NavBar";
import Newsletter from "./components/Newsletter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <FeaturedCollections />
      <FeaturedProducts />
      <DesignerShowcase />
      <Newsletter />
      <Footer />
    </div>
  )
}