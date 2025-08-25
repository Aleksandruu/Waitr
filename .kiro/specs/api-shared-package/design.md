# Design Document

## Overview

This design outlines the refactoring of the API layer from the web application to the shared package. The goal is to create a platform-agnostic API layer that can be used by both web and mobile applications while maintaining all existing functionality and ensuring seamless integration.

## Architecture

### Current Architecture

- API files located in `apps/waitr-web/src/api/`
- Direct imports from relative paths throughout the web application
- RTK Query configuration specific to web application
- Store integration tightly coupled to web app structure

### Target Architecture

- API files relocated to `packages/shared/src/api/`
- Centralized export from shared package
- Platform-configurable base API
- Consistent API interface across web and mobile platforms

## Components and Interfaces

### 1. Base API Configuration

**Location:** `packages/shared/src/api/baseApi.ts`

The base API will be refactored to accept configuration options:

```typescript
interface ApiConfig {
  baseUrl: string;
  getAuthToken: () => string | null;
  platform: "web" | "mobile";
}

export const createBaseApi = (config: ApiConfig) => {
  // RTK Query configuration with platform-specific settings
};
```

### 2. API Modules Structure

**Location:** `packages/shared/src/api/`

```
packages/shared/src/api/
├── baseApi.ts          # Configurable base API
├── adminApi.ts         # Admin-specific endpoints
├── authApi.ts          # Authentication endpoints
├── customerApi.ts      # Customer-facing endpoints
├── managerApi.ts       # Manager dashboard endpoints
├── staffApi.ts         # Staff/kitchen endpoints
├── waiterApi.ts        # Waiter dashboard endpoints
└── index.ts            # Centralized exports
```

### 3. Shared Package Exports

**Location:** `packages/shared/src/index.ts`

The main index file will be updated to export all API functionality:

```typescript
// Existing exports
export * from "./types";
export * from "./utils";
export * from "./constants";

// New API exports
export * from "./api";
```

### 4. Platform-Specific Configuration

**Web Application Configuration:**

```typescript
// apps/waitr-web/src/api/config.ts
import { createBaseApi } from "shared";
import { RootState } from "../store";

export const api = createBaseApi({
  baseUrl: import.meta.env.VITE_APP_API_URL,
  getAuthToken: (getState) => (getState() as RootState).auth.token,
  platform: "web",
});
```

**Mobile Application Configuration:**

```typescript
// apps/waitr-mobile/src/api/config.ts
import { createBaseApi } from "shared";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = createBaseApi({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  getAuthToken: async () => await AsyncStorage.getItem("authToken"),
  platform: "mobile",
});
```

## Data Models

### API Configuration Interface

```typescript
interface ApiConfig {
  baseUrl: string;
  getAuthToken: (() => string | null) | ((getState: any) => string | null);
  platform: "web" | "mobile";
  customHeaders?: Record<string, string>;
}
```

### Export Structure

```typescript
// From packages/shared/src/api/index.ts
export { createBaseApi } from "./baseApi";
export * from "./adminApi";
export * from "./authApi";
export * from "./customerApi";
export * from "./managerApi";
export * from "./staffApi";
export * from "./waiterApi";
```

## Error Handling

### Platform-Agnostic Error Handling

- Maintain existing RTK Query error handling patterns
- Ensure error responses work consistently across platforms
- Preserve existing error types and structures

### Migration Error Prevention

- Validate all import paths during migration
- Ensure no broken imports remain after refactoring
- Test API functionality after each module migration

## Testing Strategy

### Unit Testing

- Test API configuration creation for both platforms
- Verify all endpoints work with new shared structure
- Test error handling across platforms

### Integration Testing

- Verify web application continues to work after migration
- Test that mobile application can successfully use shared APIs
- Validate store integration remains functional

### Migration Testing

- Test each API module migration individually
- Verify imports are correctly updated
- Ensure no functionality is lost during migration

## Implementation Phases

### Phase 1: Prepare Shared Package Structure

1. Create API directory in shared package
2. Set up base API configuration system
3. Update shared package exports

### Phase 2: Migrate API Modules

1. Move baseApi.ts with configuration support
2. Move individual API modules (admin, auth, customer, etc.)
3. Update internal imports within API modules

### Phase 3: Update Web Application

1. Update store configuration
2. Update all component imports
3. Update Redux slice imports
4. Test web application functionality

### Phase 4: Enable Mobile Support

1. Create mobile API configuration
2. Test mobile application integration
3. Validate cross-platform compatibility

## Dependencies

### Existing Dependencies

- @reduxjs/toolkit (RTK Query)
- React (for web hooks)
- React Native (for mobile hooks)

### New Dependencies

- No new external dependencies required
- Maintain existing RTK Query patterns

## Migration Considerations

### Breaking Changes

- Import paths will change from relative to package imports
- Base API instantiation will require configuration

### Backward Compatibility

- Maintain all existing API hooks and functionality
- Preserve existing endpoint signatures
- Keep same Redux store integration patterns

### Risk Mitigation

- Migrate one API module at a time
- Test after each migration step
- Maintain rollback capability during migration
