import { StaffMember } from "./staffMember.model";

export interface ILocation {
  id: string;
  slug: string;
  name: string;
  logo: string;
  logoMime: string;
  color: string;
  staff?: StaffMember[];
}
