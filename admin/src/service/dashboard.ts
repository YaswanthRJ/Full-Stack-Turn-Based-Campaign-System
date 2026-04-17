import { get } from "./api";

type Stats = {
  users: number;
  actions: number;
  creatures: number;
  campaigns: number;
};

export async function getStats(): Promise<Stats> {
  return get<Stats>("stats");
}