import { useNavigate } from "react-router-dom";
import { useGame } from "./GameProvider";
import { startCampaign } from "../service/campaign.service";
import { getCreature, getCreatureActions } from "../service/creatures.service";

export function useStartCampaign() {
    const navigate = useNavigate();
    const { setState } = useGame();

    async function begin(campaignId: string, creatureId: string) {
        try {
            // start campaign → returns fight
            const res = await startCampaign(campaignId, creatureId);

            const sessionId = res.session_id;
            const fight = res.fight;
            // persist minimal data
            localStorage.setItem("sessionId", sessionId);

            // fetch actions
            const actions = await getCreatureActions(creatureId);

            //fetch creatures
            const player = await getCreature(creatureId)
            const enemy = await getCreature(fight.enemyCreatureId)

            // update global state
            setState({
                sessionId,
                creatureId,
                fight,
                actions,
                player,
                enemy,
                loading: false,
            });

            // go to game screen
            navigate("/game");
        } catch (err) {
            console.error("Failed to start campaign:", err);
            throw err;
        }
    }

    return { begin };
}