export interface ILocation {
  id: string;
  slug: string;
  name: string;
  logo: string;
  logoMime: string;
  color: string;
  staff?: StaffMember[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
}

export interface ILocationForm {
  locationName: string;
  locationSlug: string;
  managerUsername: string;
  managerPassword: string;
}
