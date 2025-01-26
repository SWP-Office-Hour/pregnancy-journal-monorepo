interface TokenDataType {
  id?: string;
  user_id: string;
  refresh_token: string;
  created_at?: Date;
  updated_at?: Date;
}

export class TokenDto {
  id?: string;
  user: string;
  refresh_token: string;
  created_at: Date;
  updated_at: Date;

  constructor(tokenData: TokenDataType) {
    this.user = tokenData.user_id;
    this.refresh_token = tokenData.refresh_token;
    this.created_at = tokenData.created_at || new Date();
    this.updated_at = tokenData.updated_at || new Date();
  }
}
