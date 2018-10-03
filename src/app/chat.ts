import { User } from "./user";

export class Chat {
    id: number;
    msg: string;
    user: User;
    userDestination: User;
    datePost: Date;
    
    static decode(json: ChatJSON): Chat {
        let chat = Object.create(Chat.prototype);
        return Object.assign(chat, json, {
            datePost: new Date(json.datePost)
        });
      }
}

interface ChatJSON {
    id: number;
    msg: string;
    user: User;
    userDestination: User;
    datePost: string;
}