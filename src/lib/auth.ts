import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/integrations/firebase/config';

// Simple localStorage-based auth as fallback (no external service needed)
const STORAGE_KEY = 'mediq_user';

export interface UserData {
  email: string;
  fullName: string;
  uid: string;
}

// Check if Firebase is configured (not using demo values)
const isFirebaseConfigured = () => {
  return import.meta.env.VITE_FIREBASE_API_KEY && 
         import.meta.env.VITE_FIREBASE_API_KEY !== "demo-api-key";
};

// LocalStorage-based auth (no external service required)
export const localAuth = {
  signUp: async (email: string, password: string, fullName: string): Promise<UserData> => {
    // Simple validation
    if (!email || !password || !fullName) {
      throw new Error('All fields are required');
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('mediq_users') || '[]');
    if (existingUsers.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    // Create user
    const userData: UserData = {
      email,
      fullName,
      uid: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Store user
    existingUsers.push({ ...userData, password }); // In production, hash passwords!
    localStorage.setItem('mediq_users', JSON.stringify(existingUsers));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

    return userData;
  },

  signIn: async (email: string, password: string): Promise<UserData> => {
    const users = JSON.parse(localStorage.getItem('mediq_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const userData: UserData = {
      email: user.email,
      fullName: user.fullName,
      uid: user.uid
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  },

  signOut: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): UserData | null => {
    const userStr = localStorage.getItem(STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  onAuthStateChanged: (callback: (user: UserData | null) => void) => {
    // Check immediately
    callback(localAuth.getCurrentUser());

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback(localAuth.getCurrentUser());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};

// Firebase-based auth (if configured)
export const firebaseAuth = {
  signUp: async (email: string, password: string, fullName: string): Promise<UserData> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: fullName });
    
    return {
      email: userCredential.user.email || email,
      fullName,
      uid: userCredential.user.uid
    };
  },

  signIn: async (email: string, password: string): Promise<UserData> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      email: user.email || email,
      fullName: user.displayName || 'User',
      uid: user.uid
    };
  },

  signOut: async (): Promise<void> => {
    await firebaseSignOut(auth);
  },

  getCurrentUser: (): UserData | null => {
    const user = auth.currentUser;
    if (!user) return null;

    return {
      email: user.email || '',
      fullName: user.displayName || 'User',
      uid: user.uid
    };
  },

  onAuthStateChanged: (callback: (user: UserData | null) => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback({
          email: firebaseUser.email || '',
          fullName: firebaseUser.displayName || 'User',
          uid: firebaseUser.uid
        });
      } else {
        callback(null);
      }
    });
  }
};

// Export the appropriate auth based on configuration
export const authService = isFirebaseConfigured() ? firebaseAuth : localAuth;

// Helper to get current user
export const getCurrentUser = () => authService.getCurrentUser();

// Helper to check if user is authenticated
export const isAuthenticated = () => !!getCurrentUser();

