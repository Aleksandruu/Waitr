import { FileBuffer } from "../models/fileBuffer.model";
import { StaffMember } from "../models/staffMember.model";
export interface LocationResponseDto {
    id: string;
    slug: string;
    name: string;
    logo?: FileBuffer;
    logoMime?: string;
    color?: string;
    staff?: StaffMember[];
    active?: boolean;
}
//# sourceMappingURL=locationResponse.dto.d.ts.map