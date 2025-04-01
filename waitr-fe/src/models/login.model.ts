export interface Login {
  accessToken: string;
  user: {
    id: number;
    username: string;
    role: string;
    location: string;
  };
}
