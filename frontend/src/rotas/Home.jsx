import "../components/SideBar";
import SideBar from "../components/SideBar";
import styled, { createGlobalStyle } from "styled-components";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useEffect, useState } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { toast } from "react-toastify";

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
const Fundo = styled.img`
  opacity: 0.5;
  margin: auto;
`;

const Home = () => {
  const [dadosCaixa, setDadosCaixa] = useState("");
  const [modalDadoCaixa, setModalDadosCaixa] = useState(false);
  const [saldoCaixa, setSaldoCaixa] = useState(null);
  const [saldoIncial, setSaldoIncial] = useState("");
  const [dataHora, setDataHora] = useState(new Date());

  const [display, setDisplay] = useState("");

  const handleClick = (value) => {
    setSaldoIncial(saldoIncial + value);
  };

  const handleClear = () => {
    setDisplay("");
  };

  const [valorSaldoIncial, setValorSaldoIncial] = useState(false);
  useEffect(() => {
    const tempo = setInterval(() => setDataHora(new Date()), 1000);

    return () => {
      clearInterval(tempo);
    };
  }, []);

  const data = dataHora.toLocaleDateString();
  const userData = JSON.parse(localStorage.getItem("user"));
  const { user } = userData || {};
  const fecharModalValorIncial = () => {
    setValorSaldoIncial(false);
  };
  // const abrirModalValorIncial = () => {
  //   setValorSaldoIncial(true);
  // };
  const fecharModalDadosCaixa = () => {
    setModalDadosCaixa(false);
  };

  useEffect(() => {
    const carregarDadosDoCaixa = async () => {
      try {
        const res = await apiAcai.get(`/gcx?userno=${user.id}`);
        const dados = res.data.message[0].s0;

        console.log("Dados do Caixa:", dados);
        setDadosCaixa(dados);

        if (dados == "0" || 0) {
          setModalDadosCaixa(true);
        }
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarDadosDoCaixa();
  }, []);

  useEffect(() => {
    const valorEmCaixa = async () => {
      try {
        const res = await apiAcai.get(`/sd?userno=${user.id}`);

        const dados = res.data.message[0].sd;

        setSaldoCaixa(dados);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    valorEmCaixa();
  }, []);

  const confirmarAberturaCaixa = async (e) => {
    e.preventDefault(e);

    try {
      const abrirCaixa = {
        s0: 1,
        sd: saldoIncial,
        userno: user && user.id,
      };

      const res = await apiAcai.post("/opc", abrirCaixa);
      window.location.reload(e);

      if (res.status === 200) {
        fecharModalDadosCaixa();
        fecharModalValorIncial();
        toast.success("Abertura do caixa realizada");
      }
    } catch (error) {
      console.log("Erro", error);
    }
  };
  return (
    <>
      <GlobalStyle />
      <Modal
        isOpen={modalDadoCaixa}
        //onRequestClose={fecharModalDadosCaixa}
        contentLabel="Confirmar Pedido"
        style={{
          content: {
            width: "60%",
            height: "85%",
            margin: "auto",
            border: "8px solid #46295a",
            padding: 0,
          },
        }}
      >
        <div className="modal-mensagem modal-dados">
          <h2>Abertura de caixa</h2>
        </div>
        <div className="calculator">
          <input
            type="number"
            onChange={(e) => setSaldoIncial(e.target.value)}
            value={saldoIncial}
            className="display"
          />
          <div className="buttons">
            <button onClick={() => handleClick("7")}>7</button>
            <button onClick={() => handleClick("8")}>8</button>
            <button onClick={() => handleClick("9")}>9</button>
            <button onClick={() => handleClick("4")}>4</button>
            <button onClick={() => handleClick("5")}>5</button>
            <button onClick={() => handleClick("6")}>6</button>
            <button onClick={() => handleClick("1")}>1</button>
            <button onClick={() => handleClick("2")}>2</button>
            <button onClick={() => handleClick("3")}>3</button>
            <button onClick={() => handleClick("0")}>0</button>
            <button onClick={() => handleClick(".")}>.</button>
            <button onClick={handleClear}>Del</button>
          </div>
        </div>
        <div className="btn-modal-fecha">
          <button className="dados-btn" onClick={confirmarAberturaCaixa}>
            Abrir
          </button>
        </div>
        {/* <div className="modal-mensagem modal-saldo">R${saldoCaixa}</div> */}
        {/* <div className="dados-modal">
          <h2>Digite a baixo o valor da abertura do caixa na data de {data}</h2>
          <div className="kg">
            <input
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0) {
                  setSaldoIncial(value);
                } else {
                  toast.error("O valor não pode ser negativo");
                }
              }}
              value={saldoIncial}
            />
          </div>
          </div>
        </div> */}
      </Modal>
      {/* <Modal
        isOpen={valorSaldoIncial}
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
        <div className="modal-mensagem modal-dados">
          <h2>Inserir saldo de abertura</h2>
        </div>
        <div className="kg">
          <label>Digite a baixo o valor da abertura do caixa desta data</label>
          <input
            type="number"
            onChange={(e) => {
              setSaldoIncial(e.target.value);
            }}
            value={saldoIncial}
          />
          <input
            type="button"
            value="Enviar"
            className="botao-add"
            onClick={(e) => {
              confirmarAberturaCaixa(e);
            }}
          />
        </div>
      </Modal> */}
      <Flex>
        <SideBar></SideBar>
        <Fundo src={imgFundo}></Fundo>
      </Flex>
    </>
  );
};

export default Home;
