import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameProvider";
import { useGameInitializer } from "../context/useGameInitializer";
import { CreatureCard } from "../components/CreatureCard";
import { ActionsPanel } from "../components/ActionPanel";
import { resolveAction } from "../service/campaign.service";
import { LogBox } from "../components/LogBox";

export function Game() {
    useGameInitializer();

    const { state, setState } = useGame();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [lines, setLines] = useState<string[]>([]);

    const playing = useRef(false);
    const pendingResult = useRef<any>(null);

    const fight = state.fight;

    if (state.loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (!fight || !state.enemy || !state.player) {
        return <div className="p-4">No active fight</div>;
    }

    async function handleAction(actionId: string) {
        if (submitting || playing.current || !fight) return;

        setSubmitting(true);

        try {
            const res = await resolveAction(fight.id, actionId);

            // store result, let LogBox drive timing
            pendingResult.current = res;
            playing.current = true;

            // trigger animation
            setLines(res.roundLog);
        } catch (err) {
            console.error("Round failed:", err);
            playing.current = false;
            setLines([]);
            setSubmitting(false);
        }
    }

function handleLogDone() {
    const res = pendingResult.current;
    if (!res) return;

    // apply final state first
    setState((prev) => ({
        ...prev,
        fight: res.fight,
        campaignCompleted: res.campaignSessionCompleted,
    }));

    // cleanup immediately
    playing.current = false;
    setLines([]);
    setSubmitting(false);
    pendingResult.current = null;

    // delay navigation slightly so UI updates are visible
    if (res.fight.status !== "active") {
        setTimeout(() => {
            navigate("/result");
        }, 400); // tweak: 300–600ms feels good
    }
}

    return (
        <div className="flex flex-col gap-3 p-3">
            {/* Enemy */}
            <CreatureCard
                name={state.enemy.name}
                hpCurrent={fight.enemyCurrentHp}
                hpMax={fight.enemyMaxHp}
                apCurrent={fight.enemyCurrentActionPoint}
                apMax={fight.enemyMaxActionPoint}
                isEnemy
            />


            {/* Player */}
            <CreatureCard
                name={state.player.name}
                hpCurrent={fight.playerCurrentHp}
                hpMax={fight.playerMaxHp}
                apCurrent={fight.playerCurrentActionPoint}
                apMax={fight.playerMaxActionPoint}
            />
            {/* Round log */}
            <div className="border p-2 h-[80px] flex items-start">
                <LogBox
                    logs={lines}
                    onDone={handleLogDone}
                />
            </div>

            {/* Actions */}
            <ActionsPanel
                actions={state.actions}
                onSelect={handleAction}
                disabled={submitting || playing.current}
                currentAp={state.fight.playerCurrentActionPoint}
            />
        </div>
    );
}