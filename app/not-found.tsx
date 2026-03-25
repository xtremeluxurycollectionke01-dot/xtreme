// app/not-found.tsx
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | ELITE KICKS',
  description: 'The page you\'re looking for doesn\'t exist. Discover exclusive footwear and apparel crafted for the modern elite.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-yellow-950/20" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary-yellow)_1px,_transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* Glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">


          
          <p className="text-lg sm:text-xl text-gray-400 mb-6 max-w-md mx-auto">
            This path doesn't exist in our luxury collection.
          </p>

          <div className="h-px w-24 mx-auto gradient-yellow mb-8" />

          {/* Secondary Message */}
          <p className="text-gray-500 mb-12 text-sm uppercase tracking-wider">
            Error 404 • Page Not Found
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="group relative px-8 py-3 gradient-yellow rounded-full text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
            >
              <span className="relative z-10">BACK TO HOME</span>
              <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </Link>
            
            <Link
              href="/products"
              className="group relative px-8 py-3 border border-yellow-500/50 rounded-full text-white font-semibold transition-all duration-300 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/25 hover:scale-105"
            >
              EXPLORE COLLECTION
              <span className="absolute inset-0 bg-yellow-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Featured Collection Teasers */}
          <div className="mt-20 pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider">
              DISCOVER OUR LATEST DROPS
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              {['LUXURY SNEAKERS', 'ELITE APPAREL', 'LIMITED EDITION'].map((item, index) => (
                <Link
                  key={index}
                  href={`/category/${item.toLowerCase().replace(' ', '-')}`}
                  className="group text-xs sm:text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-300 p-2 rounded-lg hover:bg-yellow-500/10"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Brand */}
          <div className="mt-16">
            <p className="text-xs text-gray-600 tracking-wider">
              ELEVATE YOUR SHOE GAME
            </p>
            <p className="text-xs text-gray-700 mt-1">
              Discover exclusive footwear and apparel crafted for the modern elite.
            </p>
          </div>
        </div>
      </div>

      {/* Animated Shoes Decoration */}
      <div className="fixed bottom-8 right-8 opacity-10 sm:opacity-20 transition-opacity">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L14 8H10L12 4Z" fill="#FFD700" />
          <path d="M6 12L10 14V10L6 12Z" fill="#FFD700" />
          <path d="M18 12L14 14V10L18 12Z" fill="#FFD700" />
          <path d="M12 20L10 16H14L12 20Z" fill="#FFD700" />
        </svg>
      </div>
    </div>
  );
}