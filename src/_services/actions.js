import API from "../_api";
import message from "../_utilities/errorMessage";

export const getAnnouncements = async () => {
  const { data: response } = await API.get("/announcements");
  return response;
};

export const showAnnouncement = async (id) => {
  try {
    const { data: response } = await API.get(`/announcements/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const raiseOrder = async (data) => {
  try {
    const { data: response } = await API.post("/actions/raise-order", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const lowerOrder = async (data) => {
  try {
    const { data: response } = await API.post("/actions/lower-order", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const updateAnnouncement = async (id, data) => {
  try {
    const { data: response } = await API.post(`announcements/${id}`, data);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const { data: response } = await API.delete(`announcements/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
