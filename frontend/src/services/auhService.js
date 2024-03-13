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
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

const authService = {
  login,
};
export default authService;
