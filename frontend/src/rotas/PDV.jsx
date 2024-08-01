import "../rotas/PDV.css";
import dinhero from "../assets/img/dinheiro.png";
import agua from "../assets/img/agua.png";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SetaVoltar from "../components/SetaVoltar";
import SetaFechar from "../components/SetaFechar";
import { IoIosCloseCircle } from "react-icons/io";
import pix from "../assets/img/pix.png";
import dinheiro_pag from "../assets/img/dinheiro_pag.png";
import cartao from "../assets/img/cartao.png";

const PDV = () => {
  const [produto, setProduto] = useState("");
  const [unino, setUnino] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [dataHora, setDataHora] = useState(new Date());
  const [produtos, setProdutos] = useState([]);
  const [proximoPedido, setProximoPedido] = useState("");
  const navigate = useNavigate();
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
  const [modalPesquisaAberto, setModalPesquisaAberto] = useState(false);
  const [modalResumo, setModalResumo] = useState(false);
  const [resultadoPesquisaProduto, setResultadoPesquisaProduto] = useState("");
  const [pesquisaProduto, setPesquisaProduto] = useState("");
  const [insersaoManual, setInsersaoManual] = useState(false);
  const [kgacai, setKgacai] = useState("");
  const [precoacai, setPrecoAcai] = useState("");
  const [pesoBalanca, setPesoBalanca] = useState("");
  const [codigo_produto, setCodigo_Produto] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(0);
  const [sta, setSta] = useState("");
  const [modalCancelamento, setModalCancelamento] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [tipo, setTipo] = useState("");
  const [valor_recebido, setValor_Recebido] = useState("");
  const [status, setStatus] = useState("");
  const [pagamentos, setPagamentos] = useState([]);
  const [modalPreco_Recebido, setModalPreco_Recebido] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const [senha, setSenha] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [modalInserirProdto, setModalInserirProduto] = useState(false);
  const [modalAdicionarProdudoCel, setModalAdicionarProdudoCel] =
    useState(false);
  const [tabAtiva, setTabAtiva] = useState("produto");
  const [modalFinalizarPedidoCel, setModalFinalizarPedidoCel] = useState(false);
  const [modalKgAcaiCel, setModalKgAcaiCel] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const customStyles = {
    content: {
      width: windowSize.width <= 900 ? "75%" : "80%",
      height: windowSize.width <= 900 ? "20%" : "20%",
      margin: "auto",
      padding: 0,
      border: "1px solid #46295A",
    },
  };

  const { user } = userData || {};
  const abrirModalKgAcaiCel = () => {
    setModalKgAcaiCel(true);
  };

  const fecharModalKgAcaiCel = () => {
    setModalKgAcaiCel(false);
  };
  const abrirFinalizarPedidoCel = () => {
    setModalFinalizarPedidoCel(true);
  };

  const fecharFinalizarPedidoCel = () => {
    setModalFinalizarPedidoCel(false);
  };
  const abrirAdicionarProdudoCel = () => {
    setModalAdicionarProdudoCel(true);
  };

  const fecharAdicionarProdudoCel = () => {
    setTabAtiva("produto");
    setModalAdicionarProdudoCel(false);
  };

  const abrirModalInserirProduto = () => {
    setTabAtiva("produto");
    setModalInserirProduto(true);
    console.log("isso");
  };

  const abrirResumo = () => {
    setTabAtiva("resumo");
    setModalInserirProduto(false);
    console.log("foi");
  };

  const fecharModalInserirProduto = () => {
    setTabAtiva("resumo");
    setModalInserirProduto(false);
  };

  const abrirModalSenha = () => {
    setModalSenha(true);
  };
  const fecharModalSenha = () => {
    setModalSenha(false);
  };
  const abrirModalConfirmacao = () => {
    setModalConfirmacaoAberto(true);
  };

  const fecharModalConfirmacao = () => {
    setModalConfirmacaoAberto(false);
  };

  const abrirModalPesquisa = () => {
    setModalPesquisaAberto(true);
  };

  const fecharModalPesquisa = () => {
    setModalPesquisaAberto(false);
  };
  const fecharModalCancelamento = () => {
    setModalCancelamento(false);
  };
  const abrirModalCancelamento = () => {
    setModalCancelamento(true);
  };
  const fecharModalKgAcai = () => {
    setInsersaoManual(false);
  };
  const abrirModalRelatorio = () => {
    setModalResumo(true);
  };
  const fecharModalRelatorio = () => {
    setModalResumo(false);
  };
  const abrirModalPagamento = () => {
    setModalPagamento(true);
    setModalConfirmacaoAberto(false);
  };
  const fecharMosalPagamento = () => {
    setModalPagamento(false);
  };
  const abrirModalPreco_Recebido = (novoTipo) => {
    setModalPreco_Recebido(true);
    setTipo(novoTipo);
  };
  const fecharModalPreco_Recebido = () => {
    setModalPreco_Recebido(false);
    setTipo("");
    setValor_Recebido("");
  };
  const adicionaPagamento = () => {
    const novoPagamento = {
      tipo: tipo,
      valor_recebido: parseFloat(valor_recebido),
    };
    setPagamentos([...pagamentos, novoPagamento]);
    fecharModalPreco_Recebido();
    setTipo("");
    setValor_Recebido("");
  };

  const adicionarProduto = () => {
    if (produto && unino && precoUnitario) {
      if (
        (produto !== "1" && unino > parseFloat(quantidadeEstoque)) ||
        (produto === "1" && unino > parseFloat(quantidadeEstoque))
      ) {
        setNome("");
        setProduto("");
        setUnino("");
        setPrecoUnitario("");
        setCodigo_Produto("");
        toast.error("Produto sem estoque");
        return;
      }
      const novoProduto = {
        id: parseInt(produto),
        nome: nome,
        unino: parseFloat(unino),
        precoUnitario: parseFloat(precoUnitario),
      };

      setProdutos([...produtos, novoProduto]);
      setNome("");
      setProduto("");
      setUnino("");
      setPrecoUnitario("");
      setCodigo_Produto("");
      setKgacai("");
    }
  };

  const valorTotal = () => {
    let total = 0;
    produtos.forEach((produto) => {
      if (parseInt(produto.id) === 1) {
        total += produto.precoUnitario;
      } else {
        total += produto.precoUnitario * produto.unino;
      }
    });
    return total.toFixed(2);
  };
  const valorTotalCel = valorTotal();
  const valorRecebidoPagamento = () => {
    let total = 0;
    pagamentos.forEach((pagameto) => {
      total += pagameto.valor_recebido;
    });
    return total.toFixed(2);
  };
  const valorTroco = () => {
    const totalValorTotal = parseFloat(valorTotal());
    const totalValorRecebidoPagamento = parseFloat(valorRecebidoPagamento());
    const troco = totalValorRecebidoPagamento - totalValorTotal;

    return troco.toFixed(2);
  };
  const botaoLimpar = () => {
    setNome("");
    setProduto("");
    setUnino("");
    setPrecoUnitario("");
    setCodigo_Produto("");
  };
  const botaoInativdo = () => {
    const valorRecebido = parseFloat(valorRecebidoPagamento());
    const valorTrocoFalta = parseFloat(valorTotal());
    const inativo = parseFloat(valorTrocoFalta) <= parseFloat(valorRecebido);
    console.log(inativo);
    return inativo;
  };

  const botaoCancelar = async (e) => {
    e.preventDefault(e);
    if (produtos.length === 0) {
      toast.error("Impossível cancelar o pedido, nenhum produto adicionado.");
      fecharModalCancelamento();
      return;
    }
    if (pagamentos.length === 0) {
      toast.error(
        "Impossível cancelar o pedido, sem adicionar metodo de pagamento"
      );
    }

    try {
      const cancelarPedido = {
        pedido: {
          produtos: produtos.map((item) => ({
            pedido: proximoPedido.message,
            prodno: item.id,
            valor_unit: item.precoUnitario,
            unino: 0,
            nome: item.nome,
            sta: 0,
            userno: user && user.nome,
          })),
          pagamentos: pagamentos.map((item) => ({
            pedido: proximoPedido.message,
            tipo: item.tipo,
            status: 1,
            valor_recebido: item.valor_recebido,
          })),
        },
      };

      const res = await apiAcai.post("/ped", cancelarPedido);

      if (res.status === 200) {
        toast.success(res.data);
        navigate("/");
      }
    } catch (error) {
      console.log("Erro ao inserir produto no banco de dados");
    }
  };
  const liberarPedido = async (e) => {
    e.preventDefault();

    try {
      const usuarioCadastro = {
        operador_liberacao: user && user.id,
        pedido: proximoPedido.message,
        senha,
      };
      const res = await apiAcai.post("/liberacao", usuarioCadastro);
      if (res.status === 200) {
        setDisabled(false);
        setSenha("");
        toast.success("Pedido liberado para alteração");
        setModalSenha(false);
      }
    } catch (error) {
      setDisabled(false);
      toast.error("Usuário não é administrador ou senha incorreta");
    }
  };

  const botaoEnvio = async (e) => {
    e.preventDefault();
    if (produtos.length === 0) {
      toast.error("Impossível finalizar o pedido, nenhum produto adicionado.");
      fecharModalConfirmacao();
      return;
    }
    fecharModalConfirmacao();

    try {
      const inserirNovoPedido = {
        pedido: {
          produtos: produtos.map((item) => ({
            pedido: proximoPedido.message,
            prodno: item.id,
            valor_unit: item.precoUnitario,
            unino: item.unino,
            nome: item.nome,
            sta: 1,
            userno: user && user.nome,
          })),
          pagamentos: pagamentos.map((item) => ({
            pedido: proximoPedido.message,
            tipo: item.tipo,
            status: 0,
            valor_recebido: item.valor_recebido,
          })),
        },
      };

      const res = await apiAcai.post("/ped", inserirNovoPedido);

      if (res.status === 200) {
        toast.success(res.data);
        navigate("/");
      }
    } catch (error) {
      if (error.response.status === 500) {
        console.log("Erro ao inserir produto no banco de dados");
      }
    }
  };

  useEffect(() => {
    const tempo = setInterval(() => setDataHora(new Date()), 1000);

    return () => {
      clearInterval(tempo);
    };
  }, []);

  useEffect(() => {
    const carregarProximoPedido = async () => {
      try {
        const res = await apiAcai.get("/nextped");
        setProximoPedido(res.data);
        setPrecoAcai(res.data.valor);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarProximoPedido();
  }, []);

  const handlePesquisaProduto = async (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      try {
        const encodedPesquisaProduto = encodeURIComponent(pesquisaProduto);
        const res = await apiAcai.get(`/busca?nome=${encodedPesquisaProduto}`);

        setResultadoPesquisaProduto(res.data.message);
        console.log(res.data.message);
      } catch (error) {
        console.error("Erro ao encontrar produto:", error.message);
      }
    }
  };

  const handleProdutoSelecionado = (produtoSelecionado) => {
    if (produtoSelecionado.codigo_produto === 1) {
      abrirModalPesquisa(false);
      setInsersaoManual(true);
      setUnino(kgacai);
      setNome(produtoSelecionado.nome);
      setProduto(produtoSelecionado.codigo_produto);
      setQuantidadeEstoque(produto.quantidade);
    } else {
      abrirModalPesquisa(false);
      if (parseFloat(produtoSelecionado.quantidade) > 0) {
        setNome(produtoSelecionado.nome);
        setPrecoUnitario(produtoSelecionado.preco_custo);
        setProduto(produtoSelecionado.codigo_produto);
        setQuantidade(produtoSelecionado.quantidade);
        setQuantidadeEstoque(produto.quantidade);
      } else {
        setNome("");
        setPrecoUnitario("");
        setProduto("");
        toast.error("Produto sem estoque");
      }
    }

    setModalPesquisaAberto(false);
    setPesquisaProduto("");
  };
  const verificarCodigoProduto = async (codigo) => {
    try {
      if (parseInt(codigo) === 1) {
        setInsersaoManual(true);
        //setModalKgAcaiCel(true);
        setModalInserirProduto(false);
        setModalAdicionarProdudoCel(false);
        setCodigo_Produto(codigo);
        await carregandoEstoque(codigo);
      } else {
        const res = await apiAcai.get(`/produtoid?codigo_produto=${codigo}`);
        if (res.status === 200) {
          const produto = res.data[0];
          if (parseFloat(produto.quantidade) > 0) {
            setNome(produto.nome);
            setPrecoUnitario(produto.preco_custo);
            setProduto(produto.codigo_produto);
            setQuantidade(produto.quantidade);
            setQuantidadeEstoque(produto.quantidade);
            setModalAdicionarProdudoCel(true);
          } else {
            setNome("");
            setPrecoUnitario("");
            setProduto("");
            setUnino("");
            toast.error("Produto sem estoque");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const calculoKg = () => {
    let totalAcai = 0;
    let totalUnino = 0;
    totalAcai += (kgacai / 1000) * precoacai;
    totalUnino += kgacai / 1000;
    setPrecoUnitario(totalAcai);
    setUnino(totalUnino);
    setInsersaoManual(false);
    setModalKgAcaiCel(false);
    //setModalAdicionarProdudoCel(true);
  };

  const carregandoBalanca = async () => {
    try {
      const res = await apiAcai.get("/peso");
      setPesoBalanca(res.data.peso);
      setKgacai(res.data.peso);

      calculoBalanca();
    } catch (error) {
      console.log("Errooo", error);
    }
  };

  const calculoBalanca = () => {
    let totalAcaiBalaca = pesoBalanca * precoacai;
    setPrecoUnitario(totalAcaiBalaca);
  };

  const carregandoEstoque = async (codigo_produto) => {
    try {
      const res = await apiAcai.get(
        `/produtoid?codigo_produto=${codigo_produto}`
      );
      if (res.status === 200) {
        const produdoEsto = res.data[0];

        if (parseFloat(produdoEsto.quantidade) > 0) {
          setNome(produdoEsto.nome);
          setPrecoUnitario(produdoEsto.preco_custo);
          setQuantidadeEstoque(produdoEsto.quantidade);
          setCodigo_Produto(produdoEsto.codigo_produto);
        } else {
          setNome("");
          setPrecoUnitario("");
          setProduto("");
          toast.error("Produto sem estoque");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const data = dataHora.toLocaleDateString();
  const hora = dataHora.toLocaleTimeString();
  const removerProduto = (id) => {
    const novaListaProdutos = produtos.filter((produto) => produto.id !== id);
    setProdutos(novaListaProdutos);
  };
  useEffect(() => {}, [produtos]);

  return (
    <>
      <nav>
        <div className="seta">
          <SetaVoltar />
        </div>
        <h1>PONTO DE VENDA</h1>
      </nav>
      <header className="pedidos">
        <div className="container-1">
          <div className="pedido-n">
            <h2>Pedido #{proximoPedido.message}</h2>
            <h2>{dataHora.toLocaleString()}</h2>
          </div>
          <div className="linha"></div>
          <div className="pedido-n-n">
            <img src={dinhero} alt="" />
            <h2>R$ {valorTotal()}</h2>
          </div>
          <div className="cliente">
            <p>CLIENTE BALCAO</p>
          </div>
          <div className="finaliza">
            <div className="box-1">
              <input
                type="button"
                value="FINALIZAR"
                id="verde"
                onClick={abrirModalConfirmacao}
              />
              <Modal
                isOpen={modalConfirmacaoAberto}
                onRequestClose={fecharModalConfirmacao}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "50%",
                    height: "120px",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalConfirmacao} />
                  <h2>Confirmação de pedido</h2>
                </div>
                <div className="container-modal">
                  <h2>Deseja confirmar a finalização do pedido?</h2>
                  <div className="btn-modal">
                    <button onClick={abrirModalPagamento} className="verde">
                      Confirmar
                    </button>
                    <button
                      onClick={fecharModalConfirmacao}
                      className="vermelho"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal>
              <Modal
                isOpen={modalPagamento}
                onRequestClose={fecharMosalPagamento}
                style={{
                  content: {
                    maxWidth: "80%",
                    maxHeight: "100%",
                    margin: "auto",
                    padding: 0,
                    backgroundColor: "#f8f4f4",
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharMosalPagamento} />
                  <h2>Pagamento</h2>
                </div>
                <div className="flex_pagamento">
                  <div>
                    <div className="tabela_pagamento">
                      <table className="tabela_resumo tabela_pag">
                        <thead>
                          <tr>
                            <th className="thPDV">Código</th>
                            <th className="thPDV">Desc</th>
                            <th className="thPDV">Qtd</th>
                            <th className="thPDV">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {produtos.map((produto, index) => (
                            <tr key={produto.id ? produto.id : index}>
                              <td className="tdPDV">{produto.id}</td>
                              <td className="tdPDV">{produto.nome}</td>
                              <td className="tdPDV">{produto.unino}</td>
                              <td className="tdPDV">
                                R$
                                {parseInt(produto.id) === 1
                                  ? `$${produto.precoUnitario}`
                                  : `${produto.precoUnitario * produto.unino}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Modal
                      isOpen={modalPreco_Recebido}
                      onRequestClose={fecharModalPreco_Recebido}
                      contentLabel="Modal Produto Específico"
                      style={{
                        content: {
                          width: "50%",
                          height: "120px",
                          margin: "auto",
                          padding: 0,
                        },
                      }}
                    >
                      <div className="modal-mensagem">
                        <SetaFechar Click={fecharModalPreco_Recebido} />
                        <h2>Valor recebido por cliente</h2>
                      </div>
                      <div className="kg">
                        <label>Valor Recebido </label>
                        <input
                          type="number"
                          onChange={(e) => {
                            setValor_Recebido(e.target.value);
                          }}
                        />
                        <input
                          type="button"
                          value="Lançar Adicionar Valor"
                          className="botao-add"
                          onClick={() => {
                            adicionaPagamento();
                          }}
                        />
                      </div>
                    </Modal>
                    <div className="container-box">
                      <div
                        className="box"
                        onClick={() => abrirModalPreco_Recebido(0)}
                      >
                        <img src={pix} alt="" />
                        <p>PIX</p>
                      </div>
                      <div
                        className="box"
                        onClick={() => abrirModalPreco_Recebido(1)}
                      >
                        <img src={dinheiro_pag} alt="" />
                        <p>DINHEIRO</p>
                      </div>
                    </div>
                    <div className="container-box">
                      <div
                        className="box"
                        onClick={() => abrirModalPreco_Recebido(2)}
                      >
                        <img src={cartao} alt="" />
                        <p>
                          CARTÃO DE <br /> CRÉDITO
                        </p>
                      </div>
                      <div
                        className="box"
                        onClick={() => abrirModalPreco_Recebido(3)}
                      >
                        <img src={cartao} alt="" />
                        <p>
                          CARTÃO DE <br /> DEBITO
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="input-pagamento">
                    <label>Valor Total</label>
                    <input type="" value={valorTotal()} disabled />
                    <label>Valor Recebido</label>
                    <input type="" value={valorRecebidoPagamento()} disabled />
                    <label>Valor Troco</label>
                    <input type="" value={valorTroco()} disabled />
                    <div className="btn-pagamento">
                      <button
                        className="btn-finalizar"
                        onClick={botaoEnvio}
                        disabled={!botaoInativdo()}
                      >
                        Finalizar
                      </button>
                      <button
                        className="btn-cancelar-pagamento"
                        onClick={abrirModalCancelamento}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
              <Modal
                isOpen={modalCancelamento}
                onRequestClose={fecharModalCancelamento}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "50%",
                    height: "120px",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalCancelamento} />
                  <h2>Confirmação de cancelamento</h2>
                </div>
                <div className="container-modal">
                  <h2>Deseja cancelar o pedido?</h2>
                  <div className="btn-modal">
                    <button onClick={botaoCancelar} className="verde">
                      Confirmar
                    </button>
                    <button
                      onClick={fecharModalCancelamento}
                      className="vermelho"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal>
              <input
                type="button"
                value="RESUMO"
                onClick={abrirModalRelatorio}
              />
              <Modal
                isOpen={modalResumo}
                onRequestClose={fecharModalRelatorio}
                style={{
                  content: {
                    maxWidth: "70%",
                    minHeight: "95%",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalRelatorio} />
                  <h2>RESUMO</h2>
                </div>
                <div className="acai-flex">
                  <div className="flex-dados-1">
                    <p>AÇAI COPACABANA</p>
                    <br />
                    <p className="endereco">
                      Rua direta do Uruguai, N° 218 - Uruguai
                    </p>
                    <br />
                    <br />
                    <h2>CNPJ: 89.455.000/003-00</h2>
                    <h2>IE: </h2>
                  </div>
                  <div className="flex-dados-2">
                    <h2>{data}</h2>
                    <h2>{hora}</h2>
                    <h2>PED: {proximoPedido.message}</h2>
                  </div>
                </div>
                <hr style={{ border: "1px dashed #838383" }} />
                <br />
                <div className="flex-dados-1">
                  <p>CUPOM FISCAL</p>
                  <table className="tabela_resumo">
                    <thead>
                      <tr>
                        <th className="thPDV">CÓD</th>
                        <th className="thPDV">UNI</th>
                        <th className="thPDV">DESC</th>
                        <th className="thPDV">VALOR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtos.map((produto, index) => (
                        <tr key={produto.id ? produto.id : index}>
                          <td className="tdPDV">{produto.id}</td>
                          <td className="tdPDV">{produto.unino}</td>
                          <td className="tdPDV">{produto.nome}</td>
                          <td className="tdPDV">
                            R$
                            {parseInt(produto.id) === 1
                              ? `${produto.precoUnitario}`
                              : `${produto.precoUnitario * produto.unino}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br />
                </div>
                <hr style={{ border: "1px dashed #838383" }} />
                <div className="total">
                  <p>TOTAL R$ {valorTotal()}</p>
                </div>
                <hr style={{ border: "1px dashed #838383" }} />
                <div className="rodape">
                  <p>ESSE CUPOM NÃO TEM VALOR FISCAL</p>
                </div>
                <div className="rodape">
                  <p>Desenvolvido por www.celebreprojetos.com.br</p>
                </div>
              </Modal>
            </div>
            <div className="box-2">
              <input
                type="button"
                value="CANCELAR"
                id="vermelho"
                onClick={abrirModalCancelamento}
              />
              <Modal
                isOpen={modalCancelamento}
                onRequestClose={fecharModalCancelamento}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "50%",
                    height: "120px",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalCancelamento} />
                  <h2>Confirmação de cancelamento</h2>
                </div>
                <div className="container-modal">
                  <h2>Deseja cancelar o pedido?</h2>
                  <div className="btn-modal">
                    <button onClick={botaoCancelar} className="verde">
                      Confirmar
                    </button>
                    <button
                      onClick={fecharModalCancelamento}
                      className="vermelho"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal>
              <input
                type="button"
                value="PROCURAR PRODUTO"
                onClick={abrirModalPesquisa}
              />
              <Modal
                isOpen={modalPesquisaAberto}
                onRequestClose={fecharModalPesquisa}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "60%",
                    maxHeight: "100%",
                    margin: "auto",
                    padding: 0,
                    overflowX: "auto",
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalPesquisa} />
                  <h2>Digite o produto que deseja pesquisar</h2>
                </div>
                <div className="container-modal-produto">
                  <h2>Produto</h2>
                  <input
                    type="text"
                    value={pesquisaProduto}
                    onChange={(e) => {
                      setPesquisaProduto(e.target.value);
                    }}
                    onKeyPress={handlePesquisaProduto}
                  />
                </div>
                <ul className="produtos-pesquisa">
                  {Array.isArray(resultadoPesquisaProduto) ? (
                    resultadoPesquisaProduto.map((produto) => (
                      <li
                        key={produto.id}
                        onClick={() => handleProdutoSelecionado(produto)}
                      >
                        {produto.nome}
                      </li>
                    ))
                  ) : (
                    <li>Nenhum resultado encontrado</li>
                  )}
                </ul>
              </Modal>
            </div>
          </div>
        </div>
        <div className="container-2">
          <div className="box-produto">
            <form className="form-01">
              <div className="box-flex">
                <label>Produto</label>
                <input
                  required
                  type="number"
                  onChange={(e) => {
                    setProduto(e.target.value);
                    verificarCodigoProduto(e.target.value);
                    carregandoEstoque(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handlePesquisaProduto(e);
                      handleProdutoSelecionado(e);
                    }
                  }}
                  value={produto}
                />
                <Modal
                  isOpen={insersaoManual}
                  onRequestClose={fecharModalKgAcai}
                  contentLabel="Modal Produto Específico"
                  style={customStyles}
                >
                  <div className="modal-mensagem">
                    <SetaFechar Click={fecharModalKgAcai} />
                    <h2>Produto por peso</h2>
                  </div>
                  <div className="kg">
                    <label>Lançar grama</label>
                    <input
                      type="number"
                      onChange={(e) => {
                        setKgacai(e.target.value);
                      }}
                      value={kgacai}
                    />
                    <input
                      type="button"
                      value="Lançar peso"
                      className="botao-add"
                      onClick={() => {
                        carregandoBalanca();
                        calculoKg();
                      }}
                    />
                    <input
                      type="button"
                      value="Lançar Grama"
                      className="botao-add"
                      onClick={() => {
                        calculoKg();
                      }}
                    />
                  </div>
                </Modal>
                <Modal
                  isOpen={modalSenha}
                  onRequestClose={fecharModalSenha}
                  contentLabel="Modal Produto Específico"
                  style={{
                    content: {
                      width: "60%",
                      height: "120px",
                      margin: "auto",
                      padding: 0,
                    },
                  }}
                >
                  <div className="modal-mensagem">
                    <SetaFechar Click={fecharModalSenha} />
                    <h2>Liberação pedido manual</h2>
                  </div>
                  <div className="kg">
                    <label>Inserir senha do ADM</label>
                    <input
                      type="password"
                      onChange={(e) => {
                        setSenha(e.target.value);
                      }}
                      value={senha}
                    />
                    <input
                      type="button"
                      value="Enviar"
                      className="botao-add"
                      onClick={(e) => {
                        liberarPedido(e);
                      }}
                    />
                  </div>
                </Modal>
              </div>
              <div className="box-flex">
                <label>Quantidade</label>
                <input
                  type="number"
                  onChange={(e) => {
                    setUnino(e.target.value);
                  }}
                  value={produto === "1" ? kgacai : unino}
                  required
                />
              </div>
              <div className="box-flex">
                <label>Valor Unit.</label>
                <input
                  required
                  type="number"
                  value={precoUnitario}
                  onChange={(e) => setPrecoUnitario(e.target.value)}
                  disabled
                />
              </div>
            </form>
            <form className="form-01">
              <div className="box-flex">
                <label>Descrição</label>
                <div className="flex-desc">
                  <input
                    required
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled
                  />
                  <input
                    className="botao-add btn-pdv"
                    type="button"
                    value="+   Adicionar Produto"
                    onClick={adicionarProduto}
                  />
                  <input
                    type="button"
                    value="+   Limpar Produtos"
                    className="botao-add btn-pdv "
                    onClick={botaoLimpar}
                  />
                </div>
              </div>
            </form>
          </div>
          <table className="tabela_pdv">
            <thead>
              <tr>
                <th className="thPDV">ITEM</th>
                <th className="thPDV">QTD</th>
                <th className="thPDV">VALOR</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto, index) => (
                <tr key={index}>
                  <td className="tdPDV">{produto.nome}</td>
                  <td className="tdPDV">{produto.unino}</td>
                  <td className="tdPDV pdvFlex">
                    R$
                    {parseInt(produto.id) === 1
                      ? `${produto.precoUnitario}`
                      : `${produto.precoUnitario * produto.unino}`}
                    <IoIosCloseCircle
                      color="red"
                      size={30}
                      style={{ cursor: "pointer" }}
                      onClick={() => removerProduto(produto.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
      <div className="celular-tab">
        <h1
          onClick={abrirModalInserirProduto}
          className={tabAtiva === "produto" ? "tab-ativa" : ""}
        >
          Produto
        </h1>
        <h1
          onClick={abrirResumo}
          className={tabAtiva === "resumo" ? "tab-ativa" : ""}
        >
          Resumo
        </h1>
      </div>

      <div className="conteudo-tabs">
        {tabAtiva === "produto" && (
          <div className="inserir-produto-celular">
            <Modal
              isOpen={modalInserirProdto}
              onRequestClose={fecharModalInserirProduto}
              contentLabel="Modal Produto Específico"
              style={{
                content: {
                  width: "80%",
                  height: "150px",
                  margin: "auto",
                  padding: 0,
                  border: "1px solid #46295A",
                },
              }}
            >
              <div className="nav-modal-cel">
                <p>INSERIR PRODUTO</p>
                <IoIosCloseCircle
                  size={25}
                  nav-modal-cel
                  style={{
                    color: "red",
                  }}
                  onClick={() => {
                    fecharModalInserirProduto();
                  }}
                />
              </div>
              <div className="body-modal-cel">
                <label>Código</label>
                <input
                  type="number"
                  value={produto}
                  className="codigo-produto-cel"
                  onChange={(e) => {
                    setProduto(e.target.value);
                    verificarCodigoProduto(e.target.value);
                    carregandoEstoque(e.target.value);
                    //fecharModalInserirProduto(e);
                    //fecharModalKgAcai(e);
                  }}
                />
                <input
                  type="button"
                  value="Procurar por nome"
                  className="botao-add-cel"
                />
              </div>
            </Modal>
            <Modal
              isOpen={modalKgAcaiCel}
              onRequestClose={fecharModalKgAcaiCel}
              contentLabel="Modal Produto Específico"
              style={{
                content: {
                  width: "80%",
                  height: "150px",
                  margin: "auto",
                  padding: 0,
                  border: "1px solid #46295A",
                },
              }}
            >
              <div className="nav-modal-cel">
                <p>Produto por peso</p>
                <IoIosCloseCircle
                  size={25}
                  nav-modal-cel
                  style={{
                    color: "red",
                  }}
                  onClick={() => {
                    fecharModalKgAcaiCel();
                  }}
                />
              </div>
              <div className="body-modal-cel">
                <label>Digite a grama</label>
                <input
                  type="number"
                  onChange={(e) => {
                    setKgacai(e.target.value);
                  }}
                  onClick={calculoKg}
                />
              </div>
            </Modal>
            <Modal
              isOpen={modalAdicionarProdudoCel}
              onRequestClose={fecharAdicionarProdudoCel}
              contentLabel="Modal Produto Específico"
              style={{
                content: {
                  width: "80%",
                  height: "400px",
                  margin: "auto",
                  padding: 0,
                  border: "1px solid #46295A",
                },
              }}
            >
              <div className="container-add-produto-cel">
                <div className="modal-adicionar-produto">
                  <div className="borde-produto">
                    <p>{nome}</p>
                  </div>
                </div>
                <div className="input-cel-add">
                  <div className="box-cel">
                    <label>Quantidade</label>
                    <input
                      type="number"
                      value={produto === "1" ? kgacai : unino}
                      className="codigo-produto-add-cel"
                      onChange={(e) => {
                        setUnino(e.target.value);
                      }}
                    />
                  </div>
                  <div className="box-cel">
                    <label>Valor unitario</label>
                    <input
                      required
                      type="number"
                      className="codigo-produto-add-cel"
                      value={precoUnitario}
                      onChange={(e) => setPrecoUnitario(e.target.value)}
                      disabled
                    />
                  </div>
                  <input
                    type="button"
                    value="Adicionar"
                    className="botao-add-lista-cel"
                    onClick={() => {
                      adicionarProduto();
                      fecharModalInserirProduto();
                      fecharAdicionarProdudoCel();
                    }}
                  />
                </div>
              </div>
            </Modal>
          </div>
        )}

        {tabAtiva === "resumo" && (
          <div className="resumo-celular">
            <table className="tabela-cel-resumo">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, index) => (
                  <tr key={index}>
                    <td>{produto.nome}</td>
                    <td>{produto.unino}</td>
                    <td>
                      R$
                      {parseInt(produto.id) === 1
                        ? `${produto.precoUnitario}`
                        : `${produto.precoUnitario * produto.unino}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="total-pedido-cel">
          <p>TOTAL</p>
          <p>R$ {valorTotal()}</p>
        </div>
        <div className="container-cel">
          <input
            type="button"
            value="FINALIZAR PEDIDO"
            className="botao-finalizar-cel"
            onClick={abrirFinalizarPedidoCel}
          />
        </div>
        <Modal
          isOpen={modalFinalizarPedidoCel}
          onRequestClose={fecharAdicionarProdudoCel}
          style={{
            content: {
              width: "80%",
              height: "100%",
              padding: 0,
              margin: 0,
              backgroundColor: "#f8f4f4",
            },
          }}
        >
          <div className="modal-mensagem">
            <SetaFechar Click={fecharMosalPagamento} />
            <h2>Pagamento</h2>
          </div>
          <div className="flex_pagamento_cel">
            <div className="input-pagamento-cel">
              <div className="box-cel-pag">
                <label>Valor Total</label>
                <input type="" value={valorTotal()} disabled />
              </div>
              <div className="box-cel-pag">
                <label>Valor Pago</label>
                <input type="" value={valorRecebidoPagamento()} disabled />
              </div>
              <div className="box-cel-pag">
                <label>Valor Troco</label>
                <input type="" value={valorTroco()} disabled />
              </div>
            </div>
            <div>
              <Modal
                isOpen={modalPreco_Recebido}
                onRequestClose={fecharModalPreco_Recebido}
                contentLabel="Modal Produto Específico"
                style={customStyles}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalPreco_Recebido} />
                  <h2>Valor recebido por cliente</h2>
                </div>
                <div className="kg">
                  <label>Valor Recebido </label>
                  <input
                    type="number"
                    onChange={(e) => {
                      setValor_Recebido(e.target.value);
                    }}
                  />
                  <input
                    type="button"
                    value="Adicionar"
                    className="botao-add-cel"
                    onClick={() => {
                      adicionaPagamento();
                    }}
                  />
                </div>
              </Modal>

              <div className="container-box">
                <div
                  className="box-cel-p"
                  onClick={() => abrirModalPreco_Recebido(0)}
                >
                  <img src={pix} alt="" />
                  <p>PIX</p>
                </div>
                <div
                  className="box-cel-p"
                  onClick={() => abrirModalPreco_Recebido(1)}
                >
                  <img src={dinheiro_pag} alt="" />
                  <p>DINHEIRO</p>
                </div>
              </div>
              <div className="container-box">
                <div
                  className="box-cel-p"
                  onClick={() => abrirModalPreco_Recebido(2)}
                >
                  <img src={cartao} alt="" />
                  <p>
                    CARTÃO DE <br /> CRÉDITO
                  </p>
                </div>
                <div
                  className="box-cel-p"
                  onClick={() => abrirModalPreco_Recebido(3)}
                >
                  <img src={cartao} alt="" />
                  <p>
                    CARTÃO DE <br /> DEBITO
                  </p>
                </div>
              </div>
              <div className="btn-pagamento">
                <button
                  className="btn-finalizar"
                  onClick={botaoEnvio}
                  disabled={!botaoInativdo()}
                >
                  Finalizar
                </button>
                <button
                  className="btn-cancelar-pagamento"
                  onClick={botaoCancelar}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <footer>Software Licensiado pela Célebre </footer>
    </>
  );
};

export default PDV;
