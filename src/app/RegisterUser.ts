import { User } from "./user";

export class RegisterUser {
    id: number;
    msg: string;
    ativo: boolean;
    user: User;
    dataConexao: Date;
    
    static decode(json: RegisterUserJSON): RegisterUser {
        let registerUser = Object.create(RegisterUser.prototype);
        return Object.assign(registerUser, json, {
            dataConexao: new Date(json.dataConexao)
        });
      }
}

interface RegisterUserJSON {
    id: number;
    ativo: boolean;
    user: User;
    dataConexao: string;
}