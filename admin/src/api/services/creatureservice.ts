import api from "../interceptor/axios";

export interface Creature {
  id: string;
  name: string;
  description: string;
  isPlayable: boolean;
}

export interface CreateCreaturePayload {
  name: string;
  description: string;
  is_playable: boolean;
  maxhp: number;
  attack: number;
  defence: number;
  action_point: number;
  speed: number;
}

export interface UpdateCreatureStatsPayload {
  maxhp: number;
  attack: number;
  defence: number;
  action_point: number;
}

export interface CreatureDetails {
  id: string;
  name: string;
  description: string;
  isPlayable: boolean;
  maxHp: number;
  attack: number;
  defence: number;
  actionPoint: number;
  speed: number;
}

export const getCreatures = async (): Promise<Creature[]> => {
  const response = await api.get<{ data: Creature[] }>("/creatures");
  return response.data.data;
};

export const getCreatureById = async (id: string): Promise<CreatureDetails> => {
  const response = await api.get<CreatureDetails>(`/creatures/${id}`);
  return response.data;
};

export const createCreature = async (data: CreateCreaturePayload): Promise<void> => {
  await api.post("/creatures", data);
};

export const updateCreatureStats = async (id: string, data: UpdateCreatureStatsPayload): Promise<void> => {
  await api.put(`/creatures/${id}/stats`, data);
};

export const deleteCreature = async (id: string): Promise<void> => {
  await api.delete(`/creatures/${id}`);
};

export const assignActionsToCreature = async (id: string, actionIds: string[]): Promise<void> => {
  await api.post(`/creatures/${id}/actions`, { action_id: actionIds });
};

export const getCreatureActions = async (id: string): Promise<{ id: string }[]> => {
  const response = await api.get<{ id: string }[]>(`/creatures/${id}/action`);
  return response.data;
};