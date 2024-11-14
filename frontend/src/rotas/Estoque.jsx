import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useState, useEffect, useRef } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import SetaFechar from "../components/SetaFechar";
import { MdDelete } from "react-icons/md";

import { MdAddCircleOutline } from "react-icons/md";


import Switch from "react-switch";
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
const NavBar = styled.nav`
  margin: auto;
  height: 80px;
  margin-top: 5px;
  width: 95%;
  background-color: #46295a;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 10px;
`;
const Flex = styled.div`
  display: flex;
`;
const ContainerFlex = styled.div`
  background-image: url(${imgFundo});
  background-repeat: no-repeat;
  background-position: center;
`;

const InputPesquisa = styled.input`
  min-width: 25%;
  border-radius: 10px;
  height: 50px;
  padding-left: 10px;
  margin-left: 45px;
  border: none;
  font-size: 20px;
`;

const InputButao = styled.input`
  min-width: 19%;
  border-radius: 10px;
  height: 50px;
  padding-left: 10px;
  border: none;
  color: #5f387a;
  font-size: 30px;
  font-weight: 800;
  cursor: pointer;
`;
const ModalCadastroProduto = styled.div`
  background-color: #46295a;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  gap: 35%;
  align-items: center;
  margin-bottom: 40px;
  width: 100%;

  h2 {
    font-size: 25px;
    color: #f3eef7;
    text-align: center;
    margin-left: 10px;
    font-weight: 900;
    cursor: pointer;
  }
`;
const Form = styled.div`
  display: flex;
  align-items: center;


  input,
  label {
    margin: 5px 20px;
    height: 25px;
    max-width: 700px;
    color: #46295a;
    font-weight: 700;
    font-size: 20px;
  }
  input {
    height: 45px;
    padding-left: 10px;
    border-radius: 20px;
    border: 1px solid #290d3c;
  }
  .img-produto {
    width: 600px;
  }
`;
const FormAdd = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;


  input,
  label {
    margin: 5px 20px;
    height: 25px;
    max-width: 700px;
    color: #46295a;
    font-weight: 700;
    font-size: 20px;
  }
  input {
    height: 45px;
    padding-left: 10px;
    border-radius: 20px;
    border: 1px solid #290d3c;
  }
  .img-produto {
    width: 600px;
  }
`;
const Form1 = styled.div`
  display: flex;
  flex-direction: column;
`;
const ButaoEnvioProduto = styled.div`
  display: flex;
  margin-top: 1.5%;
  justify-content: center;
  input {
    background-color: #46295a;
    color: #f3eef7;
    padding: 15px 50px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 20px;
    cursor: pointer;
  }
  input:hover {
    background-color: #8b43bb;
    border: none;
    transition: 1s;
  }
`;
const SelectEstilizado = styled.select`
  margin-left: 20px;
  width: 280px;
  height: 45px;
  padding-left: 10px;
  border-radius: 20px;
  border: 1px solid #290d3c;
  color: #46295a;
  font-weight: 700;
  font-size: 20px;
  margin-right: 25px;
`;

const OptionEstilizado = styled.option`
  color: #46295a;
  font-weight: 700;
  font-size: 20px;
