import {
  LocationStorageAdapter,
  LocationColorHandler,
  LocationJwtDecoder,
} from "../locationSlice";
import tinycolor from "tinycolor2";
import * as jwtDecode from "jwt-decode";

// Web-specific storage adapter using localStorage
export const webStorageAdapter: LocationStorageAdapter = {
  getItem: (key: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
};

// Web-specific color handler that manipulates CSS variables
export const webColorHandler: LocationColorHandler = {
  applyColorVars: (baseColor: string) => {
    if (typeof window === "undefined" || !window.document) return;

    const color = tinycolor(baseColor);
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
export const webJwtDecoder: LocationJwtDecoder = {
  decodeToken: <T = any>(token: string): T => {
    return jwtDecode.jwtDecode<T>(token);
  },
};
