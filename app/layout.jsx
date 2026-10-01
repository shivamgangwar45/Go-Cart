import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
    title: "GoCart. - Shop smarter",
    description: "GoCart. - Modern Full-Stack E-Commerce Platform",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <body className={`${outfit.className} antialiased bg-[#0b0f17] text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-black`}>
                <StoreProvider>
                    {/* Dark Glassmorphic Toast Notifications */}
                    <Toaster 
                        position="top-center"
                        toastOptions={{
                            style: {
                                background: '#121a24',
                                color: '#f8fafc',
                                border: '1px solid rgba(51, 65, 85, 0.7)',
                                fontSize: '13px',
                                borderRadius: '10px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#0b0f17',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#f43f5e',
                                    secondary: '#0b0f17',
                                },
                            },
                        }}
                    />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}