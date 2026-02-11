import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    Shop: ['Sneakers', 'Boots', 'Sandals', 'Apparel', 'Accessories'],
    Company: ['About Us', 'Careers', 'Press', 'Sustainability'],
    Support: ['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'FAQ'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
  }

  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              {/*<div className="h-10 w-10 gradient-yellow rounded-full"></div>*/}
              <span className="text-2xl font-bold">
                X<span className="text-yellow-500"> TREME</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Redefining luxury streetwear since 2018. We bring you exclusive 
              collaborations and limited edition designer footwear and apparel.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                <button
                  key={index}
                  className="p-2 border border-gray-700 rounded-lg hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2026 XTREME COLLECTION. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg"
              alt="Visa"
              className="h-8 w-8 opacity-50"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg"
              alt="Mastercard"
              className="h-8 w-8 opacity-50"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/americanexpress.svg"
              alt="American Express"
              className="h-8 w-8 opacity-50"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg"
              alt="PayPal"
              className="h-8 w-8 opacity-50"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer