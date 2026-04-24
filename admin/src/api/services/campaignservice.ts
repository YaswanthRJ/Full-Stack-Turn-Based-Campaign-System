import api from "../interceptor/axios";

export interface Campaign {
  id: number;
  name: string;
  description: string;
}

// GET http://localhost:8080/actions
export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get<Campaign[]>("/campaigns");
  return response.data;
};