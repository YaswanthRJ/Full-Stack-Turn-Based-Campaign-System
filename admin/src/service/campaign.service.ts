import type { Campaign, UpdateCampaignRequest } from "../types/campaign.types";
import { get, put, del } from "./api";

export async function getCampaigns(): Promise<Campaign[]> {
  const res = await get<Campaign[] | { data: Campaign[] }>("/campaigns");
  return Array.isArray(res) ? res : (res as { data: Campaign[] }).data;
}

export async function getCampaign(id: string): Promise<Campaign> {
  const res = await get<Campaign | Campaign[]>(`/campaigns/${id}`);
  return Array.isArray(res) ? res[0] : res;
}

export async function createCampaign(payload: FormData): Promise<Campaign> {
  const BASE_URL = import.meta.env.VITE_BASE_URL as string;
  const url = `${BASE_URL.replace(/\/$/, "")}/campaigns/full`;

  const res = await fetch(url, {
    method: "POST",
    body: payload,
    // No Content-Type header — browser sets it with the correct boundary
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as any).message
        : "Campaign creation failed";
    throw new Error(message);
  }

  return res.json();
}

export async function updateCampaign({ ...payload }: UpdateCampaignRequest): Promise<Campaign> {
  return put<Campaign>(`/campaigns/full`, payload);
}

export async function deleteCampaign(id: string): Promise<void> {
  return del<void>(`/campaigns/${id}`);
}