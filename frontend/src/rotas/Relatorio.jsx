import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useState } from "react";
import Modal from "react-modal";
import SetaFechar from "../components/SetaFechar";
import apiAcai from "../axios/config";
import axios from "axios";
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
const Flex = styled.div`
  display: flex;
`;
const ContainerFlex = styled.div`
  background-image: url(${imgFundo});
  background-repeat: no-repeat;
  background-position: center;
`;
const Linha = styled.div`
  width: 50%;
  height: 1px;
  background-color: #1c1c1c;
`;
const CabecalhoFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;

  p {
    font-size: 28px;
  }
`;
const CabecalhoRel = styled.div`
  margin: 30px;
  h3 {
    text-align: center;
    font-size: 28px;
    font-weight: normal;
  }
  h4 {
    margin-left: 5px;
    font-size: 28px;
    font-weight: normal;
  }
`;

const Tabela = styled.table`
  width: 95%;
  border-collapse: collapse;
  border: none;
  table-layout: fixed;
  margin: auto;
  margin-top: 70px;

  th,
  td {
    border: none;
    padding: 8px;
    text-align: center;
  }
  td {
    border-bottom: 2px solid #9582a1;
    color: #261136;
    font-weight: 900;
    font-size: 20px;
  }
  th {
    background-color: #46295a;
    color: #fff;
  }
  td img {
    margin-top: 10px;
    width: 35%;
  }
  tr:hover {
    cursor: pointer;
    background-color: #aea2b5;
  }
`;

const Relatorio = () => {
  const [modalNPedido, setModalNPedido] = useState(false);
  const [modalRelPedido, setModalRelPedido] = useState(false);
  const [modalVendaLan, setModalVendaLan] = useState(false);
  const [modalVendaLanRel, setModalVendaLanRel] = useState(false);
  const [dataHora, setDataHora] = useState(new Date());
  const [data_inicial, setData_Inicial] = useState("");
  const [data_final, setData_Final] = useState("");
  const [pedido, setPedido] = useState("");
  const [pedidoRes, setPedidoRes] = useState([]);
  const [vendasRel, setVendasRel] = useState([]);
  const [vendasCanceladasRel, setVendasCanceladasRel] = useState([]);
  const [vendasCanceladas, setVendasCanceladas] = useState(false);
  const [modalDataCancelado, setModalDataCancelado] = useState(false);
  const [pagamentoRel, setPagamentoRel] = useState([]);
  const [modalPedidoPagamento, setModalPedidoPagamento] = useState(false);
  const [pagamentoPedidoRel, setPagamentoPedidoRel] = useState(false);

  const data = dataHora.toLocaleDateString();
  const hora = dataHora.toLocaleTimeString();
  const abrirNPedidoCancelado = () => {
    setModalPedidoPagamento(true);
  };
  const fecharNPedidoCancelado = () => {
    setModalPedidoPagamento(false);
  };
  const abrirModalPagamento = () => {
    setPagamentoPedidoRel(true);
  };
  const fecharModalPagamento = () => {
    setPagamentoPedidoRel(false);
  };
  const abrirNPedido = () => {
    setModalNPedido(true);
  };
  const fecharNPedido = () => {
    setModalNPedido(false);
  };
  const abrirModalRelPedido = () => {
    setModalRelPedido(true);
  };
  const fecharModalRelPedido = () => {
    setModalRelPedido(false);
  };

  const abrirVendaLan = () => {
    setModalVendaLan(true);
  };

  const fecharVendaLan = () => {
    setModalVendaLan(false);
  };
  const abrirVendaLanRel = () => {
    setModalVendaLanRel(true);
  };
  const fecharVendaLanRel = () => {
    setModalVendaLanRel(false);
  };
  const abrirDataCancelados = () => {
    setModalDataCancelado(true);
  };
  const fecharDataCancelados = () => {
    setModalDataCancelado(false);
  };
  const abrirVendasCancelas = () => {
    setVendasCanceladas(true);
  };
  const fecharVendasCanceladas = () => {
    setVendasCanceladas(false);
  };

  const relatorioPedido = async (pedido) => {
    try {
      const res = await apiAcai.get(`/lvendas?pedido=${pedido}`);
      if (res.status === 200) {
        setPedidoRes(res.data);
        fecharNPedido();
        abrirModalRelPedido();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const relatorioPagamento = async (pedido) => {
    try {
      const res = await apiAcai.get(`/dvendas?pedido=${pedido}`);
      if (res.status === 200) {
        setPagamentoRel(res.data);
        fecharNPedidoCancelado();
        abrirModalPagamento();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const relatorioVendas = async () => {
    try {
      const dataInicialFormatada = data_inicial.split("/").reverse().join("-");
      const dataFinalFormatada = data_final.split("/").reverse().join("-");
      const res = await apiAcai.get(
        `/rvendas?data_inicial=${dataInicialFormatada}&data_final=${dataFinalFormatada}`
      );
      if (res.status === 200) {
        setVendasRel(res.data);
        fecharVendaLan();
        abrirVendaLanRel();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const relatorioCancelados = async () => {
    try {
      const dataInicialFormatada = data_inicial.split("/").reverse().join("-");
      const dataFinalFormatada = data_final.split("/").reverse().join("-");
      const res = await apiAcai.get(
        `/cvendas?data_inicial=${dataInicialFormatada}&data_final=${dataFinalFormatada}`
      );
      if (res.status === 200) {
        console.log(res.data);
        setVendasCanceladasRel(res.data);
        fecharDataCancelados();
        abrirVendasCancelas();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar />
        <ContainerFlex>
          <Tabela>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={abrirNPedido}>
                <td>
                  <p>01</p>
                </td>
                <td>
                  <p>RELATÓRIO DETALHADO DO PEDIDO</p>
                </td>
              </tr>
              <tr onClick={abrirVendaLan}>
                <td>
                  <p>02</p>
                </td>
                <td>
                  <p>RELATÓRIO DE VENDAS LANÇADAS</p>
                </td>
              </tr>
              <tr onClick={abrirDataCancelados}>
                <td>
                  <p>03</p>
                </td>
                <td>
                  <p>PEDIDOS CANCELADOS</p>
                </td>
              </tr>
              <tr onClick={abrirNPedidoCancelado}>
                <td>
                  <p>04</p>
                </td>
                <td>
                  <p>DETALHAMENTO DO PAGAMENTO POR PEDIDO</p>
                </td>
              </tr>
            </tbody>
          </Tabela>
          <Modal
            isOpen={modalNPedido}
            onRequestClose={fecharNPedido}
            contentLabel="Modal Preço"
            style={{
              content: {
                maxWidth: "60%",
                height: "15%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharNPedido} />
              <h2>Pesquisa por pedido</h2>
            </div>
            <div className="kg">
              <label>Nº do Pedido</label>
              <input
                type="number"
                onChange={(e) => {
                  setPedido(e.target.value);
                }}
              />
              <input
                type="button"
                value="Pesquisar Produto"
                className="botao-add"
                onClick={() => {
                  relatorioPedido(pedido);
                }}
              />
            </div>
          </Modal>
          <Modal
            isOpen={modalRelPedido}
            onRequestClose={fecharModalRelPedido}
            style={{
              content: {
                minWidth: "70%",
                minHeight: "60%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharModalRelPedido} />
              <h2>RELATÓRIO DETALHADO DO PEDIDO</h2>
            </div>
            <CabecalhoRel>
              <h3>Açai copacabama - Ucsal</h3>
              <h4>{data}</h4>
              <CabecalhoFlex>
                <p>{hora}</p>
                <p>(ADM SYS)</p>
                <Linha />
                <p>System version 1.0.0</p>
              </CabecalhoFlex>

              <p style={{ fontSize: "22px" }}>RELATÓRIO DETALHADO DO PEDIDO</p>
            </CabecalhoRel>
            <table className="tabela_resumo">
              <thead>
                <tr>
                  <th className="thPDV">Pedido</th>
                  <th className="thPDV">Produto</th>
                  <th className="thPDV">Saldo</th>
                  <th className="thPDV">Valor</th>
                  <th className="thPDV">Data Venda</th>
                </tr>
              </thead>
              <tbody>
                {pedidoRes.map((pedido) => (
                  <tr key={pedido.pedido}>
                    <td className="tdPDV">{pedido.pedido}</td>
                    <td className="tdPDV">{pedido.nome}</td>
                    <td className="tdPDV">{pedido.unino}</td>
                    <td className="tdPDV">R$ {pedido.valor_unit}</td>
                    <td className="tdPDV">{pedido.data_venda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>
          <Modal
            isOpen={modalVendaLan}
            onRequestClose={fecharVendaLan}
            contentLabel="Modal Preço"
            style={{
              content: {
                maxWidth: "30%",
                maxHeight: "36%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem modal-vendas">
              <SetaFechar Click={fecharVendaLan} />
              <h2>Pesquisar por vendas</h2>
            </div>
            <div className="kg flex-vendas">
              <label>Data Inicial</label>
              <input
                type="date"
                onChange={(e) => {
                  setData_Inicial(e.target.value);
                }}
              />
              <label>Data Final</label>
              <input
                type="date"
                onChange={(e) => {
                  setData_Final(e.target.value);
                }}
              />

              <input
                type="button"
                value="Pesquisar Venda"
                className="botao-add"
                onClick={() => {
                  relatorioVendas();
                }}
              />
            </div>
          </Modal>

          <Modal
            isOpen={modalVendaLanRel}
            onRequestClose={fecharVendaLanRel}
            style={{
              content: {
                minWidth: "70%",
                minHeight: "60%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharVendaLanRel} />
              <h2>RELATÓRIO DETALHADO DE VENDAS</h2>
            </div>
            <CabecalhoRel>
              <h3>Açai copacabama - Ucsal</h3>
              <h4>{data}</h4>
              <CabecalhoFlex>
                <p>{hora}</p>
                <p>(ADM SYS)</p>
                <Linha />
                <p>System version 1.0.0</p>
              </CabecalhoFlex>

              <p style={{ fontSize: "22px" }}>RELATÓRIO DE VENDAS LANÇADAS</p>
            </CabecalhoRel>
            <table className="tabela_resumo">
              <thead>
                <tr>
                  <th className="thPDV">Pedido</th>
                  <th className="thPDV">Valor Total</th>
                  <th className="thPDV">Data da Venda</th>
                  <th className="thPDV">Operador</th>
                  <th className="thPDV">Status</th>
                </tr>
              </thead>
              <tbody>
                {vendasRel.map((venda) => (
                  <tr key={venda.pedido}>
                    <td className="tdPDV">{venda.pedido}</td>
                    <td className="tdPDV">{venda.total}</td>
                    <td className="tdPDV">{venda.data_venda}</td>
                    <td className="tdPDV">{venda.operador}</td>
                    <td className="tdPDV">{venda.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>

          <Modal
            isOpen={modalVendaLan}
            onRequestClose={fecharVendaLan}
            contentLabel="Modal Preço"
            style={{
              content: {
                maxWidth: "30%",
                maxHeight: "36%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem modal-vendas">
              <SetaFechar Click={fecharVendaLan} />
              <h2>Pesquisar por vendas</h2>
            </div>
            <div className="kg flex-vendas">
              <label>Data Inicial</label>
              <input
                type="date"
                onChange={(e) => {
                  setData_Inicial(e.target.value);
                }}
              />
              <label>Data Final</label>
              <input
                type="date"
                onChange={(e) => {
                  setData_Final(e.target.value);
                }}
              />

              <input
                type="button"
                value="Pesquisar Venda"
                className="botao-add"
                onClick={() => {
                  relatorioVendas();
                }}
              />
            </div>
          </Modal>

          <Modal
            isOpen={modalDataCancelado}
            onRequestClose={fecharDataCancelados}
            style={{
              content: {
                maxWidth: "30%",
                maxHeight: "36%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem modal-vendas">
              <SetaFechar Click={fecharDataCancelados} />
              <h2>Pesquisar por cancelado</h2>
            </div>
            <div className="kg flex-vendas">
              <label>Data Inicial</label>
              <input
                type="date"
                onChange={(e) => {
                  setData_Inicial(e.target.value);
                }}
              />
              <label>Data Final</label>
              <input
                type="date"
                onChange={(e) => {
                  setData_Final(e.target.value);
                }}
              />
              <input
                type="button"
                value="Pesquisar Venda"
                className="botao-add"
                onClick={() => {
                  relatorioCancelados();
                }}
              />
            </div>
          </Modal>

          <Modal
            isOpen={vendasCanceladas}
            onRequestClose={fecharVendasCanceladas}
            style={{
              content: {
                minWidth: "70%",
                minHeight: "60%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharVendasCanceladas} />
              <h2>RELATÓRIO PEDIDOS CANCELADOS</h2>
            </div>
            <CabecalhoRel>
              <h3>Açai copacabama - Ucsal</h3>
              <h4>{data}</h4>
              <CabecalhoFlex>
                <p>{hora}</p>
                <p>(ADM SYS)</p>
                <Linha />
                <p>System version 1.0.0</p>
              </CabecalhoFlex>

              <p style={{ fontSize: "22px" }}>RELATÓRIO PEDIDOS CANCELADOS</p>
            </CabecalhoRel>
            <table className="tabela_resumo">
              <thead>
                <tr>
                  <th className="thPDV">Pedido</th>
                  <th className="thPDV">Valor Total</th>
                  <th className="thPDV">Data da Venda</th>
                  <th className="thPDV">Operador</th>
                  <th className="thPDV">Status</th>
                </tr>
              </thead>
              <tbody>
                {vendasCanceladasRel.map((venda) => (
                  <tr key={venda.pedido}>
                    <td className="tdPDV">{venda.pedido}</td>
                    <td className="tdPDV">{venda.total}</td>
                    <td className="tdPDV">{venda.data_venda}</td>
                    <td className="tdPDV">{venda.operador}</td>
                    <td className="tdPDV">{venda.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>

          <Modal
            isOpen={modalPedidoPagamento}
            onRequestClose={fecharNPedidoCancelado}
            contentLabel="Modal Preço"
            style={{
              content: {
                maxWidth: "60%",
                height: "15%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharNPedidoCancelado} />
              <h2>Pesquisa por pedido</h2>
            </div>
            <div className="kg">
              <label>Nº do Pedido</label>
              <input
                type="number"
                onChange={(e) => {
                  setPedido(e.target.value);
                }}
              />
              <input
                type="button"
                value="Pesquisar Pedido"
                className="botao-add"
                onClick={() => {
                  relatorioPagamento(pedido);
                }}
              />
            </div>
          </Modal>
          <Modal
            isOpen={pagamentoPedidoRel}
            onRequestClose={fecharModalPagamento}
            style={{
              content: {
                minWidth: "70%",
                minHeight: "60%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharModalPagamento} />
              <h2>RELATÓRIO DETALHADO DO PAGAMENTO POR PEDIDO</h2>
            </div>
            <CabecalhoRel>
              <h3>Açai copacabama - Ucsal</h3>
              <h4>{data}</h4>
              <CabecalhoFlex>
                <p>{hora}</p>
                <p>(ADM SYS)</p>
                <Linha />
                <p>System version 1.0.0</p>
              </CabecalhoFlex>

              <p style={{ fontSize: "22px" }}>RELATÓRIO DETALHADO </p>
            </CabecalhoRel>
            <table className="tabela_resumo">
              <thead>
                <tr>
                  <th className="thPDV">Operador</th>
                  <th className="thPDV">Pagamento</th>
                  <th className="thPDV">Pedido</th>
                  <th className="thPDV">Recebido</th>
                  <th className="thPDV">Status</th>
                </tr>
              </thead>
              <tbody>
                {pagamentoRel.map((pedido) => (
                  <tr key={pedido.pedido}>
                    <td className="tdPDV">{pedido.Operador}</td>
                    <td className="tdPDV">{pedido.Pagamento}</td>
                    <td className="tdPDV">{pedido.Pedido}</td>
                    <td className="tdPDV">R$ {pedido.Recebido}</td>
                    <td className="tdPDV">{pedido.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>
        </ContainerFlex>
      </Flex>
    </>
  );
};
export default Relatorio;
