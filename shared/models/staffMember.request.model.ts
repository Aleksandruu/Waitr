import { Role } from "./role.model";

export interface StaffMemberRequest {
  username: string;
  password: string;
  role: Role;
}
