import type {
  CampaignTemplate,
  CurrentState,
  CurrentStateResponse,
  ResolveActionResponse,
  StartCampaignResponse,
  Fight,
  CampaignOutroData,
} from "../types/campaign.types";
import { get, post } from "./api";

export async function getActiveUserSession(): Promise<CurrentStateResponse> {
  try {
    const res = await get<CurrentStateResponse>("campaign/session");
    return res;
  } catch (error) {
    console.error("Failed to fetch active user session:", error);
    throw new Error("Could not load session");
  }
}

export async function getSession(): Promise<CurrentState> {
  try {
    const res = await getActiveUserSession();

    return {
      currentSession: res.currentSession ?? null,
      currentFight: res.currentFight ?? null,
    };
  } catch (error) {
    console.error("Failed to build session state:", error);
    throw error;
  }
}

export async function getCampaigns(): Promise<CampaignTemplate[]> {
  try {
    const res = await get<CampaignTemplate[]>("campaigns");
    return res;
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    throw new Error("Could not load campaigns");
  }
}
export async function startCampaign(campaignId: string, creatureId: string): Promise<StartCampaignResponse> {
  const res = await post<StartCampaignResponse>(
    `campaign/${campaignId}/start`,
    {
      enemyCreatureId: creatureId,
    }
  );
  return res;
}

export async function resolveAction(fightId: string, actionId: string): Promise<ResolveActionResponse> {
  try {
    const res = await post<ResolveActionResponse>(`campaign/fight/${fightId}/round`, {
      actionId,
    });
    return res;
  } catch (error) {
    console.error("Failed to submit action:", error);
    throw new Error("Could not submit action");
  }
}

export async function startNextFight(sessionId: string): Promise<Fight> {
  const res = await post<{ fight: Fight }>(`campaign/session/${sessionId}/next`, {});
  return res.fight;
}

export async function getOutro(sessionId: string): Promise<CampaignOutroData>{
try{
  const res = await get<CampaignOutroData>(`campaign/session/${sessionId}/success`)
  return res
} catch (error) {
    console.error("Failed to get outro:", error);
    throw new Error("Could not fetch outro");
  }
}