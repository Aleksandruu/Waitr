import { Role } from "../models/role.model";
export interface UserModel {
    id: string;
    username: string;
    password?: string;
    role: Role;
    location_id: string;
}
//# sourceMappingURL=user.model.d.ts.map