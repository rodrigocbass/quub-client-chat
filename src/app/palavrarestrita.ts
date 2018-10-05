export class PalavraRestrita {
    id: number;
    descricao: string;

    static decode(json: PalavraRestritaJSON): PalavraRestrita {
        let palavraRestrita = Object.create(PalavraRestrita.prototype);
        return Object.assign(palavraRestrita, json, {});
      }
}

interface PalavraRestritaJSON {
    id: number;
    descricao: string;
}