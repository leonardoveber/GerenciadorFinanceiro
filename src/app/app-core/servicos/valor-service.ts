import { Injectable } from '@angular/core';
import {Valor} from "../model/valor";
import {Status} from "../model/status";
import Dexie from "dexie";


@Injectable({
  providedIn: 'root'
})
export class ValorService extends Dexie {
  valores: Dexie.Table<Valor,number>;

  constructor() {
    super('valorDB');
    this.version(1).stores({
      valores: '' +
        '++id, ' +
        'titulo, ' +
        'data, ' +
        'status, ' +
        'descricao, ' +
        'imagem',
    });
    this.valores = this.table('valores');
  }

  async adicionarValor(valor: Valor): Promise<number> {
    return await this.valores.add(valor);
  }

  async buscarValor(): Promise<Valor[]>{
    return await this.valores.toArray();
  }

  async removerValor(id:number): Promise<void>{
    return await this.valores.delete(id);
  }

  async atualizarValor(id: number, valor: Valor): Promise<number>{
    return await this.valores.update(id, valor);
  }
}
