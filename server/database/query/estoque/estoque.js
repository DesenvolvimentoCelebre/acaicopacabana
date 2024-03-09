inserir = ` insert into estoque (nome, categoria, data_compra, data_validade, quantidade, valor_compra) VALUES (?, ?, ?,? ,?, ?)`;

module.exports = {
    inserir,
}