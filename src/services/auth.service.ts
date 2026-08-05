import { getApps, getApp, initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';

import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON, remove } from '@/lib/storage';
import { isFirebaseConfigured, firebaseConfig } from '@/config/firebase';

export interface AuthUser {
  email: string;
  name?: string;
}

interface LocalAccount {
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: string;
}

const SESSION_KEY = `${STORAGE_KEYS.auth}:session`;
const ACCOUNTS_KEY = STORAGE_KEYS.auth;

/** Non-cryptographic hash for the offline fallback only. Real security is
 *  handled by Firebase when configured. */
function hashPassword(password: string): string {
  let h = 5381;
  const salted = `nutrascan::${password}`;
  for (let i = 0; i < salted.length; i++) {
    h = ((h << 5) + h + salted.charCodeAt(i)) >>> 0;
  }
  return `h${h.toString(16)}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function getAccounts(): Promise<LocalAccount[]> {
  return (await readJSON<LocalAccount[]>(ACCOUNTS_KEY)) ?? [];
}

async function getSession(): Promise<AuthUser | null> {
  return await readJSON<AuthUser>(SESSION_KEY);
}

// Lazy Firebase singleton so the SDK is only initialized when real config exists.
let authInstance: Auth | null = null;

function getFirebaseAuth(): Auth {
  if (authInstance) return authInstance;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig!);
  const auth = getAuth(app);
  authInstance = auth;
  return auth;
}

function toAuthUser(user: User): AuthUser {
  return { email: user.email ?? '', name: user.displayName ?? undefined };
}

export interface AuthService {
  getCurrentUser(): Promise<AuthUser | null>;
  signUp(input: { name: string; email: string; password: string }): Promise<AuthUser>;
  signIn(input: { email: string; password: string }): Promise<AuthUser>;
  signOut(): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}

export const authService: AuthService = {
  async getCurrentUser() {
    if (isFirebaseConfigured) {
      const user = getFirebaseAuth().currentUser;
      return user ? toAuthUser(user) : null;
    }
    return getSession();
  },

  async signUp({ name, email, password }) {
    const normalized = normalizeEmail(email);
    if (isFirebaseConfigured) {
      const auth = getFirebaseAuth();
      const credential = await createUserWithEmailAndPassword(auth, normalized, password);
      if (name) {
        await updateProfile(credential.user, { displayName: name }).catch(() => undefined);
      }
      return toAuthUser(credential.user);
    }

    const accounts = await getAccounts();
    if (accounts.some((a) => a.email === normalized)) {
      throw new Error('An account with this email already exists. Try logging in.');
    }
    const account: LocalAccount = {
      email: normalized,
      passwordHash: hashPassword(password),
      name,
      createdAt: new Date().toISOString(),
    };
    await writeJSON(ACCOUNTS_KEY, [...accounts, account]);
    const session: AuthUser = { email: normalized, name };
    await writeJSON(SESSION_KEY, session);
    return session;
  },

  async signIn({ email, password }) {
    const normalized = normalizeEmail(email);
    if (isFirebaseConfigured) {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(auth, normalized, password);
      return toAuthUser(credential.user);
    }

    const accounts = await getAccounts();
    const account = accounts.find((a) => a.email === normalized);
    if (!account) {
      throw new Error('No account found for this email.');
    }
    if (account.passwordHash !== hashPassword(password)) {
      throw new Error('Incorrect password.');
    }
    const session: AuthUser = { email: normalized, name: account.name };
    await writeJSON(SESSION_KEY, session);
    return session;
  },

  async signOut() {
    if (isFirebaseConfigured) {
      await firebaseSignOut(getFirebaseAuth()).catch(() => undefined);
    }
    await remove(SESSION_KEY);
  },

  async sendPasswordResetEmail(email) {
    if (!isFirebaseConfigured) {
      throw new Error('Password reset is only available when Firebase is configured.');
    }
    await firebaseSendPasswordReset(getFirebaseAuth(), normalizeEmail(email));
  },

  onAuthStateChanged(callback) {
    if (isFirebaseConfigured) {
      return firebaseOnAuthStateChanged(getFirebaseAuth(), (user) => {
        callback(user ? toAuthUser(user) : null);
      });
    }
    // Offline mode: emit once with the stored session.
    getSession().then((s) => callback(s));
    return () => undefined;
  },
};
