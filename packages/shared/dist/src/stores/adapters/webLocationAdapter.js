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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webJwtDecoder = exports.webColorHandler = exports.webStorageAdapter = void 0;
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jwtDecode = __importStar(require("jwt-decode"));
// Web-specific storage adapter using localStorage
exports.webStorageAdapter = {
    getItem: (key) => {
        if (typeof window !== "undefined" && window.localStorage) {
            return localStorage.getItem(key);
        }
        return null;
    },
    setItem: (key, value) => {
        if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(key, value);
        }
    },
};
// Web-specific color handler that manipulates CSS variables
exports.webColorHandler = {
    applyColorVars: (baseColor) => {
        if (typeof window === "undefined" || !window.document)
            return;
        const color = (0, tinycolor2_1.default)(baseColor);
        const vars = {
            "--color-brand": color.toHexString(),
            "--color-brand-light": color.lighten(20).desaturate(20).toHexString(),
            "--color-brand-dark": color.darken(20).toHexString(),
        };
        Object.entries(vars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    },
};
// Web-specific JWT decoder
exports.webJwtDecoder = {
    decodeToken: (token) => {
        return jwtDecode.jwtDecode(token);
    },
};
