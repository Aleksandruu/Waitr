// Main entry point for the shared package
export * from "./types";
export * from "./utils";
export * from "./constants";
export * from "./api";
export * from "./stores";

// Asset paths for easy access across platforms
export const SHARED_ASSETS = {
  icons: {
    bellConcierge: "./assets/icons/bell-concierge-solid-full.svg",
    calendar: "./assets/icons/calendar-regular-full.svg",
    check: "./assets/icons/check-solid-full.svg",
    circleCheck: "./assets/icons/circle-check-regular-full.svg",
    dollarSign: "./assets/icons/dollar-sign-solid-full.svg",
    hourglassHalf: "./assets/icons/hourglass-half-regular-full.svg",
    minus: "./assets/icons/minus-solid-full.svg",
    plus: "./assets/icons/plus-solid-full.svg",
    trashCan: "./assets/icons/trash-can-regular-full.svg",
  },
} as const;

// Utility functions that can be shared across platforms
export const SharedUtils = {
  /**
   * Get the full path to an asset
   */
  getAssetPath: (relativePath: string) => {
    return `shared/${relativePath}`;
  },

  /**
   * Get icon path by name
   */
  getIconPath: (iconName: keyof typeof SHARED_ASSETS.icons) => {
    return SHARED_ASSETS.icons[iconName];
  },
} as const;
