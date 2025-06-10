import { Expose } from 'class-transformer';

export class UserInfo {
  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Expose()
  userName: string;

  @Expose()
  roleName: string;

  @Expose()
  groupUserId: string;

  @Expose()
  tenantId: string;

  @Expose()
  darkMode: boolean;

  @Expose()
  profilePictureUrl: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
