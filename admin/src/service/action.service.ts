import type { Action } from "../types/action.types";
import { get } from "./api";


export async function getActions(): Promise<Action[]> {
return get<Action[]>("actions")
}