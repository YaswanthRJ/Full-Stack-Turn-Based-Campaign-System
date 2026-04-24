import type { Action } from "../types/action.types";
import type { Creature } from "../types/creature.types";
import { get } from "./api";

export async function getCreatures(id: string):Promise<Creature[]>{
    try {
    const res = await get<Creature[]>(`campaign/${id}/creatures`);
    return res;
  } catch (error) {
    console.error("Failed to fetch creatures:", error);
    throw new Error("Could not load creatures");
  }
}
export async function getCreatureActions(id: string):Promise<Action[]>{
    try {
    const res = await get<Action[]>(`/creatures/${id}/action`);
    return res;
  } catch (error) {
    console.error("Failed to fetch creatures:", error);
    throw new Error("Could not load creatures");
  }
}
export async function getCreature(id: string):Promise<Creature>{
    try {
    const res = await get<Creature>(`creatures/${id}`);
    return res;
  } catch (error) {
    console.error("Failed to fetch creature:", error);
    throw new Error("Could not load creature");
  }
}