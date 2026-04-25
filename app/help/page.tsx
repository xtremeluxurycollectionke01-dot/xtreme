"use client";

import { ArrowLeft, Ruler, HelpCircle, Phone, Mail, MessageCircle, Shirt, User as UserIcon, Activity } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState("men");

  const menSizeChart = [
    { eu: 39, uk: 5.5, us: 6.5, cm: 24.5 },
    { eu: 40, uk: 6.5, us: 7.5, cm: 25.0 },
    { eu: 41, uk: 7, us: 8, cm: 26.0 },
    { eu: 42, uk: 8, us: 9, cm: 26.5 },
    { eu: 43, uk: 9, us: 10, cm: 27.5 },
    { eu: 44, uk: 9.5, us: 10.5, cm: 28.0 },
    { eu: 45, uk: 10.5, us: 11.5, cm: 29.0 },
    { eu: 46, uk: 11, us: 12, cm: 30.0 },
  ];

  const womenSizeChart = [
    { eu: 36, uk: 3, us: 5, cm: 22.0 },
    { eu: 37, uk: 4, us: 6, cm: 23.0 },
    { eu: 38, uk: 5, us: 7, cm: 24.0 },
    { eu: 39, uk: 6, us: 8, cm: 25.0 },
    { eu: 40, uk: 6.5, us: 8.5, cm: 25.5 },
    { eu: 41, uk: 7, us: 9, cm: 26.0 },
    { eu: 42, uk: 8, us: 10, cm: 27.0 },
  ];

  const measuringTips = [
    {
      icon: Ruler,
      title: "How to Measure Your Foot",
      steps: [
        "Place a piece of paper on the floor against a wall",
        "Stand on the paper with your heel touching the wall",
        "Mark the longest toe on the paper",
        "Measure the distance from the wall to the mark",
        "Use the longest foot measurement for your size",
      ],
    },
    {
      icon: Activity,
      title: "Pro Tips",
      steps: [
        "Measure your feet at the end of the day when they're largest",
        "Wear the socks you plan to wear with the shoes",
        "Measure both feet and use the larger measurement",
        "If between sizes, size up for comfort",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,215,0,0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
              <HelpCircle className="relative h-16 w-16 text-yellow-500 mx-auto" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 tracking-tighter">
            SIZE{" "}
            <span className="text-yellow-500 relative inline-block">
              GUIDE
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent"></div>
            </span>
          </h1>
          
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mt-4">
            To help you find the perfect fit, refer to the size charts below. 
            If you are unsure, feel free to contact us before placing your order.
          </p>
        </div>

        {/* Gender Tabs */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab("men")}
              className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "men"
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25"
                  : "bg-gray-900 text-gray-400 hover:text-yellow-500 border border-gray-800"
              }`}
            >
              <UserIcon className="h-5 w-5" />
              Men's Sizes
            </button>
            <button
              onClick={() => setActiveTab("women")}
              className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "women"
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25"
                  : "bg-gray-900 text-gray-400 hover:text-yellow-500 border border-gray-800"
              }`}
            >
              <UserIcon className="h-5 w-5" />
              Women's Sizes
            </button>
          </div>
        </div>

        {/* Size Chart */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-yellow-500/10 border-b border-gray-800">
                    <th className="px-4 sm:px-6 py-4 text-left text-sm sm:text-base font-bold text-yellow-500">EU</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm sm:text-base font-bold text-yellow-500">UK</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm sm:text-base font-bold text-yellow-500">US</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm sm:text-base font-bold text-yellow-500">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === "men" ? menSizeChart : womenSizeChart).map((size, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-800 hover:bg-yellow-500/5 transition-colors ${
                        index % 2 === 0 ? 'bg-transparent' : 'bg-white/5'
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-white font-medium">{size.eu}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-300">{size.uk}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-300">{size.us}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-300">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Note Box */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Ruler className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-500 mb-1">Note on Sizing</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Sizing may vary slightly depending on the brand and model. If unsure about your size, 
                  we recommend reaching out to us before placing your order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Measuring Tips */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              HOW TO <span className="text-yellow-500">MEASURE</span>
            </h2>
            <p className="text-gray-400">Get the perfect fit with these simple steps</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {measuringTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/5 overflow-hidden"
                >
                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                        <Icon className="h-6 w-6 text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{tip.title}</h3>
                    </div>
                    
                    <ul className="space-y-3">
                      {tip.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3 text-gray-300">
                          <span className="text-yellow-500 font-bold text-sm min-w-[24px]">{stepIndex + 1}.</span>
                          <span className="text-sm sm:text-base">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                NEED HELP FINDING YOUR SIZE?
              </h2>
              <p className="text-gray-400">
                Our experts are here to help you find the perfect fit
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <a
                href="tel:+254799600560"
                className="flex items-center gap-3 px-6 py-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all group"
              >
                <Phone className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-500">Call Us</p>
                  <p className="text-white font-medium">+254 799 600 560</p>
                </div>
              </a>

              {/*<a
                href="mailto:support@xtremecollection.com"
                className="flex items-center gap-3 px-6 py-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all group"
              >
                <Mail className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-500">Email Us</p>
                  <p className="text-white font-medium">support@xtremecollection.com</p>
                </div>
              </a>*/}

              <a
                href="https://wa.me/254799600560"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all group"
              >
                <MessageCircle className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                  <p className="text-white font-medium">Chat with us</p>
                </div>
              </a>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                <HelpCircle className="h-4 w-4 text-yellow-500" />
                <span>We typically respond within minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10" />
        <div className="fixed top-1/2 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  );
};

export default HelpPage;