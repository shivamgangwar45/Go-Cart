'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import ReviewBreakdown from "@/components/ReviewBreakdown";
import ReviewModal from "@/components/ReviewModal";
import ReviewCard from "@/components/ReviewCard";
import RecentlyViewed from "@/components/RecentlyViewed";
import { ChevronRight, ArrowLeft } from "lucide-react";

const EMPTY_PRODUCTS = [];

export default function Product() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

    const products = useSelector((state) => state?.product?.list ?? EMPTY_PRODUCTS);

    useEffect(() => {
        if (products.length > 0 && productId) {
            const foundProduct = products.find((p) => String(p.id) === String(productId));
            setProduct(foundProduct || null);
            setReviews(foundProduct?.rating || []);
        }
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [productId, products]);

    const handleNewReview = (newReview) => {
        setReviews((prev) => [newReview, ...prev]);
    };

    if (!product && products.length > 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#0b0f17] text-slate-100">
                <h2 className="text-xl font-bold text-white mb-2">Product Not Found</h2>
                <p className="text-xs text-slate-400 mb-6">The requested product could not be located in our catalog.</p>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
                >
                    <ArrowLeft size={16} /> Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0b0f17] text-slate-100 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-slate-400 pt-6">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <ChevronRight size={13} className="text-slate-600" />
                    <Link href="/shop" className="hover:text-emerald-400 transition-colors">Products</Link>
                    {product?.category && (
                        <>
                            <ChevronRight size={13} className="text-slate-600" />
                            <Link 
                                href={`/shop?category=${encodeURIComponent(product.category)}`}
                                className="hover:text-emerald-400 transition-colors"
                            >
                                {product.category}
                            </Link>
                        </>
                    )}
                    <ChevronRight size={13} className="text-slate-600" />
                    <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">
                        {product?.name || 'Loading...'}
                    </span>
                </nav>

                {/* Main Product Showcase */}
                {product && <ProductDetails product={product} />}

                {/* Tabbed Specifications & Long Description */}
                {product && <ProductDescription product={product} />}

                {/* Customer Reviews & Social Proof Section */}
                {product && (
                    <section className="space-y-6 pt-6 border-t border-slate-800/80">
                        <ReviewBreakdown
                            reviews={reviews}
                            onWriteReviewClick={() => setIsReviewModalOpen(true)}
                        />

                        {/* Verified Customer Reviews List */}
                        {reviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews.map((item, index) => (
                                    <ReviewCard 
                                        key={`${item?.id ?? 'review'}-${index}`} 
                                        item={item} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                                No reviews yet. Be the first to review this product!
                            </div>
                        )}
                    </section>
                )}

                {/* Cross-Sell: Recently Viewed Products */}
                <RecentlyViewed />

                {/* Write Review Modal Popup */}
                {product && (
                    <ReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                        productId={product.id}
                        onSubmitReview={handleNewReview}
                    />
                )}

            </div>
        </main>
    );
}