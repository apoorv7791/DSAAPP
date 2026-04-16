import { ThemeType } from '../theme/ThemeContext';

// Simple in-memory storage with basic persistence
class InMemoryStorage {
  private static instance: InMemoryStorage;
  private data: { [key: string]: string } = {};

  static getInstance(): InMemoryStorage {
    if (!InMemoryStorage.instance) {
      InMemoryStorage.instance = new InMemoryStorage();
    }
    return InMemoryStorage.instance;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.data[key] = value;
  }

  async getItem(key: string): Promise<string | null> {
    return this.data[key] || null;
  }

  async removeItem(key: string): Promise<void> {
    delete this.data[key];
  }

  async multiRemove(keys: string[]): Promise<void> {
    keys.forEach(key => delete this.data[key]);
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    return keys.map(key => [key, this.data[key] || null]);
  }
}

const storage = InMemoryStorage.getInstance();

const STORAGE_KEYS = {
  CURRENT_THEME: 'current_theme',
  CUSTOM_THEMES: 'custom_themes',
  THEME_PREFERENCES: 'theme_preferences'
};

export interface ThemePreferences {
  autoSwitchDarkMode: boolean;
  useSystemTheme: boolean;
  lastSelectedTheme: string;
}

export class ThemeStorage {
  // Save current theme
  static async saveCurrentTheme(theme: ThemeType): Promise<void> {
    try {
      const themeJson = JSON.stringify(theme);
      await storage.setItem(STORAGE_KEYS.CURRENT_THEME, themeJson);
    } catch (error) {
      console.error('Error saving current theme:', error);
      throw error;
    }
  }

  // Load current theme
  static async loadCurrentTheme(): Promise<ThemeType | null> {
    try {
      const themeJson = await storage.getItem(STORAGE_KEYS.CURRENT_THEME);
      return themeJson ? JSON.parse(themeJson) : null;
    } catch (error) {
      console.error('Error loading current theme:', error);
      return null;
    }
  }

  // Save custom themes
  static async saveCustomThemes(themes: { [key: string]: ThemeType }): Promise<void> {
    try {
      const themesJson = JSON.stringify(themes);
      await storage.setItem(STORAGE_KEYS.CUSTOM_THEMES, themesJson);
    } catch (error) {
      console.error('Error saving custom themes:', error);
      throw error;
    }
  }

  // Load custom themes
  static async loadCustomThemes(): Promise<{ [key: string]: ThemeType }> {
    try {
      const themesJson = await storage.getItem(STORAGE_KEYS.CUSTOM_THEMES);
      return themesJson ? JSON.parse(themesJson) : {};
    } catch (error) {
      console.error('Error loading custom themes:', error);
      return {};
    }
  }

  // Save a single custom theme
  static async saveCustomTheme(name: string, theme: ThemeType): Promise<void> {
    try {
      const customThemes = await this.loadCustomThemes();
      customThemes[name] = theme;
      await this.saveCustomThemes(customThemes);
    } catch (error) {
      console.error('Error saving custom theme:', error);
      throw error;
    }
  }

  // Delete a custom theme
  static async deleteCustomTheme(name: string): Promise<void> {
    try {
      const customThemes = await this.loadCustomThemes();
      delete customThemes[name];
      await this.saveCustomThemes(customThemes);
    } catch (error) {
      console.error('Error deleting custom theme:', error);
      throw error;
    }
  }

  // Save theme preferences
  static async saveThemePreferences(preferences: ThemePreferences): Promise<void> {
    try {
      const preferencesJson = JSON.stringify(preferences);
      await storage.setItem(STORAGE_KEYS.THEME_PREFERENCES, preferencesJson);
    } catch (error) {
      console.error('Error saving theme preferences:', error);
      throw error;
    }
  }

  // Load theme preferences
  static async loadThemePreferences(): Promise<ThemePreferences> {
    try {
      const preferencesJson = await storage.getItem(STORAGE_KEYS.THEME_PREFERENCES);
      const defaultPreferences: ThemePreferences = {
        autoSwitchDarkMode: false,
        useSystemTheme: false,
        lastSelectedTheme: 'Light'
      };
      return preferencesJson ? { ...defaultPreferences, ...JSON.parse(preferencesJson) } : defaultPreferences;
    } catch (error) {
      console.error('Error loading theme preferences:', error);
      return {
        autoSwitchDarkMode: false,
        useSystemTheme: false,
        lastSelectedTheme: 'Light'
      };
    }
  }

  // Export all themes
  static async exportThemes(): Promise<string> {
    try {
      const currentTheme = await this.loadCurrentTheme();
      const customThemes = await this.loadCustomThemes();
      const preferences = await this.loadThemePreferences();

      const exportData = {
        currentTheme,
        customThemes,
        preferences,
        exportDate: new Date().toISOString()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting themes:', error);
      throw error;
    }
  }

  // Import themes
  static async importThemes(importData: string): Promise<void> {
    try {
      const data = JSON.parse(importData);

      if (data.currentTheme) {
        await this.saveCurrentTheme(data.currentTheme);
      }

      if (data.customThemes) {
        await this.saveCustomThemes(data.customThemes);
      }

      if (data.preferences) {
        await this.saveThemePreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error importing themes:', error);
      throw error;
    }
  }

  // Clear all theme data
  static async clearAllThemeData(): Promise<void> {
    try {
      await storage.multiRemove([
        STORAGE_KEYS.CURRENT_THEME,
        STORAGE_KEYS.CUSTOM_THEMES,
        STORAGE_KEYS.THEME_PREFERENCES
      ]);
    } catch (error) {
      console.error('Error clearing theme data:', error);
      throw error;
    }
  }

  // Get storage usage info
  static async getStorageInfo(): Promise<{
    currentThemeSize: number;
    customThemesSize: number;
    preferencesSize: number;
    totalSize: number;
  }> {
    try {
      const keys = await storage.multiGet([
        STORAGE_KEYS.CURRENT_THEME,
        STORAGE_KEYS.CUSTOM_THEMES,
        STORAGE_KEYS.THEME_PREFERENCES
      ]);

      const currentThemeSize = keys[0][1] ? keys[0][1].length : 0;
      const customThemesSize = keys[1][1] ? keys[1][1].length : 0;
      const preferencesSize = keys[2][1] ? keys[2][1].length : 0;

      return {
        currentThemeSize,
        customThemesSize,
        preferencesSize,
        totalSize: currentThemeSize + customThemesSize + preferencesSize
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        currentThemeSize: 0,
        customThemesSize: 0,
        preferencesSize: 0,
        totalSize: 0
      };
    }
  }
}

export default ThemeStorage;
