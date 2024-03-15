import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import agua from "../assets/img/agua.png";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config";

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
  width: 83vw;
  background-color: #46295a;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 690px;
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
    border-bottom: 2px solid #d9d9d9b0;
  }
  th {
    background-color: #d9d9d9b0;
  }
  td img {
    margin-top: 10px;
    width: 35%;
  }
`;
const TdImg = styled.td`
  display: flex;
  align-items: center;
`;
const Status = styled.div`
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background: red;
  margin: auto;
`;

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  useEffect(() => {
    const carregarEstoque = async () => {
      try {
        const res = await apiAcai.get("/produto");
        console.log("Secesso", res.data);
        setProdutos(res.data);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarEstoque();
  }, []);
  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar />
        <ContainerFlex>
          <NavBar>
            <InputPesquisa type="search" placeholder="Digite o nome do item" />
            <InputButao type="button" value="+  Produto"></InputButao>
          </NavBar>
          <Tabela>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Estoque</th>
                <th>Preço</th>
              </tr>
            </thead>
            {!produtos || produtos.length === 0 ? (
              <p>Não há produtos cadastrados no momento</p>
            ) : (
              produtos.data.map((produto) => (
                <tbody key={produto.no}>
                  <tr>
                    <TdImg>
                      <img src={agua} alt={produto.nome} />
                      <p>{produto.nome}</p>
                    </TdImg>
                    <td>Líquido</td>
                    <td>
                      <Status></Status>
                    </td>
                    <td>
                      <p>{produto.quantidade}</p>
                    </td>
                    <td>R$ {produto.valor_compra}</td>
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
