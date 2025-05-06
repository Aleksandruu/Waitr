import { FileBuffer } from "./fileBuffer.model";
import { StaffMember } from "./staffMember.model";

export interface ILocation {
  id: string;
  slug: string;
  name: string;
  logo?: FileBuffer;
  logoMime?: string;
  color?: string;
  staff?: StaffMember[];
}
