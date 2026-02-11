/*'use client'

import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from "next/image"


const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern *
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-yellow-500/30 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-yellow-500/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content *
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 gradient-yellow rounded-full text-black text-sm font-semibold mb-6">
              SPRING/SUMMER 2024 COLLECTION
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              ELEVATE YOUR{' '}
              <span className="text-yellow-500">STYLE</span> GAME
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl">
              Discover exclusive designer footwear and apparel crafted for the 
              modern elite. Where luxury meets street style.
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

          {/* Right Image *
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-2xl mx-auto">

              {/* Main Hero Image *
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-3xl border border-gray-800 p-8">
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                  <Image
                    src="/images/image1.jpeg"
                    alt="Designer Sneakers"
                    fill
                    className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
              </div>

              {/* Floating Top Right *
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-black border border-yellow-500/30 rounded-2xl p-4">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/image3.jpg"
                    alt="Limited Edition"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Floating Bottom Left *
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-black border border-yellow-500/30 rounded-2xl p-4">
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
  
  const slides = [
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

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-yellow-500/30 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-yellow-500/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 gradient-yellow rounded-full text-black text-sm font-semibold mb-6">
              2026 COLLECTION
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              ELEVATE YOUR{' '}
              <span className="text-yellow-500">STYLE</span> GAME
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl">
              Discover exclusive designer footwear and apparel crafted for the 
              modern elite. Where luxury meets street style.
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

          {/* Right Image - Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-2xl mx-auto">
              
              {/* Main Carousel Container */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-3xl border border-gray-800 p-8">
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                  
                  {/* Carousel Slides */}
                  <div className="relative w-full h-full">
                    {slides.map((slide, index) => (
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
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        
                        {/* Slide Overlay Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                          <div className="absolute bottom-8 left-8 right-8">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ 
                                opacity: index === currentSlide ? 1 : 0,
                                y: index === currentSlide ? 0 : 20 
                              }}
                              transition={{ delay: 0.3 }}
                              className="text-white"
                            >
                              {/*<h3 className="text-2xl font-bold mb-1">{slide.title}</h3>
                              <p className="text-yellow-300 font-medium">{slide.subtitle}</p>*/}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Carousel Controls */}
                  {/*<div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center space-x-2">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide 
                              ? 'bg-yellow-500 w-6' 
                              : 'bg-gray-600 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>*/}
                  
                  {/* Navigation Buttons */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Floating Top Right */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-black border border-yellow-500/30 rounded-2xl p-4 z-10">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/image3.jpg"
                    alt="Limited Edition"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Floating Bottom Left */}
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-black border border-yellow-500/30 rounded-2xl p-4 z-10">
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection