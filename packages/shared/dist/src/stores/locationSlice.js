"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reinitializeLocationSlice = exports.locationActions = exports.locationSlice = exports.configureLocationSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
// Default no-op implementations
const defaultStorageAdapter = {
    getItem: () => null,
    setItem: () => { },
};
const defaultColorHandler = {
    applyColorVars: () => { },
};
const defaultJwtDecoder = {
    decodeToken: () => ({}),
};
let config = {
    storageAdapter: defaultStorageAdapter,
    colorHandler: defaultColorHandler,
    jwtDecoder: defaultJwtDecoder,
};
// Configuration function to be called by each platform
const configureLocationSlice = (newConfig) => {
    config = { ...config, ...newConfig };
};
exports.configureLocationSlice = configureLocationSlice;
const getLocationIdFromToken = () => {
    if (!config.storageAdapter || !config.jwtDecoder)
        return "";
    const token = config.storageAdapter.getItem("waitr_token");
    if (token) {
        try {
            const decodedToken = config.jwtDecoder.decodeToken(token);
            return decodedToken.locationId || "";
        }
        catch (error) {
            console.warn("Failed to decode token:", error);
            return "";
        }
    }
    return "";
};
const getStoredColor = () => {
    if (!config.storageAdapter)
        return undefined;
    return config.storageAdapter.getItem("locationColor") || undefined;
};
const storeColor = (color) => {
    if (config.storageAdapter) {
        config.storageAdapter.setItem("locationColor", color);
    }
};
const applyColorVars = (color) => {
    if (config.colorHandler) {
        config.colorHandler.applyColorVars(color);
    }
};
const createInitialState = () => ({
    initialState: undefined,
    id: getLocationIdFromToken(),
    slug: "",
    name: "",
    color: getStoredColor(),
    logoBuffer: undefined,
    logoMime: "",
});
// Helper function to add extra reducers based on config
const addLocationExtraReducers = (builder) => {
    // Add matchers if provided in config
    if (config.apiMatchers?.getLocationMatcher) {
        builder.addMatcher(config.apiMatchers.getLocationMatcher, (state, { payload }) => {
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
        });
    }
    if (config.apiMatchers?.getLocationSettingsMatcher) {
        builder.addMatcher(config.apiMatchers.getLocationSettingsMatcher, (state, { payload }) => {
            state.slug = payload.slug;
            state.name = payload.name;
            state.color = payload.color;
            state.logoBuffer = payload.logo;
            state.logoMime = payload.logoMime;
            if (payload.color) {
                storeColor(payload.color);
                applyColorVars(payload.color);
            }
        });
    }
};
exports.locationSlice = (0, toolkit_1.createSlice)({
    name: "location",
    initialState: createInitialState(),
    reducers: {
        // Basic setters
        setId(state, action) {
            state.id = action.payload;
        },
        setSlug(state, action) {
            state.slug = action.payload;
        },
        setName(state, action) {
            state.name = action.payload;
        },
        setColor(state, action) {
            state.color = action.payload;
        },
        setLogoBuffer(state, action) {
            state.logoBuffer = action.payload;
        },
        setLogoMime(state, action) {
            state.logoMime = action.payload;
        },
        // Complex actions
        changeColorFromSettings(state, action) {
            state.color = action.payload;
            storeColor(action.payload);
            applyColorVars(action.payload);
        },
        changeLogoBuffer(state, action) {
            state.logoBuffer = action.payload;
        },
        changeLogoMime(state, action) {
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
        updateLocation(state, action) {
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
exports.locationActions = exports.locationSlice.actions;
exports.default = exports.locationSlice.reducer;
// Utility function to reinitialize the slice with new config
const reinitializeLocationSlice = () => {
    return (0, toolkit_1.createSlice)({
        name: "location",
        initialState: createInitialState(),
        reducers: exports.locationSlice.caseReducers,
        extraReducers: addLocationExtraReducers,
    });
};
exports.reinitializeLocationSlice = reinitializeLocationSlice;
