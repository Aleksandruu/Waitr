export interface LocationSettingsResponse {
  id?: string;
  slug: string;
  name: string;
  logo?:
    | {
        type: "Buffer";
        data: number[] | Uint8Array;
      }
    | undefined;
  logoMime?: string;
  color: string;
}
