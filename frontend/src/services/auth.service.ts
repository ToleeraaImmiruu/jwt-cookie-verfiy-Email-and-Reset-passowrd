import API from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await API.post("/register", data);
  return response.data;
};
