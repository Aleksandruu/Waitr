"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncMobileStorageAdapter = exports.mobileJwtDecoder = exports.mobileColorHandler = exports.createMobileStorageAdapter = void 0;
const jwt_decode_1 = require("jwt-decode");
// Mobile-specific storage adapter using AsyncStorage (to be implemented by the mobile app)
const createMobileStorageAdapter = (asyncStorage) => ({
    getItem: (key) => {
        // This will need to be handled differently in mobile since AsyncStorage is async
        // For now, return null and let the mobile app handle this properly
        console.warn("Mobile storage adapter getItem called synchronously. Consider using async version.");
        return null;
    },
    setItem: (key, value) => {
        // This will need to be handled differently in mobile since AsyncStorage is async
        // For now, do nothing and let the mobile app handle this properly
        console.warn("Mobile storage adapter setItem called synchronously. Consider using async version.");
    },
});
exports.createMobileStorageAdapter = createMobileStorageAdapter;
// Mobile-specific color handler (could integrate with React Native styling)
exports.mobileColorHandler = {
    applyColorVars: (baseColor) => {
        // In React Native, you might want to update a theme context or similar
        // For now, this is a no-op, but mobile apps can override this
        console.log("Mobile color handler: applying color", baseColor);
    },
};
// Mobile-specific JWT decoder (same as web, but could be different if needed)
exports.mobileJwtDecoder = {
    decodeToken: (token) => {
        // You might want to use a different JWT library for React Native
        // For now, assume the same jwt-decode library works
        try {
            return (0, jwt_decode_1.jwtDecode)(token);
        }
        catch (error) {
            console.error("Failed to decode JWT token:", error);
            return {};
        }
    },
};
const createAsyncMobileStorageAdapter = (asyncStorage) => ({
    getItem: async (key) => {
        try {
            return await asyncStorage.getItem(key);
        }
        catch (error) {
            console.error("Failed to get item from AsyncStorage:", error);
            return null;
        }
    },
    setItem: async (key, value) => {
        try {
            await asyncStorage.setItem(key, value);
        }
        catch (error) {
            console.error("Failed to set item in AsyncStorage:", error);
        }
    },
});
exports.createAsyncMobileStorageAdapter = createAsyncMobileStorageAdapter;
