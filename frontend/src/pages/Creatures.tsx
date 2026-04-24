import { useEffect, useState } from "react";
import type { Creature } from "../types/creature.types";
import { getCreatures } from "../service/creatures.service";
import { useParams } from "react-router-dom";
import { useStartCampaign } from "../context/useStartCampaign";

export function Creatures() {
  const [creatures, setCreatures] = useState<Creature[] | null>(null);
  const [selectedCreatureId, setSelectedCreatureId] = useState<string | null>(null);
  const { campaignId } = useParams();
  const {begin} = useStartCampaign();
  useEffect(() => {
    if (!campaignId) return;

    getCreatures(campaignId).then((data) => {
      setCreatures(data);
    });
  }, [campaignId]);

  if (!creatures) {
    return <div className="p-4">Loading...</div>;
  }

  if (creatures.length === 0) {
    return <div className="p-4">No creatures available</div>;
  }

  return (
    <div className="flex flex-col gap-3 p-4 h-full">
      <p className="text-center">Pick a creature to play as</p>
        <div className="flex-1 flex flex-col gap-4">
      {creatures.map((c) => (
        <CreatureCell
          key={c.id}
          data={c}
          onSelect={() => setSelectedCreatureId(c.id)}
          isSelected={selectedCreatureId === c.id}
        />
      ))}
        </div>
        <button
          className="bg-purple-700 text-white p-2 rounded"
          onClick={() => {
            begin(campaignId,selectedCreatureId);
          }}
        >
          Begin Campaign
        </button>
      
    </div>
  );
}

type CreatureCellProps = {
  data: Creature;
  onSelect: () => void;
  isSelected: boolean;
};

function CreatureCell({ data, onSelect, isSelected }: CreatureCellProps) {
  return (
    <div
      className={`text-white p-4 rounded cursor-pointer transition-all h-fit
  ${isSelected ? "bg-purple-500" : "bg-purple-700"}
`}
      onClick={onSelect}
    >
      <h2 className="text-lg font-bold">{data.name}</h2>
      <p className="text-sm opacity-80">{data.description}</p>
    </div>
  );
}