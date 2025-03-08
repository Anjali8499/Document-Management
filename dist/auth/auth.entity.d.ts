import { User } from '../user/user.entity';
export declare class UserSession {
    id: number;
    userId: number;
    user: User;
    token: string;
    isActive: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
