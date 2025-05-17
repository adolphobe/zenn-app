import { User } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

// Default user preferences
const defaultUserPreferences = {
  darkMode: false,
  activeViewMode: 'power' as const,
  sidebarOpen: true,
  viewModeSettings: {
    power: {
      showHiddenTasks: false,
      showPillars: false,
      showDates: true,
      showScores: true,
      sortOptions: {
        sortDirection: 'desc' as const,
        noDateAtEnd: true
      }
    },
    chronological: {
      showHiddenTasks: true,
      showPillars: false,
      showDates: false,
      showScores: true,
      sortOptions: {
        sortDirection: 'asc' as const,
        noDateAtEnd: false
      }
    }
  },
  dateDisplayOptions: {
    hideYear: false,
    hideTime: false,
    hideDate: false,
  }
};

// Create mock users
export const users: User[] = [
  {
    id: uuidv4(),
    name: 'Adolpho',
    email: 'adolphobe@gmail.com',
    password: '123456', // This would be hashed in a real implementation
    profileImage: 'https://cdn.shopify.com/s/files/1/0629/1993/4061/files/WhatsApp_Image_2025-05-14_at_17.26.25.jpg?v=1747255394',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: defaultUserPreferences
  }
];

// Get user by email and password
export const getUserByCredentials = (email: string, password: string): User | null => {
  return users.find(user => user.email === email && user.password === password) || null;
};

// Get user by ID
export const getUserById = (id: string): User | null => {
  return users.find(user => user.id === id) || null;
};

// Update user preferences
export const updateUserPreferences = (userId: string, preferences: Partial<User['preferences']>): User | null => {
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    preferences: {
      ...users[userIndex].preferences,
      ...preferences
    },
    lastLoginAt: new Date().toISOString()
  };
  
  return users[userIndex];
};

// Apply user preferences to the app
export const applyUserPreferences = (preferences: User['preferences']): void => {
  // Handle dark mode
  if (preferences.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Other preferences will be applied through the AppContext
  // This is a placeholder for future implementation
};

// Save user preferences to localStorage for persistence between sessions
export const saveUserPreferences = (userId: string): void => {
  const user = getUserById(userId);
  if (user) {
    localStorage.setItem('acto_user_preferences', JSON.stringify(user.preferences));
  }
};

// Load user preferences from localStorage
export const loadUserPreferences = (): User['preferences'] | null => {
  const stored = localStorage.getItem('acto_user_preferences');
  return stored ? JSON.parse(stored) : null;
};
