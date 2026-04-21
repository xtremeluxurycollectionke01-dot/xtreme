// app/privacy/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Xtreme Luxury Collections',
  description: 'Privacy policy for Xtreme Luxury Collections - Your privacy matters to us. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with yellow accent */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#15120b]">
              Xtreme<span className="text-[#fcbd04]">Luxury</span>
            </h1>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Yellow accent bar */}
        <div className="w-16 h-1 bg-[#fcbd04] mb-6"></div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#15120b] mb-4">
          Privacy Policy
        </h1>

        <p className="text-[#8b6201] text-sm sm:text-base mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-lg max-w-none">
          <p className="text-[#15120b] leading-relaxed mb-6">
            At <span className="font-semibold text-[#fcbd04]">Xtreme Luxury Collections</span>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website xtremeluxurycollection.co.ke or use our mobile application.
          </p>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              Information We Collect
            </h2>
            <div className="bg-[#d6d6d6]/5 border border-[#d6d6d6]/30 rounded-xl p-5">
              <p className="text-[#15120b] mb-3 font-semibold">Personal Information:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#3b2900]">
                <li>Name and contact information (email address, phone number, shipping address)</li>
                <li>Account credentials (username and password)</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Order history and preferences</li>
              </ul>

              <p className="text-[#15120b] mt-4 mb-3 font-semibold">Automatically Collected Information:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#3b2900]">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, click patterns)</li>
                <li>Location data (with your consent)</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              How We Use Your Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Process and fulfill your orders",
                "Communicate about your purchases",
                "Improve our products and services",
                "Personalize your shopping experience",
                "Send promotional offers (with consent)",
                "Prevent fraud and enhance security",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-[#d6d6d6]/5 rounded-lg p-3">
                  <div className="w-1.5 h-1.5 bg-[#fcbd04] rounded-full"></div>
                  <span className="text-[#15120b]">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Sharing Your Information */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              Sharing Your Information
            </h2>
            <div className="bg-[#d6d6d6]/5 border border-[#d6d6d6]/30 rounded-xl p-5">
              <p className="text-[#15120b] leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1 text-[#3b2900]">
                <li><span className="font-medium">Service providers</span> (payment processors, shipping carriers)</li>
                <li><span className="font-medium">Legal authorities</span> when required by law</li>
                <li><span className="font-medium">Business transfers</span> (merger, acquisition, or asset sale)</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              Your Rights & Choices
            </h2>
            <div className="bg-[#15120b] rounded-xl p-5 text-white">
              <p className="mb-3">You have the right to:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Access your personal data",
                  "Correct inaccurate information",
                  "Delete your account and data",
                  "Opt-out of marketing emails",
                  "Data portability",
                  "Withdraw consent anytime",
                ].map((right, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[#fcbd04] text-lg">✓</span>
                    <span className="text-[#d6d6d6]">{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              Data Security
            </h2>
            <p className="text-[#15120b] leading-relaxed mb-3">
              We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your information. However, no method of transmission over the Internet is 100% secure.
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              {["SSL Encryption", "PCI Compliant", "Regular Audits", "Access Controls"].map((item) => (
                <span key={item} className="px-3 py-1 bg-[#fcbd04]/10 text-[#fcbd04] text-sm rounded-full border border-[#fcbd04]/30">
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              Cookies & Tracking
            </h2>
            <p className="text-[#15120b] leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              Children's Privacy
            </h2>
            <p className="text-[#15120b] leading-relaxed">
              Our services are not directed to individuals under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              Changes to This Policy
            </h2>
            <p className="text-[#15120b] leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mt-10 pt-6 border-t border-[#d6d6d6]/50">
            <h2 className="text-xl sm:text-2xl font-bold text-[#15120b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fcbd04] rounded-full"></span>
              Contact Us
            </h2>
            <div className="bg-[#fcbd04]/5 rounded-xl p-5 border border-[#fcbd04]/20">
              <p className="text-[#15120b] mb-3">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[#fcbd04] text-lg">📧</span>
                  <a href="mailto:privacy@xtremeluxurycollection.co.ke" className="text-[#fcbd04] hover:underline">
                    privacy@xtremeluxurycollection.co.ke
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#fcbd04] text-lg">📞</span>
                  <span className="text-[#15120b]">+254 (0) 700 000 000</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#fcbd04] text-lg">📍</span>
                  <span className="text-[#15120b]">Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[#d6d6d6]/50 text-center text-[#8b6201] text-sm">
          <p>© {new Date().getFullYear()} Xtreme Luxury Collections. All rights reserved.</p>
          <p className="mt-1">Made with <span className="text-[#fcbd04]">✦</span> in Kenya</p>
        </div>
      </div>
    </div>
  );
}