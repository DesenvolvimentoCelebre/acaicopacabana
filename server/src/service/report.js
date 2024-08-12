const  pool  = require('../database/connection');

async function findVendasByPedido(pedido) {
  try {
    const query = `
      SELECT
        pedno.pedido,
        produto.nome,
        pedno.unino,
        pedno.valor_unit,
        DATE_FORMAT(pedno.data_fechamento, "%d/%m/%Y") as data_venda,
        pedno.userno as Operador
      FROM 
        pedno
      INNER JOIN
        produto
      ON
        pedno.prodno = produto.codigo_produto
      WHERE
        pedno.pedido = ?
    `;
    const [results] = await pool.query(query, [pedido]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao buscar vendas por pedido:', error);
    return { success: false, error: 'Entre em contato com administrador' };
  }
}

async function findVendasPorIntervaloDatas(data_inicial, data_final) {
  try {
    const query = `
    SELECT
	pedno.pedido,
	pay.valor_pedido as total,
	userno as operador,
	DATE_FORMAT(pedno.data_fechamento, "%d/%m/%Y") as data_venda,
CASE
	WHEN pedno.sta = 1 THEN 'Vendido'
  WHEN pedno.sta = 0 THEN 'Cancelado'
	ELSE 'cancelado'
END as status
FROM
	pedno
INNER JOIN
	produto
ON
	pedno.prodno = produto.codigo_produto
INNER JOIN
  pay
ON
  pedno.pedido = pay.pedido
WHERE
	pedno.data_fechamento BETWEEN ? AND ?
GROUP BY 
	pedno.pedido,
    pedno.userno,
    DATE_FORMAT(pedno.data_fechamento, "%d/%m/%Y"),
    pedno.sta;`;
    const [results] = await pool.query(query, [data_inicial, data_final]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao buscar vendas por intervalo de datas:', error);
    return { success: false, error: ['Erro no sistema, contate o administrador', error], details: error };
  }
}

async function findVendasPorIntervaloDatasCancelados (data_inicial, data_final) {
  try {
    const query = `
    SELECT
      pedno.pedido,
      pay.valor_pedido as total,
      userno as operador,
      DATE_FORMAT(pedno.data_fechamento, "%d/%m/%Y") as data_venda,
    CASE
      WHEN pedno.sta = 1 THEN 'Vendido'
      WHEN pedno.sta = 0 THEN 'Cancelado'
      ELSE 'cancelado'
    END as status
    FROM
      pedno
    INNER JOIN
      produto
    ON
      pedno.prodno = produto.codigo_produto
    INNER JOIN
      pay
    ON
      pedno.pedido = pay.pedido
    WHERE
      pedno.data_fechamento BETWEEN ? AND ?
    AND pedno.sta = 0
    GROUP BY 
      pedno.pedido,
    pedno.userno,
    DATE_FORMAT(pedno.data_fechamento, "%d/%m/%Y"),
    pedno.sta;
    `;
    const [results] = await pool.query(query, [data_inicial, data_final]);
    return { success: true, data: results};
  } catch (error) {
    console.error('Erro ao buscar pedidos cancelados', error);
    return { success: false, error: ['Erro no sistema, contate o administrador']}
  }
}

async function detailsPagamento (pedido) {
  try {
    const query = `
  SELECT
    pedidos.pedido as Pedido,
    pay.valor_recebido as Recebido,
  CASE
    WHEN pay.tipo = 0 THEN 'Pix'
    WHEN pay.tipo = 1 THEN 'Dinheiro'
    WHEN pay.tipo = 2 THEN 'Crédito'
    WHEN pay.tipo = 3 THEN 'Débito'
    WHEN pay.tipo = 4 THEN 'Cancelado'
    ELSE 'Desconhecido, entre contato com administrador'
  END as Pagamento,
    pedidos.userno as Operador,
  CASE
    WHEN pay.status = 0 THEN 'Cancelado'
    WHEN pay.status = 1 THEN 'Vendido'
    ELSE 'Entrar em contato com administrador'
  END as status
  FROM 
    pedidos
  INNER JOIN
    pay
  ON
    pedidos.pedido = pay.pedido
  WHERE
    pedidos.pedido = ?
  `
  const [results] = await pool.query(query, [pedido]);
  return { success: true, data: results}
  } catch (error) {
    console.error('Erro ao buscar pedidos cancelados', error);
    return { success: false, error: ['Erro no sistema, contate o administrador']};
  }
}

module.exports = {
  findVendasByPedido,
  findVendasPorIntervaloDatas,
  findVendasPorIntervaloDatasCancelados,
  detailsPagamento
};
