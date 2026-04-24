import { useEffect, useState } from "react"
import type { CampaignTemplate } from "../types/campaign.types"
import { getCampaigns } from "../service/campaign.service"
import { useNavigate } from "react-router-dom";

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignTemplate[] | null>(null);

  useEffect(() => {
    getCampaigns().then((data) => {
      setCampaigns(data);
    });
  }, []);

  if (!campaigns) {
    return <div className="p-4">Loading...</div>;
  }
  if (campaigns.length === 0) {
  return <div className="p-4">No campaigns available</div>;
}

  return (
    <div className="grid gap-3 p-4">
        <p className="text-center ">Pick a campaign to proceed</p>
      {campaigns.map((c) => (
        <CampaignCell key={c.id} data={c} />
      ))}
    </div>
  );
}

type campaignCellProps={
    data: CampaignTemplate;
}

function CampaignCell({ data }: campaignCellProps) {
    const navigate = useNavigate();
  return (
    <div
      className="bg-purple-700 text-white p-4 rounded cursor-pointer active:scale-95 transition-all"
      onClick={() => {
        navigate(`/creatures/${data.id}`);
      }}
    >
      <h2 className="text-lg font-bold">{data.name}</h2>
      <p className="text-sm opacity-80">{data.description}</p>
    </div>
  );
}