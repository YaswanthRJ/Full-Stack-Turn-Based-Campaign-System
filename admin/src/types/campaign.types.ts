export type CampaignStatus = "active" | "inactive";

export type CampaignStageRequest = {
  stageIndex: number;
  enemyCreatureId: string;
};

export type CreateCampaignRequest = {
  id?:String;
  name: string;
  description: string;
  imageUrl: string;
  outroText: string;
  outroImage: string;
  status: CampaignStatus;
  creatureIds: string[];
  stages: CampaignStageRequest[];
};

export type UpdateCampaignRequest = CreateCampaignRequest

// ── Response shapes ───────────────────────────────────────────────────────────

// types/campaign.types.ts
export type CampaignTemplate = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imagePublicKey: string;
  outroText: string;
  outroImage: string;
  outroPublicKey: string;
  status: "active" | "inactive";
};

export type CampaignStage = {
  stageIndex: number;
  enemyCreatureId: string;
};

export type Campaign = {
  template: CampaignTemplate;
  playableCreatureIds: string[] | null;
  stages: CampaignStage[] | null;
};