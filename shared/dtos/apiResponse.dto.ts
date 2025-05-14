import { ApiError } from "../models/error.model";

export interface ApiSuccess<T = unknown> {
  data: T;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | { error: ApiError };
