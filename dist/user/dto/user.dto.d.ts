declare enum UserRole {
    ADMIN = "ADMIN",
    EDITOR = "EDITOR",
    VIEWER = "VIEWER"
}
export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    mobile: string;
    role: UserRole;
}
export declare class UpdateUserDto {
    username?: string;
    mobile?: string;
}
export declare class UserResponseDto {
    id: number;
    username: string;
    email: string;
    mobile: string;
    role: string;
    accessToken?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export {};
