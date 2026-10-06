import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  loyaltyPoints: number;
}

interface UserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginUser: (userData: UserProfile) => void;
  logoutUser: () => void;
  updateLoyaltyPoints: (points: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      loginUser: (userData) => 
        set({ 
          user: userData, 
          isAuthenticated: true 
        }),
        
      logoutUser: () => 
        set({ 
          user: null, 
          isAuthenticated: false 
        }),
        
      updateLoyaltyPoints: (points) =>
        set((state) => ({
          user: state.user 
            ? { ...state.user, loyaltyPoints: state.user.loyaltyPoints + points }
            : null
        })),
    }),
    {
      name: 'silky-spruce-auth', // Saves user session to local storage
    }
  )
);