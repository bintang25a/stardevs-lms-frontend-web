import API from "../_api";
import message from "../_utilities/errorMessage";

export const getMaterials = async () => {
  const { data: response } = await API.get("/materials");
  return response;
};

export const showMaterial = async (id) => {
  try {
    const { data: response } = await API.get(`/materials/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
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
