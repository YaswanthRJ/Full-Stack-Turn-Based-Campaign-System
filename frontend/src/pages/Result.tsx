import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameProvider";
import { startNextFight, getOutro } from "../service/campaign.service";
import { getCreature } from "../service/creatures.service";
import type { CampaignOutroData } from "../types/campaign.types";

export function Result() {
    const { state, setState, reset } = useGame();
    const navigate = useNavigate();
    const fight = state.fight;

    const [outro, setOutro] = useState<CampaignOutroData | null>(null);

    useEffect(() => {
        if (!fight) navigate("/");
    }, [fight, navigate]);

    useEffect(() => {
        async function fetchOutro() {
            if (!state.campaignCompleted || !state.fight?.campaignSessionId) return;

            try {
                const data = await getOutro(state.fight.campaignSessionId);
                setOutro(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchOutro();
    }, [state.campaignCompleted, state.fight?.campaignSessionId]);

    if (!fight) return null;

    const won = fight.status === "player_won";
    const campaignCompleted = state.campaignCompleted;

    async function handleNextFight() {
        if (!state.sessionId) return;

        try {
            const nextFight = await startNextFight(state.sessionId);
            const enemy = await getCreature(nextFight.enemyCreatureId);

            setState((prev) => ({
                ...prev,
                fight: nextFight,
                enemy,
                campaignCompleted: false,
            }));

            navigate("/game");
        } catch (err) {
            console.error("Failed to start next fight:", err);
        }
    }

    function handleHome() {
        reset();
        navigate("/");
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-[60vh]">
            <h1 className="text-3xl font-bold text-white">
                {campaignCompleted
                    ? "Campaign Complete!"
                    : won
                    ? "You Won!"
                    : "You Lost"}
            </h1>

            {campaignCompleted && outro ? (
                <>
                    <img
                        src={`src/assets/${outro.outroImage}`}
                        alt="Campaign Outro"
                        className="w-64 rounded-lg shadow-lg"
                    />
                    <p className="text-indigo-200 text-center max-w-lg">
                        {outro.outroText}
                    </p>
                </>
            ) : (
                <p className="text-indigo-300 text-sm">
                    {won
                        ? "The enemy has been defeated. Ready for the next challenge?"
                        : "Better luck next time."}
                </p>
            )}

            <div className="flex gap-3">
                {won && !campaignCompleted && (
                    <button
                        onClick={handleNextFight}
                        className="bg-purple-700 text-white px-6 py-3 rounded active:scale-95 transition-all"
                    >
                        Next Fight
                    </button>
                )}

                <button
                    onClick={handleHome}
                    className="bg-gray-700 text-white px-6 py-3 rounded active:scale-95 transition-all"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}