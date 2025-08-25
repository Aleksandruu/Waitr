"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationActions = exports.locationSlice = exports.configureWebLocationSlice = void 0;
const locationSlice_1 = require("./locationSlice");
Object.defineProperty(exports, "locationSlice", { enumerable: true, get: function () { return locationSlice_1.locationSlice; } });
Object.defineProperty(exports, "locationActions", { enumerable: true, get: function () { return locationSlice_1.locationActions; } });
const webLocationAdapter_1 = require("./adapters/webLocationAdapter");
// Configure the location slice for web environment
const configureWebLocationSlice = (apiMatchers) => {
    (0, locationSlice_1.configureLocationSlice)({
        storageAdapter: webLocationAdapter_1.webStorageAdapter,
        colorHandler: webLocationAdapter_1.webColorHandler,
        jwtDecoder: webLocationAdapter_1.webJwtDecoder,
        apiMatchers,
    });
};
exports.configureWebLocationSlice = configureWebLocationSlice;
exports.default = locationSlice_1.locationSlice.reducer;
