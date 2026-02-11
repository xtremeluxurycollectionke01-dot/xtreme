/*'use client'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from "next/image"
import { useState, useEffect, useCallback } from 'react'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Desktop slides
  const desktopSlides = [
    {
      id: 1,
      image: "/images/image1.jpeg",
      alt: "Designer Sneakers - Limited Edition",
      title: "Limited Edition Drops",
      subtitle: "Exclusive Collaborations"
    },
    {
      id: 2,
      image: "/images/image9.jpeg",
      alt: "Premium Designer Footwear",
      title: "Premium Craftsmanship",
      subtitle: "Handcrafted Excellence"
    },
    {
      id: 3,
      image: "/images/image8.jpeg",
      alt: "Luxury Street Style",
      title: "Street Style Redefined",
      subtitle: "Urban Luxury"
    }
  ]

  // Mobile slides
  const mobileSlides = [
    {
      id: 1,
      image: "/images/image18.jpeg",
      alt: "Designer Sneakers - Limited Edition",
      title: "Limited Edition Drops",
      subtitle: "Exclusive Collaborations"
    },
    {
      id: 2,
      image: "/images/image17.jpeg",
      alt: "Premium Designer Footwear",
      title: "Premium Craftsmanship",
      subtitle: "Handcrafted Excellence"
    },
    {
      id: 3,
      image: "/images/image19.jpeg",
      alt: "Luxury Street Style",
      title: "Street Style Redefined",
      subtitle: "Urban Luxury"
    }
  ]

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % desktopSlides.length)
  }, [desktopSlides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + desktopSlides.length) % desktopSlides.length)
  }

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="relative h-screen lg:min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* Background Patterns for Desktop *
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black hidden lg:block"></div>
      <div className="absolute inset-0 opacity-10 hidden lg:block">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-yellow-500/30 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-yellow-500/20 rounded-full"></div>
      </div>

      <div className="absolute inset-0 lg:relative lg:container lg:mx-auto lg:px-4 lg:z-10">
        <div className="relative w-full h-full lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

          {/* Hero Carousel *
          <div className="absolute inset-0 lg:relative lg:col-span-1">
            <div className="relative w-full h-full lg:aspect-square lg:max-w-2xl lg:mx-auto">

              {/* Main Carousel Container *
              <div className="absolute inset-0 lg:bg-gradient-to-br lg:from-yellow-500/20 lg:to-transparent lg:rounded-3xl lg:border lg:border-gray-800 lg:p-8 ">
                <div className="relative w-full h-full lg:bg-gradient-to-br lg:from-gray-900 lg:to-black lg:rounded-2xl overflow-hidden">

                  {/* Desktop Slides *
                  <div className="hidden lg:block relative w-full h-full">
                    {desktopSlides.map((slide, index) => (
                      <motion.div
                        key={slide.id}
                        className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{
                          opacity: index === currentSlide ? 1 : 0,
                          scale: index === currentSlide ? 1 : 1.1,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <Image src={slide.image} alt={slide.alt} fill className="object-cover" priority={index === 0} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile Slides *
                  <div className="lg:hidden relative w-full h-full">
                    {mobileSlides.map((slide, index) => (
                      <motion.div
                        key={slide.id}
                        className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{
                          opacity: index === currentSlide ? 1 : 0,
                          scale: index === currentSlide ? 1 : 1.1,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <Image src={slide.image} alt={slide.alt} fill className="object-cover" priority={index === 0} />
                        {/* Overlay for Mobile *
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                          <div className="absolute bottom-20 left-6 right-6 text-white">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{
                                opacity: index === currentSlide ? 1 : 0,
                                y: index === currentSlide ? 0 : 20
                              }}
                              transition={{ delay: 0.2 }}
                            >
                              <span className="inline-block px-3 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-semibold mb-3">
                                {slide.subtitle}
                              </span>
                              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{slide.title}</h2>
                              <p className="text-gray-200 text-sm drop-shadow-md">Discover the collection</p>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Navigation Buttons *
                  <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all lg:p-2">
                    <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
                  </button>
                  <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all lg:p-2">
                    <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
                  </button>

                  {/* Mobile Slide Indicators *
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 lg:hidden">
                    {mobileSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-yellow-500' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                </div>
              </div>

              {/* Floating Elements - Desktop Only *
<div className="absolute -top-6 -right-6 w-32 h-32 bg-black border border-yellow-500/30 rounded-2xl p-4 z-10 hidden lg:block">
  <div className="relative w-full h-full">
    <Image
      src="/images/image3.jpg"
      alt="Limited Edition"
      fill
      className="object-cover rounded-lg"
    />
  </div>
</div>

<div className="absolute -bottom-6 -left-6 w-40 h-40 bg-black border border-yellow-500/30 rounded-2xl p-4 z-10 hidden lg:block">
  <div className="relative w-full h-full">
    <Image
      src="/images/image2.jpg"
      alt="Premium Materials"
      fill
      className="object-cover rounded-lg"
    />
  </div>
</div>


            </div>
          </div>

          {/* Desktop Left Content *
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block lg:col-span-1"
          >
            <span className="inline-block px-4 py-2 gradient-yellow rounded-full text-black text-sm font-semibold mb-6">
              2026 COLLECTION
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              ELEVATE YOUR <span className="text-yellow-500">STYLE</span> GAME
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl">
              Discover exclusive designer footwear and apparel crafted for the modern elite. Where luxury meets street style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 gradient-yellow text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group">
                SHOP COLLECTION
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-yellow-500 text-yellow-500 font-bold rounded-lg hover:bg-yellow-500 hover:text-black transition-all">
                EXPLORE DESIGNERS
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection*/ 

