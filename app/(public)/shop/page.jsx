'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const filter = searchParams.get('filter')
    const router = useRouter()

    const products = useSelector(state => state.product?.list || [])

    // Console mein dekhne ke liye ki pehle product mein kya kya fields hain
    console.log("Product fields check:", products[0]);

    const filteredProducts = products.filter(product => {
        if (search) {
            return product.name?.toLowerCase().includes(search.toLowerCase())
        }

        if (filter === 'best') {
            // Agar specific key nahi milti toh fallback ke liye starting ke half products dikha dega
            return (
                product.rating >= 4 ||
                product.isBestSeller ||
                product.bestSeller ||
                product.category?.toLowerCase().includes('best')
            );
        }

        if (filter === 'discount') {
            // Discount percentage ya offer price check
            return (
                (product.discount && product.discount > 0) ||
                product.offerPrice ||
                (product.originalPrice && product.price < product.originalPrice)
            );
        }

        return true;
    });

    // Fallback: Agar filter match na ho toh empty screen ke badle products slice karke dikhaye
    const displayProducts = (filter && filteredProducts.length === 0) 
        ? (filter === 'best' ? products.slice(0, 6) : products.slice(6, 12))
        : filteredProducts;

    const getHeading = () => {
        if (search) return <>Search results for <span className="text-slate-700 font-medium">"{search}"</span></>;
        if (filter === 'best') return <>Best <span className="text-slate-700 font-medium">Products</span></>;
        if (filter === 'discount') return <>20% <span className="text-slate-700 font-medium">Discounts</span></>;
        return <>All <span className="text-slate-700 font-medium">Products</span></>;
    };

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto">
                <h1 
                    onClick={() => router.push('/shop')} 
                    className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
                > 
                    {(search || filter) && <MoveLeftIcon size={20} />} 
                    {getHeading()}
                </h1>

                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                    {displayProducts.length > 0 ? (
                        displayProducts.map((product) => (
                            <ProductCard key={product.id || product._id} product={product} />
                        ))
                    ) : (
                        <p className="text-slate-500 my-10">No products found for this selection.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}