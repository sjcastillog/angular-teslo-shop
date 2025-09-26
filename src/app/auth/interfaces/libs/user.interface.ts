export interface User {
    id:       string;
    email:    string;
    fullName: string;
    isActive: boolean;
    roles:    string[];
}

export interface NewUserI{
    email:    string;
    fullName: string;
    password: string;
}

