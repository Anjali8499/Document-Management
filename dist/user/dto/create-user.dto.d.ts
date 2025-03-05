export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    mobile: string;
    enum: ['ADMIN', 'EDITOR', 'VIEWER'];
    role: string;
}
