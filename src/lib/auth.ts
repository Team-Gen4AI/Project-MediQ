// Simple localStorage-based auth (no external service needed)
const STORAGE_KEY = 'mediq_user';

export interface UserData {
  email: string;
  fullName: string;
  uid: string;
}

// LocalStorage-based auth (no external service required)
export const authService = {
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
    // Helper to get current user
    const getCurrentUser = (): UserData | null => {
      const userStr = localStorage.getItem(STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    };

    // Check immediately
    callback(getCurrentUser());

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback(getCurrentUser());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};

// Helper to get current user
export const getCurrentUser = () => authService.getCurrentUser();

// Helper to check if user is authenticated
export const isAuthenticated = () => !!getCurrentUser();

