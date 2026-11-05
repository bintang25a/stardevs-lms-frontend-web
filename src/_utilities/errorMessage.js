const message = (error) => {
  if (error.status == 422) {
    const errors = error?.response?.data?.errors;

    return Object.values(errors).join("\n");
  } else {
    return error.response?.data["message"];
  }
};

export default message;
