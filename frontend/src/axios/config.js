import axios from "axios";

const apiAcai = axios.create({
  baseURL: "http://127.0.0.1:21176",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiAcai;
