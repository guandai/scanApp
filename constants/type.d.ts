export enum UserRolesEnum {
    worker = "worker",
    admin = "admin"
}
export type UserAttributes = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRolesEnum;
};

export type LoginUserReq = Pick<UserAttributes, 'email' | 'password'>;

export type LoginUserRes = {
    token: string;
    userId: number;
    userRole: UserRolesEnum;
};

