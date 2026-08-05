import { create } from 'zustand';
import { authService, type AuthUser } from '@/services/auth.service';

interface AuthState {
  user: AuthUser | null;
  initialized: boolean;
  hydrate: () => Promise<() => void>;
  setUser: (user: AuthUser | null) => void;
}

/** Single source of truth for the signed-in user. Keeps the login/signup/
 *  signout actions and the route guard in sync (Firebase or offline mode). */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,

  async hydrate() {
    try {
      const user = await authService.getCurrentUser();
      set({ user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
    // Subscribe for Firebase state changes (offline mode fires once).
    const unsub = authService.onAuthStateChanged((next) => {
      set({ user: next, initialized: true });
    });
    return unsub;
  },

  setUser(user) {
    set({ user });
  },
}));
