export interface ILocation {
  id: string;
  slug: string;
  name: string;
  staffMembers?: StaffMember[];
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
}
