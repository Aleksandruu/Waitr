export interface UpdateLocationSettingsDto {
  id?: string;
  slug: string;
  name: string;
  logo?: File;
  logoMime?: string;
  color?: string;
}
