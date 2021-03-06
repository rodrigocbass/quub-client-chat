export class User {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    nickName: string;
    codAcesso: number;
    ipPublico: string;

    static decode(json: UserJSON): User {
        let user = Object.create(User.prototype);
        return Object.assign(user, json, {

        });
      }
}

interface UserJSON {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    nickName: string;
    ipPublico: string;
}