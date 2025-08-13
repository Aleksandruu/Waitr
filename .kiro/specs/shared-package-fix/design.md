# Design Document

## Overview

The shared package fix involves restructuring the TypeScript configuration, fixing module resolution, and ensuring proper build order across the monorepo. The main issues identified are:

1. Incorrect TypeScript project references
2. Mixed module systems (CommonJS vs ESM)
3. Missing build dependencies
4. Inconsistent path resolution

## Architecture

### Package Structure

```
packages/shared/
├── src/                    # Source files (new structure)
│   ├── index.ts           # Main entry point
│   ├── types/             # Type definitions
│   ├── utils/             # Shared utilities
│   └── constants/         # Shared constants
├── assets/                # Static assets
├── dist/                  # Built output
├── package.json
└── tsconfig.json
```

### Module System Strategy

- **Shared Package**: Use CommonJS for maximum compatibility
- **Web App**: Continue using ESM
- **Mobile App**: Use CommonJS (React Native standard)
- **Backend**: Use CommonJS

### Build Order

1. Shared package builds first
2. All consuming applications build after shared package is ready

## Components and Interfaces

### TypeScript Configuration Updates

#### Base Configuration (`tsconfig.base.json`)

- Update path mappings to point to built output
- Add proper project references
- Ensure consistent module resolution

#### Shared Package (`packages/shared/tsconfig.json`)

- Configure as composite project
- Output to `dist/` directory
- Include all source files

#### Application Configurations

- Reference shared package as TypeScript project
- Use path mappings to resolve shared imports
- Ensure proper module resolution

### Package.json Updates

#### Shared Package

- Fix export mappings
- Add proper build scripts
- Configure as publishable package

#### Consuming Applications

- Update shared package dependency paths
- Add build dependencies where needed

## Data Models

### Export Structure

```typescript
// Main exports from shared package
export * from "./types";
export * from "./utils";
export * from "./constants";
export { SHARED_ASSETS } from "./assets";
```

### Import Patterns

```typescript
// In consuming applications
import { UserModel, OrderModel } from "shared";
import { SharedUtils } from "shared";
import type { ApiResponse } from "shared";
```

## Error Handling

### Build Failures

- Implement proper error messages for missing dependencies
- Add validation for TypeScript project references
- Ensure graceful fallback for missing shared package

### Runtime Issues

- Add runtime checks for shared utilities
- Provide fallbacks for missing assets
- Log warnings for deprecated imports

## Testing Strategy

### Build Verification

- Test that shared package builds successfully
- Verify all applications can import from shared package
- Test build order dependencies

### Integration Testing

- Test imports work in all environments (dev/prod)
- Verify asset paths resolve correctly
- Test TypeScript compilation across all projects

### Compatibility Testing

- Test with different Node.js versions
- Verify React Native compatibility
- Test web bundler compatibility (Vite, Webpack)