`;

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(0);
  const [preco_custo, setPreco_Custo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [codigo_produto, setCodigo_Produto] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [estoqueRed, setEstoqueRed] = useState("");
  const [estoqueYellow, setEstoqueYellow] = useState("");
  const [estoqueBlue, setEstoqueBlue] = useState("");
  const [modalAdd, setMoldalAdd] = useState(false);
  const [bit, setBit] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [modalQuantidade, setModalQuantidade] = useState("");
  const quantidadeRef = useRef(null);
  const valorRef = useRef(null);
  const [deletarProduto, setDeletarProduto] = useState("");
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [preco_compra, setPreco_compra] = useState("");
  const [modalAddProduto, setModalAddProduto] = useState("");
  //const [img_produto, setImg_produto] = useState(null);
  //const userData = JSON.parse(localStorage.getItem("user"));
  const abrirModalAddProduto = () => {
    setModalAddProduto(true);
  };
  const fecharModalAddProduto = () => {
    setModalAddProduto(false);
  };

  //const [img_produto, setImg_produto] = useState(null);
  //const userData = JSON.parse(localStorage.getItem("user"));


  const abrirModalConfirmacao = () => {
    setModalConfirmacao(true);
  };
  const fecharModalConfirmacao = () => {
    setModalConfirmacao(false);
  };
  useEffect(() => {
    const carregarEstoque = async () => {
      try {
        const res = await apiAcai.get("/estoque");
        setProdutos(res.data);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarEstoque();
  }, []);

  useEffect(() => {
    const carregandoRed = async () => {
      try {
        const res = await apiAcai.get("/red");

        setEstoqueRed(res.data[0].val);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoRed();
  }, []);

  useEffect(() => {
    const carregandoYellow = async () => {
      try {
        const res = await apiAcai.get("/yellow");

        setEstoqueYellow(res.data[0].val);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoYellow();
  }, []);
  useEffect(() => {
    const carregandoBlue = async () => {
      try {
        const res = await apiAcai.get("/blue");
        console.log("Sucesso", res.data[0].val);
        setEstoqueBlue(res.data[0].val);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoBlue();
  }, []);
  const valorModalAdd = (
    quantidade,
    codigo_produto,
    bit,
    preco_custo,
    nome,
    categoria
  ) => {
    if (parseInt(bit) === 1) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
    console.log("teste-bit", bit);
    setQuantidade(quantidade);
    setModalQuantidade(quantidade);
    setCodigo_Produto(codigo_produto);
    setPreco_Custo(preco_custo);
    setCategoria(categoria);
    setNome(nome);
    console.log(nome);
    setBit(bit);
    setMoldalAdd(true);
  };

  const valorModalAddSaldo = (
    quantidade,
    codigo_produto,
    bit,
    preco_custo,
    nome,
    categoria
  ) => {
    if (parseInt(bit) === 1) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
    console.log("teste-bit", bit);
    setQuantidade(quantidade);
    setModalQuantidade(quantidade);
    setCodigo_Produto(codigo_produto);
    setPreco_Custo(preco_custo);
    setCategoria(categoria);
    setNome(nome);
    console.log(nome);
    setBit(bit);
    setModalAddProduto(true);
  };
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
  `;

  const adicionarEstoque = async (e) => {
    console.log("clique");
    e.preventDefault();
    try {
      setEnviando(true);
      const produtoEditado = {
        codigo_produto,
        quantidade: modalQuantidade,
        preco_custo: preco_custo,
        bit,
        nome,
        categoria,
      };
      const res = await apiAcai.put("/attestoque", produtoEditado);
      if (res.status === 201) {
        toast.success(res.data.message[0]);
        fecharModalAdd();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEnviando(false);
    }
  };
  const fecharModalAdd = () => {
    setMoldalAdd(false);
  };
  const Status = styled.div`
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin: auto;
    background: ${({ quantidade }) => {
      const red = parseInt(estoqueRed);
      //const yellow = parseInt(estoqueYellow);
      const blue = parseInt(estoqueBlue);
      if (quantidade <= red) {
        return "red";
      } else if (quantidade >= blue) {
        return "green";
      } else if (quantidade > red && quantidade < blue) {
        return "yellow";
      }
    }};
  `;

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };
  const cadastrarProduto = async (e) => {
    e.preventDefault(e);
    //console.log("Imagem:", img_produto);
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("categoria", categoria);
    formData.append("preco_custo", preco_custo);
    formData.append("quantidade", quantidade);
    formData.append("preco_compra", preco_compra);
    //formData.append("img_produto", img_produto);
    formData.append("tipo", 1);

    try {
      setEnviando(true);
      const produtosEnviados = {
        nome: nome,
        categoria: categoria,
        preco_custo: preco_custo,
        preco_compra: preco_compra,
        quantidade: quantidade,
        tipo: 1,
      };
      const res = await apiAcai.post("/produto", produtosEnviados);

      if (res.status === 201) {
        console.log(res, nome, quantidade, preco_custo, categoria);
        toast.success(res.data.message);
        window.location.reload();
        fecharModal();
      }
    } catch (error) {
      console.log("Erro", error);
    } finally {
      setEnviando(false);
    }
  };
  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value);
  };

  const filteredEstoque = pesquisa
    ? produtos.data?.filter((produto) => {
        return produto.nome?.toLowerCase().includes(pesquisa.toLowerCase());
      })
    : produtos.data;

  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    setBit(checked ? 1 : 0);
  };

  const botaoDeleteProduto = async (codigo_produto) => {
    try {
      setDeletarProduto(codigo_produto);
      const produtoDelete = {
        id: codigo_produto,
      };
      const token = localStorage.getItem("token");
      const res = await apiAcai.delete(
        "/dell",
        { data: produtoDelete },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200 && res.data.success) {
        toast.success("Produto deletado com sucesso");
        setModalConfirmacao(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Por favor entrar em contato com admistrador do sistema");
    }
  };
  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar />
        <ContainerFlex>
          <NavBar>
            <InputPesquisa
              type="search"
              placeholder="Digite o nome do produto"
              value={pesquisa}
              onChange={handlePesquisaChange}
            />
            <InputButao type="button" onClick={abrirModal} value="+  Produto" />
            <Modal
              isOpen={modalAberto}
              onRequestClose={fecharModal}
              style={{
                content: {
                  borderRadius: "15px",
                  width: "70%",
                  maxHeight: "62%",
                  margin: "auto",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                },
              }}
            >
              <ModalCadastroProduto>
                <SetaFechar Click={fecharModal} />
                <h2>Cadastro de produto</h2>
              </ModalCadastroProduto>
              <form onSubmit={(e) => cadastrarProduto(e)}>
                <Form>
                  <Form1>
                    <label>Nome</label>
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </Form1>
                  <Form1>
                    <label>Categoria</label>
                    <SelectEstilizado
                      value={categoria}
                      onChange={(e) => setCategoria(parseInt(e.target.value))}
                    >
                      <OptionEstilizado value={0}>Quilo</OptionEstilizado>
                      <OptionEstilizado value={1}>Quantidade</OptionEstilizado>
                    </SelectEstilizado>
                  </Form1>
                </Form>
                <Form>
                  <Form1>
                    <label>Valor de Venda</label>
                    <input
                      type="number"
                      placeholder="Nome do produto"
                      value={preco_custo}
                      onChange={(e) => setPreco_Custo(e.target.value)}
                      required
                    />
                  </Form1>
                  <Form1>
                    <label>{categoria === 0 ? "Quilo" : "Quantidade"}</label>
                    <input
                      type="number"
                      placeholder={`${
                        categoria === 0
                          ? "Quantidade em quilos"
                          : "Quantidade de produto"
                      }`}
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      required
                    />
                  </Form1>
                </Form>
                {/*
                <Form>
                  <Form1>
                    <label>Imagem do Produto</label>
                    
                    <input
                      className="img-produto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImg_produto(e.target.files[0])}
                      required
                    />
                    
                  </Form1> 
                </Form>
                */}
                <Form>
                  <Form1>
                    <label>Preço de Custo</label>
                    <input
                      type="text"
                      placeholder="Preço de custo"
                      value={preco_compra}
                      onChange={(e) => setPreco_compra(e.target.value)}
                      required
                    />
                  </Form1>
                </Form>
                <ButaoEnvioProduto>
                  {enviando ? (
                    "Aguarde..."
                  ) : (
                    <input
                      type="submit"
                      value="Adicionar produto"
                      disabled={enviando}
                    />
                  )}
                </ButaoEnvioProduto>
              </form>
            </Modal>
          </NavBar>
          <Tabela>
            <thead>
              <tr>
                <th>Número do Produto</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Monitor</th>
                <th>Saldo</th>
                <th>Preço</th>
                <th>Editar Produto</th>
                <th>Adicionar Saldo</th>

                <th>Status</th>
                <th>Excluir Produdo</th>
              </tr>
            </thead>
            {!filteredEstoque || filteredEstoque.length === 0 ? (
              <p>Nenhum produto cadastrado</p>
            ) : (
              filteredEstoque.map((produto) => (
                <tbody key={produto.codigo_produto}>
                  <tr>
                    <td>
                      <p>{produto.codigo_produto}</p>
                    </td>
                    <td>
                      <p>{produto.nome}</p>
                    </td>
                    <td>
                      {Number(produto.categoria) === 0 ? "Quilo" : "Quantidade"}
                    </td>
                    <td>
                      <Status
                        quantidade={produto.quantidade}
                        estoqueRed={estoqueRed}
                        estoqueYellow={estoqueYellow}
                        estoqueBlue={estoqueBlue}
                      ></Status>
                    </td>
                    <td>
                      <p>{produto.quantidade}</p>
                    </td>
                    <td>R$ {produto.preco_custo}</td>
                    <td>
                      <HiOutlinePencilSquare
                        onClick={() =>
                          valorModalAdd(
                            produto.quantidade,
                            produto.codigo_produto,
                            produto.bit,
                            produto.preco_custo,
                            produto.nome,
                            produto.categoria
                          )
                        }
                        color="#46295a"
                        size={30}
                        style={{ cursor: "pointer" }}
                      />
                      <Modal
                        isOpen={modalAdd}
                        onRequestClose={fecharModalAdd}
                        style={{
                          content: {
                            maxWidth: "50%",
                            maxHeight: "60%",
                            margin: "auto",
                            padding: 0,
                          },
                        }}
                      >
                        <div className="modal-mensagem margin-msg">
                          <SetaFechar Click={fecharModalAdd} />
                          <h2>Editar Produto</h2>
                        </div>
                        <Form>
                          <Form1>
                            <label>Código</label>
                            <input
                              type="number"
                              onChange={(e) => {
                                setCodigo_Produto(e.target.value);
                              }}
                              value={codigo_produto}
                              disabled
                            />
                          </Form1>
                          <Form1>
                            <label>Nome</label>
                            <input
                              type="text"
                              onChange={(e) => {
                                setNome(e.target.value);
                              }}
                              value={nome}
                            />
                          </Form1>
                        </Form>
                        <Form>
                          <Form1>
                            <label>Preço de Venda</label>
                            <input
                              ref={quantidadeRef}
                              type="number"
                              placeholder="Valor do produto"
                              value={preco_custo}
                              onChange={(e) => {
                                setPreco_Custo(e.target.value);
                                setTimeout(() => {
                                  quantidadeRef.current.focus();
                                }, 0);
                              }}
                            />
                          </Form1>
                          <Form1>
                            <label>Preço de Custo</label>
                            <input
                              disabled
                              ref={valorRef}
                              type="number"
                              placeholder="Quantidade de produto"
                              value={modalQuantidade}
                              onChange={(e) => {
                                setModalQuantidade(e.target.value);
                                setTimeout(() => {
                                  valorRef.current.focus();
                                }, 0);
                              }}
                            />
                          </Form1>
                        </Form>
                        <Form>
                          <Form1>
                            <label>Categoria</label>
                            <SelectEstilizado
                              value={categoria}
                              onChange={(e) =>
                                setCategoria(parseInt(e.target.value))
                              }
                            >
                              <OptionEstilizado value={0}>
                                Quilo
                              </OptionEstilizado>
                              <OptionEstilizado value={1}>
                                Quantidade
                              </OptionEstilizado>
                            </SelectEstilizado>
                          </Form1>
                          <Form1>
                            <label>Ativar/Inativar</label>

                            <Switch
                              onChange={handleSwitchChange}
                              checked={isChecked}
                              onColor="#46295a"
                              onHandleColor="#593471"
                              handleDiameter={30}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                              height={20}
                              width={48}
                            />
                          </Form1>
                        </Form>
                        <ButaoEnvioProduto>
                          {enviando ? (
                            "Aguarde..."
                          ) : (
                            <input
                              type="submit"
                              value="Salvar"
                              disabled={enviando}
                              onClick={(e) => {
                                adicionarEstoque(e);
                              }}
                            />
                          )}
                        </ButaoEnvioProduto>
                        <div className="kg kg-estoque"></div>
                      </Modal>
                    </td>

                    <td>
                      <MdAddCircleOutline
                        onClick={() =>
                          valorModalAddSaldo(
                            produto.quantidade,
                            produto.codigo_produto,
                            produto.bit,
                            produto.preco_custo,
                            produto.nome,
                            produto.categoria
                          )
                        }
                        color="#46295a"
                        size={30}
                        style={{ cursor: "pointer" }}
                      />
                      <Modal
                        isOpen={modalAddProduto}
                        onRequestClose={fecharModalAddProduto}
                        style={{
                          content: {
                            maxWidth: "50%",
                            maxHeight: "60%",
                            margin: "auto",
                            padding: 0,
                          },
                        }}
                      >
                        <div className="modal-mensagem margin-msg">
                          <SetaFechar Click={fecharModalAddProduto} />
                          <h2>Adicionar Produto</h2>
                        </div>
                        <FormAdd>
                          <Form1>
                            <label>Código</label>
                            <input
                              type="number"
                              onChange={(e) => {
                                setCodigo_Produto(e.target.value);
                              }}
                              value={codigo_produto}
                              disabled
                            />
                          </Form1>
                          <Form1>
                            <label>Descrição do produto</label>
                            <input
                              disabled
                              type="text"
                              onChange={(e) => {
                                setNome(e.target.value);
                              }}
                              value={nome}
                            />
                          </Form1>
                        </FormAdd>
                        <FormAdd>
                          <Form1>
                            <label>Preço de Custo</label>
                            <input
                              ref={quantidadeRef}
                              type="number"
                              placeholder="Valor do produto"
                              value={preco_custo}
                              onChange={(e) => {
                                setPreco_Custo(e.target.value);
                                setTimeout(() => {
                                  quantidadeRef.current.focus();
                                }, 0);
                              }}
                            />
                          </Form1>
                          <Form1>
                            <label>Saldo</label>
                            <input
                              ref={valorRef}
                              type="number"
                              placeholder="Quantidade de produto"
                              value={modalQuantidade}
                              onChange={(e) => {
                                setModalQuantidade(e.target.value);
                                setTimeout(() => {
                                  valorRef.current.focus();
                                }, 0);
                              }}
                            />
                          </Form1>
                        </FormAdd>
                        <FormAdd>
                          <Form1>
                            <label>Fornecedor</label>
                            <input
                              type="text"
                              onChange={(e) => {
                                setNome(e.target.value);
                              }}
                            />
                          </Form1>
                        </FormAdd>
                        <ButaoEnvioProduto>
                          {enviando ? (
                            "Aguarde..."
                          ) : (
                            <input
                              type="submit"
                              value="Salvar"
                              disabled={enviando}
                              onClick={(e) => {
                                adicionarEstoque(e);
                              }}
                            />
                          )}
                        </ButaoEnvioProduto>
                      </Modal>
                    </td>
                    <td>{produto.bit === 0 ? "Ativo" : "Inativo"}</td>
                    <td>
                      <span style={{ cursor: "pointer" }}>
                        <MdDelete
                          color="#46295a"
                          onClick={() =>
                            abrirModalConfirmacao(produto.codigo_produto)
                          }
                        />
                      </span>
                      <Modal
                        isOpen={modalConfirmacao}
                        onRequestClose={fecharModalConfirmacao}
                        contentLabel="Confirmar Pedido"
                        style={{
                          content: {
                            width: "70%",
                            height: "120px",
                            margin: "auto",
                            padding: 0,
                          },
                        }}
                      >

                        <div className="modal-mensagem">
                          <SetaFechar Click={fecharModalConfirmacao} />
                          <h2>Confirmação de exlusão</h2>
                        </div>
                        <div className="modal-mensagem margin-msg">
                          <SetaFechar Click={fecharModalAdd} />
                          <h2>Adicionar Estoque</h2>
                        </div>
                        <Form>
                          <Form1>
                            <label>Código</label>
                            <input
                              type="number"
                              onChange={(e) => {
                                setCodigo_Produto(e.target.value);
                              }}
                              value={codigo_produto}
                              disabled
                            />
                          </Form1>
                          <Form1>
                            <label>Nome</label>
                            <input
                              type="text"
                              onChange={(e) => {
                                setNome(e.target.value);
                              }}
                              value={nome}
                            />
                          </Form1>
                        </Form>
                        <Form>
                          <Form1>
                            <label>Preço de Venda</label>
                            <input
                              disabled
                              ref={quantidadeRef}
                              type="number"
                              placeholder="Valor do produto"
                              value={preco_custo}
                              onChange={(e) => {
                                setPreco_Custo(e.target.value);
                                setTimeout(() => {
                                  quantidadeRef.current.focus();
                                }, 0);
                              }}
                            />
                          </Form1>
                          <Form1>
                            <label>Saldo</label>
                            <input
                              disabled
                              ref={valorRef}
                              type="number"
                              placeholder="Quantidade de produto"
                              value={modalQuantidade}
                              onChange={(e) => {
                                setModalQuantidade(e.target.value);
                                setTimeout(() => {
                                  valorRef.current.focus();
                                }, 0);
                              }}
                            />
                          </Form1>
                        </Form>
                        <Form>
                          <Form1>
                            <label>Categoria</label>
                            <SelectEstilizado
                              value={categoria}
                              onChange={(e) =>
                                setCategoria(parseInt(e.target.value))
                              }
                            >
                              <OptionEstilizado value={0}>
                                Quilo
                              </OptionEstilizado>
                              <OptionEstilizado value={1}>
                                Quantidade
                              </OptionEstilizado>
                            </SelectEstilizado>
                          </Form1>
                          <Form1>
                            <label>Ativar/Inativar</label>

                            <Switch
                              onChange={handleSwitchChange}
                              checked={isChecked}
                              onColor="#46295a"
                              onHandleColor="#593471"
                              handleDiameter={30}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                              height={20}
                              width={48}
                            />
                          </Form1>
                        </Form>
                        <ButaoEnvioProduto>
                          {enviando ? (
                            "Aguarde..."
                          ) : (
                            <input
                              type="submit"
                              value="Salvar"
                              disabled={enviando}
                              onClick={(e) => {
                                adicionarEstoque(e);
                              }}
                            />
                          )}
                        </ButaoEnvioProduto>
                        <div className="kg kg-estoque"></div>
                      </Modal>
                    </td>
                    <td>{produto.bit === 0 ? "Ativo" : "Inativo"}</td>
                    <td>
                      <span style={{ cursor: "pointer" }}>
                        <MdDelete
                          color="#46295a"
                          onClick={() =>
                            abrirModalConfirmacao(produto.codigo_produto)
                          }
                        />
                      </span>
                      <Modal
                        isOpen={modalConfirmacao}
                        onRequestClose={fecharModalConfirmacao}
                        contentLabel="Confirmar Pedido"
                        style={{
                          content: {
                            width: "70%",
                            height: "120px",
                            margin: "auto",
                            padding: 0,
                          },
                        }}
                      >
                        <div className="modal-mensagem">
                          <SetaFechar Click={fecharModalConfirmacao} />
                          <h2>Confirmação de exlusão</h2>
                        </div>
                        <div className="container-modal">
                          <h2>Deseja confirmar a exclusão do produto?</h2>
                          <div className="btn-modal">
                            <button
                              onClick={() =>
                                botaoDeleteProduto(produto.codigo_produto)
                              }
                              className="verde"
                            >
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
                    </td>
                  </tr>
                </tbody>
              ))
            )}
          </Tabela>
        </ContainerFlex>
      </Flex>
    </>
  );
};

export default Estoque;
