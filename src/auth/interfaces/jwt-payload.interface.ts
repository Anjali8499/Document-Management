/**
 * Interface representing the payload of a JWT token
 */
export interface JwtPayload {
  id: number;
  email: string;
  role: string;
} 