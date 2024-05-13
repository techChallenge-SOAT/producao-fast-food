export default class Item {
  id: number;
  categoria: string;
  nome: string;
  descricao: string;
  preco_unitario: number;
  constructor(
    id: number,
    categoria: string,
    nome: string,
    descricao: string,
    preco_unitario: number,
  ) {
    this.id = id;
    this.categoria = categoria;
    this.nome = nome;
    this.descricao = descricao;
    this.preco_unitario = preco_unitario;
  }
}
