import { NavLink, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import logo from "../assets/img/logo.jpg";
import computador from "../assets/img/computador.png";
import pessoas from "../assets/img/pessoas.png";
import relatorio from "../assets/img/relatorio.png";
import estoque from "../assets/img/estoque.png";
import engrenagem from "../assets/img/engrenagem.png";
import sair from "../assets/img/sair.png";
import dinheiro from "../assets/img/saco-de-dinheiro.png";
import sangia from "../assets/img/sangria.png";
import { logout, reset } from "../slices/authSlice.js";
import { useDispatch } from "react-redux";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config.js";
import { toast } from "react-toastify";
import SetaFechar from "../components/SetaFechar";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const FlexContainer = styled.div`
  display: flex;
`;

const SideBarClass = styled.div`
  min-height: 100vh;
  min-width: 250px;
  background-color: #46295a;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Container1 = styled.div`
  line-height: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 135px;
  height: 135px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 20px;
`;

const Subtitle = styled.h2`
  font-size: 16px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const SmallImage = styled.img`
  width: 65px;
  height: 65px;
  cursor: pointer;
`;
const SmallImage2 = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const Paragraph = styled.p`
  font-size: 21px;
`;

const MainContainer = styled.div`
  opacity: 0.5;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  width: 80%;
`;
const Footer = styled.div`
  margin-top: 20px;
`;
const Configuracao = styled.div`
  display: flex;
  gap: 10px;
`;

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("user"));
  const { user } = userData || {};

  const botaoLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  };
  const [modalFechamentoCaixa, setModalFechamentoCaixa] = useState(false);

  //const [saldoFechamento, setSaldoFechamento] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [fechamentoDinheiro, setFechamentoDinheiro] = useState("");
  const [fechamentoPix, setFechamentoPix] = useState("");
  const [fechamentoCredito, setFechamentoCredito] = useState("");
  const [fechamentoDebito, setFechamentoDebito] = useState("");
  const [fechamentoSangria, setFechamanetoSangria] = useState("");
  const [totalVendas, setTotalVendas] = useState("");
  const [totalFechamento, setTotalFechamento] = useState("");
  const [cupomFidelidade, setCupomFidelidade] = useState("");
  //const [usuarioId, setUsuarioId] = useState("");
  const [modalCancelamento, setModalCancelamento] = useState(false);
  const [valorSangria, setValorSangria] = useState(false);
  const [valorRetirado, setValorRetirado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [sangria, setSangria] = useState("");
  const [enviando, setEnviando] = useState(false);

  const abrirModalSangria = () => {
    setValorSangria(true);
  };
  const fecharModalSangria = () => {
    setValorSangria(false);
  };

  const abrirModalCancelamento = () => {
    setModalCancelamento(true);
  };
  const fecharModalCancelamento = () => {
    setModalCancelamento(false);
  };

  const abrirModalFechamentoCaixa = () => {
    setModalFechamentoCaixa(true);
  };
  const fecharModalFechamentoCaixa = () => {
    setModalFechamentoCaixa(false);
  };

  useEffect(() => {
    const carregarFechamentoCaixa = async () => {
      try {
        const res = await apiAcai.get(`/rdiario?userno=${user.id}`);
        setSaldoInicial(res.data.rdiario_saldoinicial);
        setCupomFidelidade(res.data.cupomFidelidade);
        setTotalFechamento(res.data.caixaDia);
        setFechamentoDinheiro(res.data.rdiarioSaldoDinheiro);
        setFechamanetoSangria(res.data.sangria);
        setFechamentoPix(res.data.pix);
        setFechamentoCredito(res.data.credito);
        setFechamentoDebito(res.data.debito);
        setTotalVendas(res.data.tvendas);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarFechamentoCaixa();
  }, []);

  useEffect(() => {
    const carregarFechamentoCaixa = async () => {
      try {
        const res = await apiAcai.get(`/rdiario?userno=${user.id}`);
        setSangria(res.data.caixaDia);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarFechamentoCaixa();
  }, []);

  const fechamentoCaixa = async (e) => {
    e.preventDefault(e);

    const usuarioFechamento = {
      userno: user && user.id,
    };

    try {
      const res = await apiAcai.post("/fechamento", usuarioFechamento);
      if (res.status === 200) {
        fecharModalCancelamento();
        fecharModalFechamentoCaixa();
        toast.success("Fecahmento do caixa realizada");
      }
    } catch (error) {
      console.log("Erro", error);
    }
  };

  const envioSangria = async (e) => {
    e.preventDefault();

    setEnviando(true);
    const usuarioSangria = {
      user_cx: user && user.id,
      sdret: valorRetirado,
      motivo: motivo,
      sdi: totalFechamento,
    };

    try {
      const res = await apiAcai.post("/sangria", usuarioSangria);

      if (res.status === 200) {
        fecharModalSangria();
        toast.success("Sangria realizada com sucesso");
        setMotivo("");
        setValorRetirado("");
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error(error.response.data.error[0]);
      } else {
        toast.error("Erro ao realizar a sangria. Tente novamente.");
      }
    } finally {
      setEnviando(false);
    }
  };
  return (
    <>
      <GlobalStyle />
      <FlexContainer>
        <SideBarClass>
          <Container1>
            <LogoImage src={logo} alt="" />
            <Title>{user && user.nome}</Title>
            <Subtitle>{user && user.cargo}</Subtitle>
          </Container1>
          <Container2>
            {user && user.adm === 1 ? (
              <>
                <Box>
                  <NavLink to="/pdv">
                    <SmallImage src={computador} alt="" />
                  </NavLink>
                  <Paragraph>PDV</Paragraph>
                </Box>
                <Box>
                  <NavLink to="/estoque">
                    <SmallImage src={estoque} alt="" />
                  </NavLink>
                  <Paragraph>Estoque</Paragraph>
                </Box>
                <Box>
                  <NavLink to="/relatorio">
                    <SmallImage src={relatorio} alt="" />
                  </NavLink>
                  <Paragraph>Relatórios</Paragraph>
                </Box>
                <Box onClick={abrirModalFechamentoCaixa}>
                  <SmallImage src={dinheiro} alt="" />
                  <Paragraph>Fechamento de caixa</Paragraph>
                </Box>
                <Box>
                  <NavLink onClick={abrirModalSangria}>
                    <SmallImage src={sangia} alt="" />
                  </NavLink>
                  <Paragraph>Sangria</Paragraph>
                </Box>
                <Box>
                  <NavLink to="/usuarios">
                    <SmallImage src={pessoas} alt="" />
                  </NavLink>
                  <Paragraph>Usuários</Paragraph>
                </Box>
                <Box>
                  <Configuracao>
                    <NavLink to="/configuracao">
                      <SmallImage2 src={engrenagem} alt="" />
                    </NavLink>
                    <NavLink>
                      <SmallImage2 src={sair} alt="" onClick={botaoLogout} />
                    </NavLink>
                  </Configuracao>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <NavLink to="/pdv">
                    <SmallImage
                      src={computador}
                      alt=""
                      style={{ width: "80px", height: "90px" }}
                    />
                  </NavLink>
                  <Paragraph>PDV</Paragraph>
                </Box>
                <Box onClick={abrirModalFechamentoCaixa}>
                  <SmallImage src={dinheiro} alt="" />
                  <Paragraph>Fechamento de caixa</Paragraph>
                </Box>
                <Box>
                  <NavLink onClick={abrirModalSangria}>
                    <SmallImage src={sangia} alt="" />
                  </NavLink>
                  <Paragraph>Sangria</Paragraph>
                </Box>
                <Modal
                  isOpen={valorSangria}
                  contentLabel="Modal Produto Específico"
                  style={{
                    content: {
                      width: "30%",
                      height: "50%",
                      margin: "auto",
                      padding: 0,
                    },
                  }}
                >
                  <div className="modal-mensagem">
                    <SetaFechar Click={fecharModalSangria} />
                    <h2>SANGRIA</h2>
                  </div>
                  <div className="kg kg-sangria">
                    <label>Operador do caixa</label>
                    <input
                      type="text"
                      //onChange={(e) => {
                      //setSaldoIncial(e.target.value);
                      //}}
                      value={user && user.nome}
                      disabled
                    />
                    <label>Saldo</label>
                    <input
                      type="text"
                      //onChange={(e) => {
                      //setSaldoIncial(e.target.value);
                      //}}
                      value={sangria}
                      disabled
                    />
                    <label>Valor que será retirado</label>
                    <input
                      type="number"
                      onChange={(e) => {
                        setValorRetirado(e.target.value);
                      }}
                      value={valorRetirado}
                    />
                    <label>Motivo</label>
                    <input
                      required
                      type="text"
                      onChange={(e) => {
                        setMotivo(e.target.value);
                      }}
                      value={motivo}
                    />
                    {enviando ? (
                      "Aguarde..."
                    ) : (
                      <input
                        type="button"
                        value="Enviar"
                        disabled={enviando}
                        className="botao-add botao-caixa"
                        onClick={(e) => {
                          envioSangria(e);
                        }}
                      />
                    )}
                  </div>
                </Modal>
                <Box>
                  <NavLink>
                    <SmallImage
                      src={sair}
                      alt=""
                      onClick={botaoLogout}
                      style={{
                        width: "70px",
                        height: "70px",
                        marginTop: "20px",
                      }}
                    />
                  </NavLink>

                  <Paragraph>SAIR</Paragraph>
                </Box>
              </>
            )}
          </Container2>
          <Modal
            isOpen={modalFechamentoCaixa}
            onRequestClose={fecharModalFechamentoCaixa}
            contentLabel="Confirmar Pedido"
            style={{
              content: {
                width: "30%",
                height: "63%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem modal-fechamento">
              <h2>RELATÓRIO DIÁRIO</h2>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>(+) SALDO INICIAL: R${saldoInicial}</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>(+) ENTRADAS DO DIA</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>Cartão de credito R${fechamentoCredito}</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>Cartão de Débito/alimentação R${fechamentoDebito}</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>Cupom Fidelidade R${cupomFidelidade}</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>Dinheiro R${fechamentoDinheiro}</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>PIX R${fechamentoPix}</p>
            </div>

            <div className="modal-mensagem modal-coluna-col">
              <p>FECHAMENTO DO DIA</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>(+) TOTAL DE VENDA: R${totalVendas}</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p>(+) SALDO EM CAIXA: R${totalFechamento}</p>
            </div>
            <div className="modal-mensagem modal-coluna">
              <p className="red">(-) TOTAL SANGRIA: R${fechamentoSangria}</p>
            </div>
            <div className="modal-coluna-col btn-col">
              <button onClick={abrirModalCancelamento}>
                FECHAMENTO DO DIA
              </button>
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
              <h2>Confirmação de fechamento</h2>
            </div>
            <div className="container-modal">
              <h2>Deseja confirmar o fechamento do caixa?</h2>
              <div className="btn-modal">
                <button
                  onClick={(e) => {
                    botaoLogout(e);
                    fechamentoCaixa(e);
                  }}
                  className="verde"
                >
                  Confirmar
                </button>
                <button onClick={fecharModalCancelamento} className="vermelho">
                  Cancelar
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={valorSangria}
            contentLabel="Modal Produto Específico"
            style={{
              content: {
                width: "30%",
                height: "50%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharModalSangria} />
              <h2>SANGRIA</h2>
            </div>
            <div className="kg kg-sangria">
              <label>Operador do caixa</label>
              <input
                type="text"
                //onChange={(e) => {
                //setSaldoIncial(e.target.value);
                //}}
                value={user && user.nome}
                disabled
              />
              <label>Saldo</label>
              <input
                type="text"
                //onChange={(e) => {
                //setSaldoIncial(e.target.value);
                //}}
                value={sangria}
                disabled
              />
              <label>Valor que será retirado</label>
              <input
                type="number"
                onChange={(e) => {
                  setValorRetirado(e.target.value);
                }}
                value={valorRetirado}
              />
              <label>Motivo</label>
              <input
                required
                type="text"
                onChange={(e) => {
                  setMotivo(e.target.value);
                }}
                value={motivo}
              />
              {enviando ? (
                "Aguarde..."
              ) : (
                <input
                  type="button"
                  value="Enviar"
                  disabled={enviando}
                  className="botao-add botao-caixa"
                  onClick={(e) => {
                    envioSangria(e);
                  }}
                />
              )}
            </div>
          </Modal>
          <Footer>
            <p>Versão 1.0.3</p>
          </Footer>
        </SideBarClass>
        <MainContainer></MainContainer>
      </FlexContainer>
    </>
  );
};

export default SideBar;
