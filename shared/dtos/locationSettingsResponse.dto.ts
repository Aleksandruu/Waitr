import { FileBuffer } from "../models/fileBuffer.model";

export interface LocationSettingsDto {
  id?: string;
  slug: string;
  name: string;
  logo?: FileBuffer;
  logoMime?: string;
  color: string;
}
