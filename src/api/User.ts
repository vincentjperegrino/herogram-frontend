import { AxiosResponse } from "axios";
import Auth from "../interfaces/Auth";
import api from "./Axios";

export const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<void> => {
  try {
    await api.post("/users/create", { email, password, firstName, lastName, role: 'user' });
  } catch (error: any) {
    throw new Error("Error creating user: "  + error.message);
  }
};

export const login = async (email: string, password: string): Promise<Auth> => {
  try {
    const response: AxiosResponse<Auth> = await api.post("/users/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error creating user: " + error.message);
  }
};