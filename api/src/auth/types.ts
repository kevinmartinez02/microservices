export interface UserRecord {
  id: number;
  username: string;
  passwordHash: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
}


