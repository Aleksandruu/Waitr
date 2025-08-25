"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationActions = exports.locationSlice = exports.configureMobileLocationSlice = void 0;
const locationSlice_1 = require("./locationSlice");
Object.defineProperty(exports, "locationSlice", { enumerable: true, get: function () { return locationSlice_1.locationSlice; } });
Object.defineProperty(exports, "locationActions", { enumerable: true, get: function () { return locationSlice_1.locationActions; } });
const mobileLocationAdapter_1 = require("./adapters/mobileLocationAdapter");
// Configure the location slice for mobile environment
const configureMobileLocationSlice = (asyncStorage, apiMatchers) => {
    (0, locationSlice_1.configureLocationSlice)({
        storageAdapter: (0, mobileLocationAdapter_1.createMobileStorageAdapter)(asyncStorage),
        colorHandler: mobileLocationAdapter_1.mobileColorHandler,
        jwtDecoder: mobileLocationAdapter_1.mobileJwtDecoder,
        apiMatchers,
    });
};
exports.configureMobileLocationSlice = configureMobileLocationSlice;
exports.default = locationSlice_1.locationSlice.reducer;
