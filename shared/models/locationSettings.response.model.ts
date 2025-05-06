import { FileBuffer } from "./fileBuffer.model";

export interface LocationSettingsResponse {
  id?: string;
  slug: string;
  name: string;
  logo?: FileBuffer;
  logoMime?: string;
  color: string;
}
