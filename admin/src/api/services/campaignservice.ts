import api from "../interceptor/axios";

export interface Campaign {
  id: number;
  name: string;
  description: string;
}

export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get<Campaign[]>("/campaigns");
  return response.data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await api.delete(`/campaigns/${id}`);
};