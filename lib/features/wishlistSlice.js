import { createSlice } from '@reduxjs/toolkit';

const getInitialWishlist = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gocart_wishlist');
    return saved ? JSON.parse(saved) : [];
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
      const index = state.items.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('gocart_wishlist', JSON.stringify(state.items));
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;