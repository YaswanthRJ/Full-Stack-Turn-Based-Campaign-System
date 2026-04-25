// src/service/action.service.ts
import api from "../interceptor/axios";

export interface Action {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  multiplier: number;
  tag: string;
  type: string;
  actionWeight: number;
}

const camelToSnake = (obj: any): any => {
  const newObj: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    const value = obj[key];
    newObj[snakeKey] = typeof value === "number" ? value : parseFloat(value) || value;
  }
  return newObj;
};

// GET ALL
export const getActions = async (): Promise<Action[]> => {
  const response = await api.get<Action[]>("/actions");
  return response.data;
};

// GET ONE
export const getActionById = async (id: string): Promise<Action> => {
  const response = await api.get<Action>(`/actions/${id}`);
  return response.data;
};

// CREATE
export const createAction = async (
  data: Omit<Action, "id">
): Promise<Action> => {
  const response = await api.post<Action>("/actions", camelToSnake(data));
  return response.data;
};

// UPDATE
export const updateAction = async (
  id: string,
  data: Partial<Action>
): Promise<Action> => {
  const response = await api.put<Action>(`/actions/${id}`, camelToSnake(data));
  return response.data;
};

// DELETE
export const deleteAction = async (id: string): Promise<void> => {
  await api.delete(`/actions/${id}`);
};