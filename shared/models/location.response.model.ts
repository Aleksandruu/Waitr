import { StaffMember } from "./staffMember.model";

export interface ILocation {
  id: string;
  slug: string;
  name: string;
  logo?:
    | {
        type: "Buffer";
        data: number[] | Uint8Array;
      }
    | undefined;
  logoMime?: string;
  color?: string;
  staff?: StaffMember[];
}
