import { FileBuffer } from "../models/fileBuffer.model";

export interface LocationModel {
  id: string;
  slug: string;
  name: string;
  logo?: FileBuffer;
  logo_mime?: string;
  color: string;
  active: boolean;
  tables: number;
}
