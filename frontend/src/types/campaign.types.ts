export type CampaignSession = {
    id: string;
    userId: string;
    campaignTemplateId: string;
    currentStageIndex: number;
    playerCreatureId: string;
    maxHp: number;
    currentHp: number;
    maxActionPoint: number;
    currentActionPoint: number;
    status: string;
    createdAt: string;
    updatedAt: string;
};

export type CampaignTemplate = {
    id: string
    name: string
    description: string
    status: string
    imageUrl: string
    outroText: string
    outroImage: string
}


export type Fight = {
    id: string;
    campaignSessionId: string;
    userId: string;

    playerCurrentHp: number;
    playerMaxHp: number;
    playerCurrentActionPoint: number;
    playerMaxActionPoint: number;

    enemyCreatureId: string;
    enemyCurrentHp: number;
    enemyMaxHp: number;
    enemyCurrentActionPoint: number;
    enemyMaxActionPoint: number;

    roundNumber: number;
    status: string;

    createdAt: string;
    updatedAt: string;
};


export type CurrentStateResponse = {
    currentSession: CampaignSession | null;
    currentFight: Fight | null;
};


export type CurrentState = {
    currentSession: CampaignSession | null;
    currentFight: Fight | null;
};

export type StartCampaignResponse = {
    message: string;
    session_id: string;
    fight: Fight;
};

export type ResolveActionResponse = {
    fight: Fight
    campaignSessionCompleted: boolean
    roundLog: RoundLogEntry[]
}

export type CampaignOutroData = {
    outroImage: string;
    outroText: string;
}

export type RoundLogEntry = {
    text: string;
    effect: string;
};