import {
  LocationStorageAdapter,
  LocationColorHandler,
  LocationJwtDecoder,
} from "../locationSlice";
import { jwtDecode } from "jwt-decode";

// Mobile-specific storage adapter using AsyncStorage (to be implemented by the mobile app)
export const createMobileStorageAdapter = (
  asyncStorage: any
): LocationStorageAdapter => ({
  getItem: (key: string) => {
    // This will need to be handled differently in mobile since AsyncStorage is async
    // For now, return null and let the mobile app handle this properly
    console.warn(
      "Mobile storage adapter getItem called synchronously. Consider using async version."
    );
    return null;
  },
  setItem: (key: string, value: string) => {
    // This will need to be handled differently in mobile since AsyncStorage is async
    // For now, do nothing and let the mobile app handle this properly
    console.warn(
      "Mobile storage adapter setItem called synchronously. Consider using async version."
    );
  },
});

// Mobile-specific color handler (could integrate with React Native styling)
export const mobileColorHandler: LocationColorHandler = {
  applyColorVars: (baseColor: string) => {
    // In React Native, you might want to update a theme context or similar
    // For now, this is a no-op, but mobile apps can override this
    console.log("Mobile color handler: applying color", baseColor);
  },
};

// Mobile-specific JWT decoder (same as web, but could be different if needed)
export const mobileJwtDecoder: LocationJwtDecoder = {
  decodeToken: <T = any>(token: string): T => {
    // You might want to use a different JWT library for React Native
    // For now, assume the same jwt-decode library works
    try {
      return jwtDecode<T>(token);
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
      return {} as T;
    }
  },
};

// Async versions for mobile apps that need them
export interface AsyncLocationStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export const createAsyncMobileStorageAdapter = (
  asyncStorage: any
): AsyncLocationStorageAdapter => ({
  getItem: async (key: string) => {
    try {
      return await asyncStorage.getItem(key);
    } catch (error) {
      console.error("Failed to get item from AsyncStorage:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await asyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Failed to set item in AsyncStorage:", error);
    }
  },
});
