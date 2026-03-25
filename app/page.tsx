import FeaturedCollections from "../components/FeaturedCollections";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/NavBar";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <FeaturedCollections />
      <Newsletter />
      <Footer />
    </div>
  )
}

// app/page.tsx
/*"use client";

import { useState } from "react";
import { UsersList } from "@/components/users-list";
import { QuotesFeed } from "@/components/quotes-feed";
import { BottomNav } from "@/components/bottom-nav";

type TabType = "users" | "quotes";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("users");

  return (
    <div className="flex h-full flex-col">
      {/* Header *
      <div className="border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900">TextChat</h1>
        <p className="text-xs text-gray-500">pure text · no distractions</p>
      </div>

      {/* Content *
      <div className="flex-1 overflow-y-auto">
        {activeTab === "users" ? <UsersList /> : <QuotesFeed />}
      </div>

      {/* Bottom Navigation *
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}*/

// app/page.tsx (updated)
/*"use client";

import { useState } from "react";
import { UsersList } from "@/components/users-list";
import { QuotesFeed } from "@/components/quotes-feed";
import { StatusFeed } from "@/components/status-feed";
import { BottomNav } from "@/components/bottom-nav";

type TabType = "status" | "users" | "quotes";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("status");

  return (
    <div className="flex h-full flex-col">
      {/* Header *
      <div className="border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900">TextChat</h1>
        <p className="text-xs text-gray-500">pure text · no distractions</p>
      </div>

      {/* Content *
      <div className="flex-1 overflow-y-auto">
        {activeTab === "users" && <UsersList />}
         {activeTab === "status" && <StatusFeed />}
        {activeTab === "quotes" && <QuotesFeed />}
      </div>

      {/* Bottom Navigation *
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}*/

