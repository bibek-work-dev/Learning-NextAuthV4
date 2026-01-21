import { Role } from '../input/register-user.input';
export declare class BaseResponseAuth {
    id: string;
    name: string;
    role: Role;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
