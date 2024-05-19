import Item from './Item';

describe('Item', () => {
  it('should create a new Item instance', () => {
    const item = new Item('1', 'category', 'name', 'description', 9.99);

    expect(item).toBeInstanceOf(Item);
    expect(item.id).toBe('1');
    expect(item.categoria).toBe('category');
    expect(item.nome).toBe('name');
    expect(item.descricao).toBe('description');
    expect(item.preco_unitario).toBe(9.99);
  });
});
