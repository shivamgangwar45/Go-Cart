'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0b0f17] text-slate-100 overflow-x-hidden space-y-12 pb-16">
            <Hero />
            <LatestProducts />
            <BestSelling />
            <RecentlyViewed />
            <OurSpecs />
            <Newsletter />
        </main>
    );
}