import logo from "../assets/img/logo.jpg";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { login } from "../slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { createGlobalStyle } from "styled-components";
import apiAcai from "../axios/config.js";
import Draggable from "react-draggable";
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Josefin Sans', serif;
    margin: 0;
    padding: 0;
    background: rgb(2, 0, 36);
    background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(70, 41, 80, 1) 0%, rgba(31, 4, 65, 1) 100%, rgba(0, 0, 0, 1) 100%);
    @media screen and (max-width: 900px) {
    background: #fff;
  }
  }
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  @media screen and (max-width: 900px) {
    height: 1px;
    width: 50vw;
    margin: auto;
  }
`;

const LoginContainer = styled.div`
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  max-width: 1200px;
`;

const LoginImage = styled.img`
  flex: 1;
  width: 500px;
  object-fit: fill;

  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const LoginForm = styled.div`
  flex: 1;
  padding: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 900px) {
    padding: 40px;
    position: relative;
  }
`;
const CelularImagem = styled.img`
  display: none;
  width: 50%;
  height: 40%;
  margin-top: 20px;
  border-radius: 50%;

  @media screen and (max-width: 900px) {
    display: block;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 40px;
  color: #5f387a;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-weight: bold;
  color: #7e7e7e;
  width: 100%;
  height: 2.3rem;
  margin: 5px 0;
  font-size: 18px;
`;

const Input = styled.input`
  padding-left: 10px;
  border: none;
  background-color: #e7dcef;
  border-radius: 10px;
  font-weight: bold;
  color: #7e7e7e;
  width: 100%;
  height: 2.3rem;
  margin: 5px 0;
`;

const Button = styled.input`
  width: 100%;
  margin-top: 40px;
  padding: 12px 90px;
  background-color: #5f387a;
  text-decoration: none;
  border: 1px solid #5f387a;
  transition: 0.5s;
  color: #f1f1f1;
  cursor: pointer;

  &:hover {
    background-color: #5f387a;
    border-radius: 50px;
  }
`;
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast--error {
    font-size: 18px;
    text-align: center;
    width: 400px;
    margin: auto;
    height: 90px;
  }
`;

const TelaDeLogin = () => {
  //states login
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth || {});

  //Criação do botão de login
  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      usuario,
      senha,
    };
    dispatch(login(user));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const [diasFaltando, setDiasFaltando] = useState(null);
  const [dataApi, setDataApi] = useState("");
  const [mostrarMensagem, setMostrarMensagem] = useState(false);

  useEffect(() => {
    const carregarFechamentoCaixa = async () => {
      try {
        const res = await apiAcai.get("/validation");
        setDataApi(res.data.validade);
        console.log("karol", res.data.validade);

        const [dia, mes, ano] = res.data.validade.split("/");
        const dataApiConvertida = new Date(`${ano}-${mes}-${dia}`);
        const dataAtual = new Date();

        const diferencaDias = Math.ceil(
          (dataApiConvertida - dataAtual) / (1000 * 60 * 60 * 24)
        );
        console.log(dataApiConvertida, dataAtual, diferencaDias);

        setDiasFaltando(diferencaDias);
        if (diferencaDias <= 15) {
          setMostrarMensagem(true);
        }
      } catch (error) {
        console.log("Erro", error);
      }
    };

    carregarFechamentoCaixa();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        {mostrarMensagem && (
          <Draggable>
            <div
              style={{
                border: "1px solid black",
                padding: "40px",
                position: "absolute",
                top: "30px",
                backgroundColor: "white",
                borderColor: "#bb74ed",
              }}
            >
              <p style={{ fontSize: "22px" }}>
                Sua licença expira em {diasFaltando} dias, faça a renovação e
                não fique sem seu sistema.
              </p>
            </div>
          </Draggable>
        )}
        <LoginContainer>
          <LoginImage src={logo} alt="Imagem de fundo" />
          <LoginForm>
            <Title>LOGIN</Title>
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="username">Usuário:</Label>
              <Input
                type="text"
                id="username"
                name="username"
                onChange={(e) => setUsuario(e.target.value)}
                value={usuario || ""}
                placeholder="Digite seu usuario"
              />
              <Label htmlFor="password">Senha:</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Digite sua senha"
                onChange={(e) => setSenha(e.target.value)}
                value={senha || ""}
              />
              {!loading && <Button type="submit" value="Entrar" />}
              {loading && <Button type="submit" value="Aguarde..." disabled />}
              <CelularImagem src={logo} alt="Imagem para mobile" />
            </Form>
          </LoginForm>
        </LoginContainer>
      </Container>
      <StyledToastContainer position="top-center" autoClose={5000} />
    </>
  );
};

export default TelaDeLogin;
