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
export {};
