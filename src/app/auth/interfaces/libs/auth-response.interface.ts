import { User } from "./user.interface";

export interface AuthResponseI {
    user:  User;
    token: string;
}

