import api from "../interceptor/axios";

export interface Action {
  id: number;
  name: string;
  description: string;
}

// GET http://localhost:8080/actions
export const getActions = async (): Promise<Action[]> => {
  const response = await api.get<Action[]>("/actions");
  return response.data;
};