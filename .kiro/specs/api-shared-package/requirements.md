# Requirements Document

## Introduction

This feature involves refactoring the API layer from the web application to the shared package, enabling both web and mobile applications to use the same API logic. This will eliminate code duplication, ensure consistency across platforms, and provide a single source of truth for all API interactions.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to move the API folder from the web app to the shared package, so that both web and mobile applications can use the same API logic.

#### Acceptance Criteria

1. WHEN the API folder is moved to the shared package THEN all API files (baseApi.ts, adminApi.ts, authApi.ts, customerApi.ts, managerApi.ts, staffApi.ts, waiterApi.ts) SHALL be relocated to packages/shared/src/api/
2. WHEN the API is moved THEN the shared package SHALL export all API functions and hooks for consumption by both applications
3. WHEN the API is moved THEN the baseApi configuration SHALL be platform-agnostic and configurable for different environments

### Requirement 2

**User Story:** As a developer, I want all existing imports to be updated automatically, so that the web application continues to work without manual intervention.

#### Acceptance Criteria

1. WHEN API imports are updated THEN all files importing from "../api/" or similar relative paths SHALL be updated to import from "shared"
2. WHEN imports are updated THEN the store configuration SHALL be updated to use the API from the shared package
3. WHEN imports are updated THEN all Redux slices using API endpoints SHALL be updated to import from the shared package
4. WHEN imports are updated THEN all React components using API hooks SHALL be updated to import from the shared package

### Requirement 3

**User Story:** As a developer, I want the baseApi to be configurable for different platforms, so that web and mobile can use different configurations while sharing the same API logic.

#### Acceptance Criteria

1. WHEN baseApi is made configurable THEN it SHALL accept platform-specific configuration options (baseUrl, headers, etc.)
2. WHEN baseApi is configured THEN it SHALL support different authentication token retrieval methods for web and mobile
3. WHEN baseApi is configured THEN it SHALL maintain the same RTK Query functionality across platforms

### Requirement 4

**User Story:** As a developer, I want the shared package to properly export the API, so that it can be imported and used in both applications.

#### Acceptance Criteria

1. WHEN the shared package exports are updated THEN the main index.ts SHALL export all API modules
2. WHEN exports are configured THEN both individual API modules and the base API SHALL be available for import
3. WHEN exports are configured THEN all API hooks SHALL be available for direct import from the shared package

### Requirement 5

**User Story:** As a developer, I want to ensure the mobile app can use the shared API, so that both platforms have consistent API behavior.

#### Acceptance Criteria

1. WHEN the API is shared THEN the mobile application SHALL be able to import and use all API functions
2. WHEN the API is used in mobile THEN it SHALL work with React Native's networking capabilities
3. WHEN the API is used in mobile THEN it SHALL support the mobile app's authentication flow
