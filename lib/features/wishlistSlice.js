import { createSlice } from '@reduxjs/toolkit';

const getInitialWishlist = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('gocart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage:", error);
      return [];
    }
  }
  return [];
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: getInitialWishlist(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      if (!product || !product.id) return;

      // Type-safe matching taaki string vs number ID issue na aaye
      const index = state.items.findIndex(
        (item) => String(item.id) === String(product.id)
      );

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        // Redux state aur localStorage ke liye clean serializable payload
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp ?? product.price,
          images: product.images || [],
          category: product.category || '',
          rating: product.rating || [],
          stock: product.stock ?? 10,
          inStock: product.inStock ?? true,
        });
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('gocart_wishlist', JSON.stringify(state.items));
        } catch (error) {
          console.error("Failed to save wishlist to localStorage:", error);
        }
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gocart_wishlist');
      }
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;