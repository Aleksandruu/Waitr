import { LocationStorageAdapter, LocationColorHandler, LocationJwtDecoder } from "../locationSlice";
export declare const createMobileStorageAdapter: (asyncStorage: any) => LocationStorageAdapter;
export declare const mobileColorHandler: LocationColorHandler;
export declare const mobileJwtDecoder: LocationJwtDecoder;
export interface AsyncLocationStorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
}
export declare const createAsyncMobileStorageAdapter: (asyncStorage: any) => AsyncLocationStorageAdapter;
//# sourceMappingURL=mobileLocationAdapter.d.ts.map