import {
  configureLocationSlice,
  locationSlice,
  locationActions,
} from "./locationSlice";
import {
  webStorageAdapter,
  webColorHandler,
  webJwtDecoder,
} from "./adapters/webLocationAdapter";

// Configure the location slice for web environment
export const configureWebLocationSlice = (apiMatchers?: {
  getLocationMatcher?: any;
  getLocationSettingsMatcher?: any;
}) => {
  configureLocationSlice({
    storageAdapter: webStorageAdapter,
    colorHandler: webColorHandler,
    jwtDecoder: webJwtDecoder,
    apiMatchers,
  });
};

// Re-export for convenience
export { locationSlice, locationActions };
export default locationSlice.reducer;
