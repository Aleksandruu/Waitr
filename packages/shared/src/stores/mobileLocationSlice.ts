import {
  configureLocationSlice,
  locationSlice,
  locationActions,
} from "./locationSlice";
import {
  createMobileStorageAdapter,
  mobileColorHandler,
  mobileJwtDecoder,
} from "./adapters/mobileLocationAdapter";

// Configure the location slice for mobile environment
export const configureMobileLocationSlice = (
  asyncStorage: any,
  apiMatchers?: {
    getLocationMatcher?: any;
    getLocationSettingsMatcher?: any;
  }
) => {
  configureLocationSlice({
    storageAdapter: createMobileStorageAdapter(asyncStorage),
    colorHandler: mobileColorHandler,
    jwtDecoder: mobileJwtDecoder,
    apiMatchers,
  });
};

// Re-export for convenience
export { locationSlice, locationActions };
export default locationSlice.reducer;