'use client'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from "next/image"
import { useState, useEffect, useCallback } from 'react'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Desktop slides
  const desktopSlides = [
    { id: 1, image: "/images/image1.jpeg", alt: "Designer Sneakers - Limited Edition", title: "Limited Edition Drops", subtitle: "Exclusive Collaborations" },
    { id: 2, image: "/images/image9.jpeg", alt: "Premium Designer Footwear", title: "Premium Craftsmanship", subtitle: "Handcrafted Excellence" },
    { id: 3, image: "/images/image8.jpeg", alt: "Luxury Street Style", title: "Street Style Redefined", subtitle: "Urban Luxury" }
  ]

  // Mobile slides
  const mobileSlides = [
    { id: 1, image: "/images/image18.jpeg", alt: "Designer Sneakers - Limited Edition", title: "Limited Edition Drops", subtitle: "Exclusive Collaborations" },
    { id: 2, image: "/images/image17.jpeg", alt: "Premium Designer Footwear", title: "Premium Craftsmanship", subtitle: "Handcrafted Excellence" },
    { id: 3, image: "/images/image19.jpeg", alt: "Luxury Street Style", title: "Street Style Redefined", subtitle: "Urban Luxury" }
  ]

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % desktopSlides.length)
  }, [desktopSlides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + desktopSlides.length) % desktopSlides.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="relative [height:100dvh] w-full flex items-center justify-center overflow-hidden bg-black">

      {/* Desktop Background Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black hidden lg:block"></div>
      <div className="absolute inset-0 opacity-10 hidden lg:block">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-yellow-500/30 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-yellow-500/20 rounded-full"></div>
      </div>

      <div className="absolute inset-0 lg:relative lg:container lg:mx-auto lg:px-4 lg:z-10">
        <div className="relative w-full h-full lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

          {/* Carousel */}
          <div className="absolute inset-0 lg:relative lg:col-span-1">
            <div className="relative w-full h-full lg:aspect-square lg:max-w-2xl lg:mx-auto">

              {/* Main Carousel */}
              <div className="absolute inset-0 lg:bg-gradient-to-br lg:from-yellow-500/20 lg:to-transparent lg:rounded-3xl lg:border lg:border-gray-800 lg:p-8">
                <div className="relative w-full h-full lg:bg-gradient-to-br lg:from-gray-900 lg:to-black lg:rounded-2xl overflow-hidden">

                  {/* Desktop Slides */}
                  <div className="hidden lg:block relative w-full h-full">
                    {desktopSlides.map((slide, index) => (
                      <motion.div
                        key={slide.id}
                        className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{
                          opacity: index === currentSlide ? 1 : 0,
                          scale: index === currentSlide ? 1 : 1.1,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <Image src={slide.image} alt={slide.alt} fill className="object-cover" priority={index === 0} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile Slides */}
                  <div className="lg:hidden relative w-full h-full">
                    {mobileSlides.map((slide, index) => (
                      <motion.div
                        key={slide.id}
                        className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{
                          opacity: index === currentSlide ? 1 : 0,
                          scale: index === currentSlide ? 1 : 1.1,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <Image src={slide.image} alt={slide.alt} fill className="object-cover" priority={index === 0} />
                        
                        {/* Overlay for Mobile */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end">
                          <div className="px-6 pb-20 text-white">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{
                                opacity: index === currentSlide ? 1 : 0,
                                y: index === currentSlide ? 0 : 20
                              }}
                              transition={{ delay: 0.2 }}
                            >
                              <span className="inline-block px-3 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-semibold mb-2">
                                {slide.subtitle}
                              </span>
                              <h2 className="text-2xl sm:text-3xl font-bold mb-1 drop-shadow-lg">{slide.title}</h2>
                              <p className="text-gray-200 text-sm sm:text-base drop-shadow-md">Discover the collection</p>
                            </motion.div>
                          </div>

                          {/* Dots */}
                          <div className="flex justify-center gap-2 pb-4 w-full">
                            {mobileSlides.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-yellow-500' : 'bg-white/50'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all lg:p-2">
                    <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
                  </button>
                  <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all lg:p-2">
                    <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
                  </button>

                </div>
              </div>

              {/* Floating Desktop Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-black border border-yellow-500/30 rounded-2xl p-4 z-10 hidden lg:block">
                <div className="relative w-full h-full">
                  <Image src="/images/image3.jpg" alt="Limited Edition" fill className="object-cover rounded-lg" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-black border border-yellow-500/30 rounded-2xl p-4 z-10 hidden lg:block">
                <div className="relative w-full h-full">
                  <Image src="/images/image2.jpg" alt="Premium Materials" fill className="object-cover rounded-lg" />
                </div>
              </div>

            </div>
          </div>

          {/* Desktop Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block lg:col-span-1"
          >
            <span className="inline-block px-4 py-2 gradient-yellow rounded-full text-black text-sm font-semibold mb-6">
              2026 COLLECTION
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              ELEVATE YOUR <span className="text-yellow-500">STYLE</span> GAME
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl">
              Discover exclusive designer footwear and apparel crafted for the modern elite. Where luxury meets street style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 gradient-yellow text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group">
                SHOP COLLECTION
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-yellow-500 text-yellow-500 font-bold rounded-lg hover:bg-yellow-500 hover:text-black transition-all">
                EXPLORE DESIGNERS
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
