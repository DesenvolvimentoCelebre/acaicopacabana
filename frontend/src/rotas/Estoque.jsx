import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useState, useEffect, useRef } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import SetaFechar from "../components/SetaFechar";
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
  const [img_produto, setImg_produto] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));

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
  const valorModalAdd = (quantidade, codigo_produto, bit, preco_custo) => {
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
    setBit(bit);
    setMoldalAdd(true);
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
      const produtoEditado = {
        codigo_produto,
        quantidade: modalQuantidade,
        preco_custo: preco_custo,
        bit,
      };
      const res = await apiAcai.put("/attestoque", produtoEditado);
      if (res.status === 201) {
        toast.success(res.data.message[0]);
        fecharModalAdd();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
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
      const yellow = parseInt(estoqueYellow);
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
    //formData.append("img_produto", img_produto);
    formData.append("tipo", 1);

    try {
      const produtosEnviados = {
        nome: nome,
        categoria: categoria,
        preco_custo: preco_custo,
        quantidade: quantidade,
        tipo: 1,
      };
      const res = await apiAcai.post("/produto", produtosEnviados);

      if (res.status === 201) {
        console.log(res, nome, quantidade, preco_custo, categoria);
        toast.success(res.data.message);
        //window.location.reload();
        fecharModal();
      }
    } catch (error) {
      console.log("Erro", error);
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

  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar />
        <ContainerFlex>
          <NavBar>
            <InputPesquisa
              type="search"
              placeholder="Digite o nome do item"
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
                  height: "65%",
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
                    <label>Quantidade</label>
                    <input
                      type="number"
                      placeholder="Quantidade de produto"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      required
                    />
                  </Form1>
                </Form>
                <Form>
                  {/* <Form1>
                    <label>Imagem do Produto</label>
                    
                    <input
                      className="img-produto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImg_produto(e.target.files[0])}
                      required
                    />
                    
                  </Form1> */}
                </Form>
                <ButaoEnvioProduto>
                  <input type="submit" value="Enviar produto" />
                </ButaoEnvioProduto>
              </form>
            </Modal>
          </NavBar>
          <Tabela>
            <thead>
              <tr>
                <th>Numero do Produto</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Estoque</th>
                <th>Preço</th>
                <th>Adicionar Estoque</th>
                <th>Ativo/Inativo</th>
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
                            produto.preco_custo
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
                            width: "70%",
                            height: "120px",
                            margin: "auto",
                            padding: 0,
                          },
                        }}
                      >
                        <div className="modal-mensagem">
                          <SetaFechar Click={fecharModalAdd} />
                          <h2>Adicionar Estoque</h2>
                        </div>
                        <div className="kg kg-estoque">
                          <label>Codigo</label>
                          <input
                            type="number"
                            onChange={(e) => {
                              setCodigo_Produto(e.target.value);
                            }}
                            value={codigo_produto}
                            disabled
                          />

                          <label>Valor</label>
                          <input
                            ref={quantidadeRef}
                            type="number"
                            placeholder="Valor atualizado do produto"
                            value={preco_custo}
                            onChange={(e) => {
                              setPreco_Custo(e.target.value);
                              setTimeout(() => {
                                quantidadeRef.current.focus();
                              }, 0);
                            }}
                          />
                          <label>Adicionar</label>
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
                          <input
                            type="button"
                            value="Salvar"
                            className="botao-add"
                            onClick={(e) => {
                              adicionarEstoque(e);
                            }}
                          />
                        </div>
                      </Modal>
                    </td>
                    <td>{produto.bit === 0 ? "Ativo" : "Inativo"}</td>
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
