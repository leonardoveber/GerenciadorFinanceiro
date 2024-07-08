import { Status } from "./status";

export class Valor {
  id?: number;
  valor: number;
  data: string;
  status: Status;
  descricao: string;
  imagem?: string;

  constructor(valor: number, data: string, descricao: string, status: Status, id?: number, imagem?: string) {
    this.valor = valor;
    this.data = data;
    this.descricao = descricao;
    this.status = status;
    this.id = id;
    this.imagem = imagem;
  }
}

