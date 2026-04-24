import api from "../interceptor/axios";

export interface Creature {
  id: number;
  name: string;
  description: string;
}

// GET http://localhost:8080/actions
export const getCreatures = async (): Promise<Creature[]> => {
  const response = await api.get<Creature[]>("/creatures");
  return response.data;
};