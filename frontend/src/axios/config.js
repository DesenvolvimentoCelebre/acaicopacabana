import axios from "axios";

const apiAcai = axios.create({
  baseURL: "http://celebreprojetos.com.br:21176",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiAcai;
