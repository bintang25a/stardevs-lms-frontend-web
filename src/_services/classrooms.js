import API from "../_api";
import message from "../_utilities/errorMessage";

export const getClassrooms = async () => {
  const { data: response } = await API.get("/classrooms");
  return response.data;
};

export const showClassroom = async (id) => {
  try {
    const { data: response } = await API.get(`/classrooms/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const createClassroom = async (data) => {
  try {
    const { data: response } = await API.post("/classrooms", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const updateClassroom = async (id, data) => {
  try {
    const { data: response } = await API.post(`classrooms/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const deleteClassroom = async (id) => {
  try {
    const { data: response } = await API.delete(`classrooms/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
