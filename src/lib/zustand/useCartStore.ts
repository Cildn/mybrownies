import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'bundle' | 'collection';
};

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  redirect: boolean;
  toggleCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setRedirect: () => void;
  resetRedirect: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      redirect: false,

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),

      clearCart: () => set({ items: [] }),

      setRedirect: () => set({ redirect: true }),
      resetRedirect: () => set({ redirect: false }),
    }),
    { name: "cart-storage" }
  )
);