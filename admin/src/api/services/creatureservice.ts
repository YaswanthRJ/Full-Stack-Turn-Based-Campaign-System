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
  image: File | null;
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
  imageUrl: string;
  imagePublicId: string;
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

export const createCreature = async (
  data: CreateCreaturePayload
): Promise<void> => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("is_playable", String(data.is_playable));
  formData.append("max_hp", String(data.maxhp));
  formData.append("attack", String(data.attack));
  formData.append("defence", String(data.defence));
  formData.append("action_point", String(data.action_point));
  formData.append("speed", String(data.speed));

  if (data.image) {
    formData.append("image", data.image);
  }

  await api.post("/creatures", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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