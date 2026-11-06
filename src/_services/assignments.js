import API from "../_api";
import message from "../_utilities/errorMessage";

export const getAssignments = async () => {
  const { data: response } = await API.get("/assignments");
  return response;
};

export const showAssignment = async (id) => {
  try {
    const { data: response } = await API.get(`/assignments/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const createAssignment = async (data) => {
  try {
    const { data: response } = await API.post("/assignments", data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const updateAssignment = async (id, data) => {
  try {
    const { data: response } = await API.post(`assignments/${id}`, data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const deleteAssignment = async (id) => {
  try {
    const { data: response } = await API.delete(`assignments/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
