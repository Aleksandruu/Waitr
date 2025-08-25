"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedUtils = exports.SHARED_ASSETS = void 0;
// Main entry point for the shared package
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./constants"), exports);
__exportStar(require("./api"), exports);
__exportStar(require("./stores"), exports);
// Asset paths for easy access across platforms
exports.SHARED_ASSETS = {
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
};
// Utility functions that can be shared across platforms
exports.SharedUtils = {
    /**
     * Get the full path to an asset
     */
    getAssetPath: (relativePath) => {
        return `shared/${relativePath}`;
    },
    /**
     * Get icon path by name
     */
    getIconPath: (iconName) => {
        return exports.SHARED_ASSETS.icons[iconName];
    },
};
