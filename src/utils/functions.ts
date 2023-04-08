import { IUser } from "./interface";

export const getFullName = (user: Partial<IUser>) => {
    const { firstName, lastName } = user;
    return [firstName, lastName].filter(Boolean).join(" ");
};
