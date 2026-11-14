import API from "../_api";
import message from "../_utilities/errorMessage";

let classroomPromise = null;
let classroomsPromise = null;

export const getClassrooms = async () => {
  if (classroomsPromise) {
    return classroomsPromise;
  }

  classroomsPromise = (async () => {
    try {
      const { data: response } = await API.get("/classrooms");

      return response.data;
    } catch (error) {
      console.log(error);

      throw message(error);
    } finally {
      classroomsPromise = null;
    }
  })();

  return classroomsPromise;
};

export const showClassroom = async (id) => {
  if (classroomPromise) {
    return classroomPromise;
  }

  classroomPromise = (async () => {
    try {
      const { data: response } = await API.get(`/classrooms/${id}`);

      return response.data;
    } catch (error) {
      console.log(error);

      throw message(error);
    } finally {
      classroomPromise = null;
    }
  })();

  return classroomPromise;
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
