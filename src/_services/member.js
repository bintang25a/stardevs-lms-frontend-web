import API from "../_api";
import message from "../_utilities/errorMessage";

export const memberJoin = async (data) => {
  try {
    const { data: response } = await API.post("/classrooms-join", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const memberLeave = async (data) => {
  try {
    const { data: response } = await API.post("/classrooms-leave", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const addMember = async (data) => {
  try {
    const { data: response } = await API.post("/classrooms-add", data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
