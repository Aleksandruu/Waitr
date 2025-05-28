import { ApiError } from "../models/error.model";
export interface ApiSuccess<T = unknown> {
    data: T;
}
export type ApiResponse<T = unknown> = ApiSuccess<T> | {
    error: ApiError;
};
//# sourceMappingURL=apiResponse.dto.d.ts.map