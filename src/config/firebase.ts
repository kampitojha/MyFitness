/**
 * Firebase configuration, loaded from EXPO_PUBLIC_* environment variables.
 *
 * To enable real authentication, create a Firebase project
 * (https://console.firebase.google.com), enable Email/Password sign-in,
 * then copy the web app config values into a `.env` file:
 *
 *   EXPO_PUBLIC_FIREBASE_API_KEY=...
 *   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
 *   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
 *   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
 *   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
 *   EXPO_PUBLIC_FIREBASE_APP_ID=...
 *
 * Until those are provided the app runs in "local" auth mode (offline),
 * so the flow stays usable and testable.
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseConfig | null = (() => {
  const required = [
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  ];
  if (required.some((v) => !v)) return null;
  return {
    apiKey: required[0] as string,
    authDomain: required[1] as string,
    projectId: required[2] as string,
    storageBucket: required[3] as string,
    messagingSenderId: required[4] as string,
    appId: required[5] as string,
  };
})();

export const isFirebaseConfigured = Boolean(firebaseConfig);
