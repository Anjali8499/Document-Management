export declare function hashPassword(password: string): Promise<string>;
export declare function comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
