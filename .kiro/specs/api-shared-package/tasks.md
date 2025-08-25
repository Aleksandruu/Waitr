# Implementation Plan

- [x] 1. Set up shared package API structure

  - Create the API directory structure in the shared package
  - Set up the base API configuration system with platform support
  - _Requirements: 1.1, 3.1, 3.2_

- [x] 2. Create configurable base API

  - Implement the createBaseApi function with platform-specific configuration
  - Support different authentication token retrieval methods for web and mobile
  - Maintain RTK Query functionality with configurable options
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Migrate API modules to shared package

  - [x] 3.1 Move baseApi.ts to shared package with configuration support

    - Copy baseApi.ts to packages/shared/src/api/
    - Refactor to use configuration-based approach
    - _Requirements: 1.1, 3.1_

  - [x] 3.2 Move adminApi.ts to shared package

    - Copy adminApi.ts to packages/shared/src/api/
    - Update imports to use shared baseApi
    - _Requirements: 1.1_

  - [x] 3.3 Move authApi.ts to shared package

    - Copy authApi.ts to packages/shared/src/api/
    - Update imports to use shared baseApi
    - _Requirements: 1.1_

  - [x] 3.4 Move customerApi.ts to shared package

    - Copy customerApi.ts to packages/shared/src/api/
    - Update imports to use shared baseApi
    - _Requirements: 1.1_

  - [x] 3.5 Move managerApi.ts to shared package

    - Copy managerApi.ts to packages/shared/src/api/
    - Update imports to use shared baseApi
    - _Requirements: 1.1_

  - [x] 3.6 Move staffApi.ts to shared package

    - Copy staffApi.ts to packages/shared/src/api/
    - Update imports to use shared baseApi
    - _Requirements: 1.1_

  - [x] 3.7 Move waiterApi.ts to shared package
    - Copy waiterApi.ts to packages/shared/src/api/
    - Update imports to use shared baseApi
    - _Requirements: 1.1_

- [x] 4. Create shared package API exports

  - Create packages/shared/src/api/index.ts with all API exports
  - Update packages/shared/src/index.ts to export API modules
  - _Requirements: 1.2, 4.1, 4.2, 4.3_

- [x] 5. Create web application API configuration

  - Create web-specific API configuration file
  - Configure baseApi with web-specific settings (environment variables, token retrieval)
  - _Requirements: 3.1, 3.2_

- [x] 6. Update web application store configuration

  - Update apps/waitr-web/src/store.ts to use shared API
  - Ensure Redux store integration works with new API structure
  - _Requirements: 2.2_

- [x] 7. Update Redux slice imports

  - [x] 7.1 Update Auth.slice.ts imports

    - Replace relative API imports with shared package imports
    - _Requirements: 2.3_

  - [x] 7.2 Update Customer.slice.ts imports

    - Replace relative API imports with shared package imports
    - _Requirements: 2.3_

  - [x] 7.3 Update Location.slice.ts imports

    - Replace relative API imports with shared package imports
    - _Requirements: 2.3_

  - [x] 7.4 Update Admin.slice.ts imports

    - Replace relative API imports with shared package imports
    - _Requirements: 2.3_

  - [x] 7.5 Update Waiter.slice.ts imports
    - Replace relative API imports with shared package imports
    - _Requirements: 2.3_

- [x] 8. Update React component imports

  - [x] 8.1 Update Login component imports

    - Replace API imports with shared package imports in Login.tsx
    - _Requirements: 2.1, 2.4_

  - [x] 8.2 Update Customer page component imports

    - Replace API imports with shared package imports in ProductsList.tsx, Payment.tsx, BottomBar.tsx
    - _Requirements: 2.1, 2.4_

  - [x] 8.3 Update Dashboard component imports

    - Replace API imports with shared package imports in Admin, Manager, Staff, and Waiter components
    - _Requirements: 2.1, 2.4_

  - [x] 8.4 Update route component imports
    - Replace API imports with shared package imports in route files
    - _Requirements: 2.1, 2.4_

- [x] 9. Remove old API files from web application

  - Delete the apps/waitr-web/src/api/ directory and all its contents
  - Verify no remaining references to old API files
  - _Requirements: 1.1_

- [x] 10. Create mobile application API configuration

  - Create mobile-specific API configuration in apps/waitr-mobile/
  - Configure baseApi with mobile-specific settings (AsyncStorage, React Native networking)
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 11. Test web application functionality

  - Verify all API calls work correctly after migration
  - Test authentication flow with new shared API
  - Test all CRUD operations across different user roles
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 12. Test mobile application integration
  - Verify mobile app can import and use shared API
  - Test mobile authentication flow with shared API
  - Validate cross-platform API consistency
  - _Requirements: 5.1, 5.2, 5.3_
