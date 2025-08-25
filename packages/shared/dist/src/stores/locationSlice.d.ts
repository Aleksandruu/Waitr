import { PayloadAction } from "@reduxjs/toolkit";
import { FileBuffer } from "../types";
export interface LocationState {
    initialState?: LocationState;
    id: string;
    slug: string;
    name: string;
    color?: string;
    logoBuffer?: FileBuffer;
    logoMime?: string;
}
export interface LocationStorageAdapter {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export interface LocationColorHandler {
    applyColorVars(color: string): void;
}
export interface LocationJwtDecoder {
    decodeToken<T = any>(token: string): T;
}
export interface LocationSliceConfig {
    storageAdapter?: LocationStorageAdapter;
    colorHandler?: LocationColorHandler;
    jwtDecoder?: LocationJwtDecoder;
    apiMatchers?: {
        getLocationMatcher?: any;
        getLocationSettingsMatcher?: any;
    };
}
export declare const configureLocationSlice: (newConfig: LocationSliceConfig) => void;
export declare const locationSlice: import("@reduxjs/toolkit").Slice<LocationState, {
    setId(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    setSlug(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    setName(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    setColor(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    setLogoBuffer(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<FileBuffer | undefined>): void;
    setLogoMime(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    changeColorFromSettings(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    changeLogoBuffer(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<{
        type: "Buffer";
        data: number[] | Uint8Array;
    }>): void;
    changeLogoMime(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    saveInitialState(state: import("immer").WritableDraft<LocationState>): void;
    goBackToInitialState(state: import("immer").WritableDraft<LocationState>): void;
    updateLocation(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<Partial<LocationState>>): void;
    resetLocation(state: import("immer").WritableDraft<LocationState>): void;
}, "location", "location", import("@reduxjs/toolkit").SliceSelectors<LocationState>>;
export declare const locationActions: import("@reduxjs/toolkit").CaseReducerActions<{
    setId(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    setSlug(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    setName(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    setColor(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    setLogoBuffer(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<FileBuffer | undefined>): void;
    setLogoMime(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    changeColorFromSettings(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    changeLogoBuffer(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<{
        type: "Buffer";
        data: number[] | Uint8Array;
    }>): void;
    changeLogoMime(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>): void;
    saveInitialState(state: import("immer").WritableDraft<LocationState>): void;
    goBackToInitialState(state: import("immer").WritableDraft<LocationState>): void;
    updateLocation(state: import("immer").WritableDraft<LocationState>, action: PayloadAction<Partial<LocationState>>): void;
    resetLocation(state: import("immer").WritableDraft<LocationState>): void;
}, "location">;
declare const _default: import("redux").Reducer<LocationState>;
export default _default;
export declare const reinitializeLocationSlice: () => import("@reduxjs/toolkit").Slice<LocationState, {
    setId: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>) => void;
    setSlug: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>) => void;
    setName: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>) => void;
    setColor: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>) => void;
    setLogoBuffer: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<FileBuffer | undefined>) => void;
    setLogoMime: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>) => void;
    changeColorFromSettings: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>) => void;
    changeLogoBuffer: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<{
        type: "Buffer";
        data: number[] | Uint8Array;
    }>) => void;
    changeLogoMime: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<string>) => void;
    saveInitialState: (state: import("immer").WritableDraft<LocationState>) => void;
    goBackToInitialState: (state: import("immer").WritableDraft<LocationState>) => void;
    updateLocation: (state: import("immer").WritableDraft<LocationState>, action: PayloadAction<Partial<LocationState>>) => void;
    resetLocation: (state: import("immer").WritableDraft<LocationState>) => void;
}, "location", "location", import("@reduxjs/toolkit").SliceSelectors<LocationState>>;
//# sourceMappingURL=locationSlice.d.ts.map