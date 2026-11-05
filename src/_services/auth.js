import API from "../_api";
import message from "../_utilities/errorMessage";

let profilePromise = null;

// Fungsi Login
export const login = async (data) => {
  try {
    const { data: response } = await API.post("/login", data);
    const token = response.access_token;
    const user = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return token;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const register = async (data) => {
  try {
    const { data: response } = await API.post("/register", data);

    return response?.message;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const profile = async () => {
  if (profilePromise) {
    return profilePromise;
  }

  profilePromise = (async () => {
    try {
      const { data: response } = await API.get("/user");
      const user = response.data;

      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error) {
      throw message(error);
    } finally {
      profilePromise = null;
    }
  })();

  return profilePromise;
};

// Fungsi Validasi token
export const validateToken = async () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await API.get("/validate-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.success;
  } catch (error) {
    console.error("Token tidak valid:", error.response?.data || error.message);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
};
export const isAuthenticated = async () => {
  return await validateToken();
};

// Fungsi Logout
export const logout = async () => {
  try {
    const response = await API.post("/logout");

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
