export type AuthModuleOptions = {
  secret?: string;
};
export type Payload = {
  username: string;
  sub: number;
};

export type JWTDecodeValue = {
  iat: number;
  exp: number;
  iss?: string;
  aud?: string | string[];
} & Payload;
