export interface User {
  id: string;
  username: string;
  role: string;
  location: string;
}

export interface StaffMemberRequest {
  username: string;
  password: string;
  role: string;
}
