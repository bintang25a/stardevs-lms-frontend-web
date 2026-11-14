import API from "../_api";
import message from "../_utilities/errorMessage";

export const getSubmissions = async () => {
  const { data: response } = await API.get("/submissions");
  return response;
};

export const showSubmission = async (id) => {
  try {
    const { data: response } = await API.get(`/submissions/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const createSubmission = async (data) => {
  try {
    const { data: response } = await API.post("/submissions", data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const updateSubmission = async (id, data) => {
  try {
    const { data: response } = await API.post(`submissions/${id}`, data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const deleteSubmission = async (id) => {
  try {
    const { data: response } = await API.delete(`submissions/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
