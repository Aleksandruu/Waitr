import { Role } from "../../models/role.model";
export interface StaffMemberRequest {
    username: string;
    password: string;
    role: Role;
}
