export interface JwtPayload {
  username: string;
  sub: number; // geralmente o "sub" representa o ID do usuário
}
