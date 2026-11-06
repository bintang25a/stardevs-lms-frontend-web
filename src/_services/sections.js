import API from "../_api";
import message from "../_utilities/errorMessage";

export const getSections = async () => {
  const { data: response } = await API.get("/sections");
  return response;
};

export const showSection = async (id) => {
  try {
    const { data: response } = await API.get(`/sections/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const createSection = async (data) => {
  try {
    const { data: response } = await API.post("/sections", data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const updateSection = async (id, data) => {
  try {
    const { data: response } = await API.post(`sections/${id}`, data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const deleteSection = async (id) => {
  try {
    const { data: response } = await API.delete(`sections/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
