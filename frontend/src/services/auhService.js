import { api, requestConfig } from "../utils/config";

const login = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/login", config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res && res.success) {
      const loginTime = new Date().getTime();
      const expiration = new Date(res.expiration);
      const userData = { user: res, loginTime, expiration };
      console.log(userData);
      /*
      const userId = res.id;
      const chaveUltimoLogin = `primeiro login_${userId}`;
      console.log("teste", chaveUltimoLogin);
      const lastLogin = localStorage.getItem(chaveUltimoLogin);
      const dataLoginAtual = new Date().toLocaleDateString();

      if (lastLogin !== dataLoginAtual) {
        alert("Primeiro login do dia");
        localStorage.setItem(chaveUltimoLogin, dataLoginAtual);
      }
      */
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      throw new Error(res.errors[0] || "Erro ao fazer login");
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const authService = {
  login,
  logout,
};
export default authService;
