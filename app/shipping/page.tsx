"use client";

import { ArrowLeft, Truck, MapPin, Clock, Globe, Phone, Mail, CheckCircle, Zap, Shield, Package, Navigation, AlertCircle } from "lucide-react";
import Link from "next/link";

const ShippingPolicy = () => {
  const shippingZones = [
    {
      icon: MapPin,
      title: "Nairobi & Metropolitan Areas",
      delivery: "Same day delivery available for orders placed early in the day",
      price: "KSh 300 - KSh 1,000",
      note: "Depending on location and urgency",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-500",
      timing: "Same Day",
    },
    {
      icon: Navigation,
      title: "Countrywide Delivery (Kenya)",
      delivery: "Delivery within 24-48 hours",
      price: "Flat fee of KSh 300",
      note: "Available nationwide",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500",
      timing: "24-48 Hours",
    },
    {
      icon: Globe,
      title: "East Africa Delivery",
      delivery: "Delivery within 2-5 working days",
      price: "Rates vary depending on destination",
      note: "Uganda, Tanzania, Rwanda, Burundi, South Sudan",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
      timing: "2-5 Days",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Orders processed immediately after confirmation",
    },
    {
      icon: Shield,
      title: "Secure Packaging",
      description: "Premium packaging to protect your sneakers",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your order every step of the way",
    },
    {
      icon: Package,
      title: "Careful Handling",
      description: "Handled with care to ensure perfect condition",
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
              <Truck className="relative h-16 w-16 text-yellow-500 mx-auto" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 tracking-tighter">
            SHIPPING &{" "}
            <span className="text-yellow-500 relative inline-block">
              DELIVERY POLICY
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent"></div>
            </span>
          </h1>
          
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mt-4">
            At Xtreme Collection, we prioritize fast and reliable delivery to ensure you receive 
            your sneakers on time and in perfect condition.
          </p>
        </div>

        {/* Shipping Zones Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {shippingZones.map((zone, index) => {
              const Icon = zone.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/5 overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${zone.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative p-6 sm:p-8">
                    {/* Timing Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-semibold">
                        {zone.timing}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`mb-4 ${zone.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-12 w-12 sm:h-14 sm:w-14" strokeWidth={1.5} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">
                      {zone.title}
                    </h3>
                    
                    {/* Delivery Info */}
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
                      {zone.delivery}
                    </p>
                    
                    {/* Price */}
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-baseline gap-2">
                        <span className="text-yellow-500 text-2xl font-bold">{zone.price}</span>
                        {zone.note && (
                          <span className="text-gray-500 text-xs">{zone.note}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-blue-500/10 border-l-4 border-blue-500 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-500 mb-1">Important Information</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Please ensure you are available to receive your order once dispatched. Delivery timelines may vary slightly due to unforeseen circumstances.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              WHY SHOP WITH{" "}
              <span className="text-yellow-500">XTREME COLLECTION</span>
            </h2>
            <p className="text-gray-400">We go the extra mile to deliver excellence</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group text-center p-6 bg-gradient-to-br from-gray-900/30 to-black/30 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="inline-flex p-3 bg-yellow-500/10 rounded-full mb-4 group-hover:bg-yellow-500/20 transition-colors">
                    <Icon className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Process */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              HOW WE{" "}
              <span className="text-yellow-500">DELIVER</span>
            </h2>
            <p className="text-gray-400">From our store to your doorstep</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 to-transparent hidden sm:block transform -translate-x-1/2" />
            
            <div className="space-y-8">
              {[
                { step: "01", title: "Order Confirmation", description: "You receive confirmation immediately after placing your order", icon: Package },
                { step: "02", title: "Processing", description: "We prepare and package your items with care", icon: Shield },
                { step: "03", title: "Dispatch", description: "Your order is handed over to our trusted delivery partners", icon: Truck },
                { step: "04", title: "Delivery", description: "Track and receive your package at your doorstep", icon: CheckCircle },
              ].map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                return (
                  <div key={index} className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                    {/* Timeline Node */}
                    <div className="absolute left-4 sm:left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 sm:-translate-y-1/2 hidden sm:block">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 sm:w-1/2 ${isEven ? 'sm:pr-12' : 'sm:pl-12'}`}>
                      <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl border border-gray-800 p-6 hover:border-yellow-500/30 transition-all duration-300 group">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                              <Icon className="h-6 w-6 text-yellow-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-yellow-500 text-sm font-mono mb-1">{step.step}</div>
                            <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                            <p className="text-gray-400 text-sm">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Empty spacer for alignment */}
                    <div className="hidden sm:block sm:w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                HAVE QUESTIONS ABOUT SHIPPING?
              </h2>
              <p className="text-gray-400">
                Our customer support team is here to assist you
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
                href="mailto:shipping@xtremecollection.com"
                className="flex items-center gap-3 px-6 py-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all group"
              >
                <Mail className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-500">Email Us</p>
                  <p className="text-white font-medium">shipping@xtremecollection.com</p>
                </div>
              </a>*/}            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span>24/7 Support for delivery inquiries</span>
              </div>
            </div>
          </div>
        </div>

        {/* NB Note */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-yellow-500">NB:</span> Orders are processed immediately after confirmation. 
              Delivery timelines may vary slightly due to unforeseen circumstances.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10" />
        <div className="fixed top-1/2 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-10" />
        <div className="fixed top-1/4 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  );
};

// Add AlertCircle import if not already present
/*const AlertCircle = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
};*/

export default ShippingPolicy;