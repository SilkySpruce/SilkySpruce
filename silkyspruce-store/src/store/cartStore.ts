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
  stock?: number; // Max available stock (optional so old saved carts don't break)
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
          const max = item.stock ?? Infinity;

          // Check if this exact product size is already in the cart
          const existingItem = state.items.find((i) => i.id === item.id);

          // If it is, just increase the quantity (never past stock)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + item.quantity, max),
                      stock: item.stock ?? i.stock,
                    }
                  : i
              ),
            };
          }
          // If it's a new item, add it to the array (never past stock)
          return {
            items: [...state.items, { ...item, quantity: Math.min(item.quantity, max) }],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id === id) {
              const max = i.stock ?? Infinity;
              // Quantity stays between 1 and the available stock
              const newQuantity = Math.min(max, Math.max(1, i.quantity + delta));
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