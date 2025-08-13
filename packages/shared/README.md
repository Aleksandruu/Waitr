# Shared Package

This package contains shared code, types, and utilities used across the Waitr monorepo applications (web, mobile, and backend).

## Structure

```
packages/shared/
├── src/
│   ├── index.ts           # Main entry point
│   ├── types/             # Type definitions and DTOs
│   ├── utils/             # Shared utility functions
│   ├── constants/         # Shared constants
│   ├── stores/            # Redux stores (future)
│   ├── hooks/             # React hooks (future)
│   └── components/        # Shared React components (future)
├── assets/                # Static assets (icons, images)
├── dist/                  # Built output
├── package.json
└── tsconfig.json
```

## Usage

### Basic Import

```typescript
import { UserModel, OrderModel, SharedUtils } from "shared";
```

### Specific Imports

```typescript
import { UserModel } from "shared/types";
import { SharedUtils } from "shared/utils";
import { API_ENDPOINTS } from "shared/constants";
```

## Adding New Shared Code

### Types

Add new types to `src/types/` and export them from `src/types/index.ts`.

### Utilities

Add new utility functions to `src/utils/` and export them from `src/utils/index.ts`.

### Constants

Add new constants to `src/constants/` and export them from `src/constants/index.ts`.

## Future Extensions

### Redux Stores

To add Redux stores:

1. Install Redux dependencies:

```bash
npm install @reduxjs/toolkit react-redux
```

2. Create store files in `src/stores/`:

```typescript
// src/stores/authStore.ts
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
```

3. Export from `src/stores/index.ts`:

```typescript
export * from "./authStore";
export { default as authReducer } from "./authStore";
```

4. Create a store configuration:

```typescript
// src/stores/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authStore";

export const createAppStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
```

### React Hooks

To add shared React hooks:

1. Create hook files in `src/hooks/`:

```typescript
// src/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../stores/store";
import { setUser } from "../stores/authStore";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const login = (userData: any) => {
    dispatch(setUser(userData));
  };

  return { user, login };
};
```

2. Export from `src/hooks/index.ts`:

```typescript
export * from "./useAuth";
```

### React Components

To add shared React components:

1. Create component files in `src/components/`:

```typescript
// src/components/Button/Button.tsx
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
}) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

2. Export from `src/components/index.ts`:

```typescript
export * from "./Button/Button";
```

## Building

```bash
npm run build
```

## Development

```bash
npm run dev  # Watch mode
```

## Notes

- The package is configured as a TypeScript composite project
- All consuming applications should reference this package in their TypeScript configuration
- The package supports both CommonJS and ESM imports
- Assets are accessible via the `SHARED_ASSETS` export
