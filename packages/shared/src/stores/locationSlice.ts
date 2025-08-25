import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileBuffer } from "../types";

export interface LocationState {
  initialState?: LocationState;
  id: string;
  slug: string;
  name: string;
  color?: string;
  logoBuffer?: FileBuffer;
  logoMime?: string;
}

// Platform-agnostic storage interface
export interface LocationStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

// Platform-agnostic color handler interface
export interface LocationColorHandler {
  applyColorVars(color: string): void;
}

// JWT decoder interface
export interface LocationJwtDecoder {
  decodeToken<T = any>(token: string): T;
}

// Configuration for platform-specific dependencies
export interface LocationSliceConfig {
  storageAdapter?: LocationStorageAdapter;
  colorHandler?: LocationColorHandler;
  jwtDecoder?: LocationJwtDecoder;
  apiMatchers?: {
    getLocationMatcher?: any;
    getLocationSettingsMatcher?: any;
  };
}

// Default no-op implementations
const defaultStorageAdapter: LocationStorageAdapter = {
  getItem: () => null,
  setItem: () => {},
};

const defaultColorHandler: LocationColorHandler = {
  applyColorVars: () => {},
};

const defaultJwtDecoder: LocationJwtDecoder = {
  decodeToken: () => ({} as any),
};

let config: LocationSliceConfig = {
  storageAdapter: defaultStorageAdapter,
  colorHandler: defaultColorHandler,
  jwtDecoder: defaultJwtDecoder,
};

// Configuration function to be called by each platform
export const configureLocationSlice = (newConfig: LocationSliceConfig) => {
  config = { ...config, ...newConfig };
};

const getLocationIdFromToken = (): string => {
  if (!config.storageAdapter || !config.jwtDecoder) return "";

  const token = config.storageAdapter.getItem("waitr_token");
  if (token) {
    try {
      const decodedToken = config.jwtDecoder.decodeToken<{
        locationId: string;
      }>(token);
      return decodedToken.locationId || "";
    } catch (error) {
      console.warn("Failed to decode token:", error);
      return "";
    }
  }
  return "";
};

const getStoredColor = (): string | undefined => {
  if (!config.storageAdapter) return undefined;
  return config.storageAdapter.getItem("locationColor") || undefined;
};

const storeColor = (color: string): void => {
  if (config.storageAdapter) {
    config.storageAdapter.setItem("locationColor", color);
  }
};

const applyColorVars = (color: string): void => {
  if (config.colorHandler) {
    config.colorHandler.applyColorVars(color);
  }
};

const createInitialState = (): LocationState => ({
  initialState: undefined,
  id: getLocationIdFromToken(),
  slug: "",
  name: "",
  color: getStoredColor(),
  logoBuffer: undefined,
  logoMime: "",
});

// Helper function to add extra reducers based on config
const addLocationExtraReducers = (builder: any) => {
  // Add matchers if provided in config
  if (config.apiMatchers?.getLocationMatcher) {
    builder.addMatcher(
      config.apiMatchers.getLocationMatcher,
      (state: LocationState, { payload }: any) => {
        state.id = payload.id;
        state.slug = payload.slug;
        state.name = payload.name;
        state.color = payload.color;
        state.logoBuffer = payload.logo;
        state.logoMime = payload.logoMime;

        if (payload.color) {
          storeColor(payload.color);
          applyColorVars(payload.color);
        }
      }
    );
  }

  if (config.apiMatchers?.getLocationSettingsMatcher) {
    builder.addMatcher(
      config.apiMatchers.getLocationSettingsMatcher,
      (state: LocationState, { payload }: any) => {
        state.slug = payload.slug;
        state.name = payload.name;
        state.color = payload.color;
        state.logoBuffer = payload.logo;
        state.logoMime = payload.logoMime;

        if (payload.color) {
          storeColor(payload.color);
          applyColorVars(payload.color);
        }
      }
    );
  }
};

export const locationSlice = createSlice({
  name: "location",
  initialState: createInitialState(),
  reducers: {
    // Basic setters
    setId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setSlug(state, action: PayloadAction<string>) {
      state.slug = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setColor(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
    setLogoBuffer(state, action: PayloadAction<FileBuffer | undefined>) {
      state.logoBuffer = action.payload;
    },
    setLogoMime(state, action: PayloadAction<string>) {
      state.logoMime = action.payload;
    },

    // Complex actions
    changeColorFromSettings(state, action: PayloadAction<string>) {
      state.color = action.payload;
      storeColor(action.payload);
      applyColorVars(action.payload);
    },
    changeLogoBuffer(
      state,
      action: PayloadAction<{
        type: "Buffer";
        data: number[] | Uint8Array;
      }>
    ) {
      state.logoBuffer = action.payload;
    },
    changeLogoMime(state, action: PayloadAction<string>) {
      state.logoMime = action.payload;
    },
    saveInitialState(state) {
      state.initialState = { ...state, initialState: undefined };
    },
    goBackToInitialState(state) {
      if (state.initialState) {
        Object.assign(state, state.initialState);
      }
      if (state.color) {
        applyColorVars(state.color);
      }
    },

    // Bulk update
    updateLocation(state, action: PayloadAction<Partial<LocationState>>) {
      const { initialState, ...updates } = action.payload;
      Object.assign(state, updates);
    },

    // Reset to initial state
    resetLocation(state) {
      const newInitialState = createInitialState();
      Object.assign(state, newInitialState);
    },
  },
  extraReducers: addLocationExtraReducers,
});

export const locationActions = locationSlice.actions;

export default locationSlice.reducer;

// Utility function to reinitialize the slice with new config
export const reinitializeLocationSlice = () => {
  return createSlice({
    name: "location",
    initialState: createInitialState(),
    reducers: locationSlice.caseReducers,
    extraReducers: addLocationExtraReducers,
  });
};
