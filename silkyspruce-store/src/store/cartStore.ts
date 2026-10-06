import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // The unique variant ID (so 100ml and 250ml are treated separately)
  productId: string;
  name: string;
  slug: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          // Check if this exact product size is already in the cart
          const existingItem = state.items.find((i) => i.id === item.id);
          
          // If it is, just increase the quantity
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          // If it's a new item, add it to the array
          return { items: [...state.items, item] };
        }),
        
      removeItem: (id) =>
        set((state) => ({ 
          items: state.items.filter((i) => i.id !== id) 
        })),
        
      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id === id) {
              // Ensure quantity never goes below 1
              const newQuantity = Math.max(1, i.quantity + delta);
              return { ...i, quantity: newQuantity };
            }
            return i;
          }),
        })),
        
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'silky-spruce-cart', // The key used to save the cart in the browser's Local Storage
    }
  )
);