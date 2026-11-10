import API from "../_api";
import message from "../_utilities/errorMessage";

let materialPromise = null;

export const getMaterials = async () => {
  const { data: response } = await API.get("/materials");
  return response;
};

export const showMaterial = async (id) => {
  if (materialPromise) {
    return materialPromise;
  }

  materialPromise = (async () => {
    try {
      const { data: response } = await API.get(`/materials/${id}`);

      return response;
    } catch (error) {
      console.log(error);

      throw message(error);
    } finally {
      materialPromise = null;
    }
  })();

  return materialPromise;
};

export const createMaterial = async (data) => {
  try {
    const { data: response } = await API.post("/materials", data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const updateMaterial = async (id, data) => {
  try {
    const { data: response } = await API.post(`materials/${id}`, data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const deleteMaterial = async (id) => {
  try {
    const { data: response } = await API.delete(`materials/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
