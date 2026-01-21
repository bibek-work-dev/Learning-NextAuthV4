export declare enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare class RegisterInput {
    name: string;
    email: string;
    password: string;
    role?: Role;
}
