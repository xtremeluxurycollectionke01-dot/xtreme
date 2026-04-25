"use client";

import { ArrowLeft, Shield, Clock, Repeat, Truck, CreditCard, Search, AlertCircle, Phone, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

const ReturnsPolicy = () => {
  const policyItems = [
    {
      icon: Clock,
      title: "Return Window",
      description: "Returns or exchange requests must be made within 2-3 days after delivery",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-500",
    },
    {
      icon: Shield,
      title: "Condition of Items",
      description: "All items must be returned in their original condition, unworn, and with the original packaging",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: Repeat,
      title: "Exchanges",
      description: "We allow size exchanges, subject to availability",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      icon: Truck,
      title: "Return Shipping",
      description: "Customers are responsible for return shipping costs unless the item delivered was incorrect or defective",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500",
    },
    {
      icon: CreditCard,
      title: "Store Credit",
      description: "Approved returns may be issued as store credit or size exchange, which can be used for future purchases",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-500",
    },
    {
      icon: Search,
      title: "Inspection",
      description: "All returned items will be inspected before an exchange or store credit is approved",
      gradient: "from-red-500/20 to-rose-500/20",
      iconColor: "text-red-500",
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
              <Shield className="relative h-16 w-16 text-yellow-500 mx-auto" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 tracking-tighter">
            RETURNS &{" "}
            <span className="text-yellow-500 relative inline-block">
              REFUND POLICY
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-transparent"></div>
            </span>
          </h1>
          
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mt-4">
            At Xtreme Collection, we aim to ensure every customer is satisfied with their purchase 
            while maintaining fairness on both sides.
          </p>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-red-500/10 border-l-4 border-red-500 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-500 mb-1">Important Notice</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Items that are worn, damaged, or not in their original condition will not be accepted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {policyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/5 overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative p-6 sm:p-8">
                    {/* Icon */}
                    <div className={`mb-4 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              HOW TO{" "}
              <span className="text-yellow-500">RETURN AN ITEM</span>
            </h2>
            <p className="text-gray-400">Simple 3-step process to return your product</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Contact Us", description: "Reach out to our support team within 2-3 days of delivery" },
              { step: "02", title: "Pack Your Item", description: "Ensure item is unworn with original packaging" },
              { step: "03", title: "Ship It Back", description: "Send the item back to us for inspection" },
            ].map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="text-5xl sm:text-6xl font-bold text-yellow-500/20 mb-4 group-hover:text-yellow-500/30 transition-colors">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/3 -right-3 text-yellow-500/30">
                    <ArrowLeft className="h-6 w-6 rotate-180" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                NEED HELP WITH YOUR RETURN?
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
                href="mailto:support@xtremecollection.com"
                className="flex items-center gap-3 px-6 py-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all group"
              >
                <Mail className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-500">Email Us</p>
                  <p className="text-white font-medium">support@xtremecollection.com</p>
                </div>
              </a>*/}
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Response within 24 hours</span>
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

export default ReturnsPolicy;