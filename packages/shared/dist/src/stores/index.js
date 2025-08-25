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
// Redux stores
__exportStar(require("./locationSlice"), exports);
// Platform-specific configurations
__exportStar(require("./webLocationSlice"), exports);
__exportStar(require("./mobileLocationSlice"), exports);
// Platform adapters
__exportStar(require("./adapters"), exports);
// Example store structure for future use:
// export * from './authStore';
// export * from './userStore';
// export * from './orderStore';
// Example store configuration for future use:
// export { configureAppStore } from './store';
