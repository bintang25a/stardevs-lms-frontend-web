import API from "../_api";
import message from "../_utilities/errorMessage";

export const fileDownload = async (id, fileName = "downloaded-file") => {
  const response = await API.get(`/actions/file-download/${id}`, {
    responseType: "blob",
  });

  console.log(response);

  const blob = new Blob([response.data]);
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);

  return true;
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
