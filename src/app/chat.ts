import { User } from "./user";

export class Chat {
    id: number;
    msg: string;
    user: User;
    userDestination: User;
    datePost: Date;
}