import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameProvider";
import { useGameInitializer } from "../context/useGameInitializer";
import { CreatureCard } from "../components/CreatureCard";
import { ActionsPanel } from "../components/ActionPanel";
import { resolveAction } from "../service/campaign.service";
import { LogBox } from "../components/LogBox";
import type { Fight, RoundLogEntry } from "../types/campaign.types";

export function Game() {
    useGameInitializer();

    const { state, setState } = useGame();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [lines, setLines] = useState<RoundLogEntry[]>([]);

    const [visualFight, setVisualFight] = useState<Fight | null>(state.fight);
    const [eventAnim, setEventAnim] = useState<null | { type: "player_attack" | "enemy_attack" | "player_miss" | "enemy_miss"; }>(null);
    const [visualState, setVisualState] = useState({
        playerDefending: false,
        enemyDefending: false,
    });


    useEffect(() => {
        setVisualFight(state.fight);
    }, [state.fight]);

    const playing = useRef(false);
    const pendingResult = useRef<any>(null);

    const fight = state.fight;

    if (state.loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (!fight || !visualFight || !state.enemy || !state.player) {
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
            setVisualFight(fight);
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
        setVisualState({
            playerDefending: false,
            enemyDefending: false,
        });
        setEventAnim(null);

        // delay navigation slightly so UI updates are visible
        if (res.fight.status !== "active") {
            setTimeout(() => {
                navigate("/result");
            }, 400); // tweak: 300–600ms feels good
        }
    }

    function applyEffect(effect: string, finalFight: Fight) {
        setVisualFight((current) => {
            if (!current) return current;

            const next = { ...current };

            // ===== AP UPDATES =====
            switch (effect) {
                case "player_attack":
                case "player_defend":
                    next.playerCurrentActionPoint =
                        finalFight.playerCurrentActionPoint;
                    break;

                case "enemy_attack":
                case "enemy_defend":
                    next.enemyCurrentActionPoint =
                        finalFight.enemyCurrentActionPoint;
                    break;
            }

            // ===== HP UPDATES =====
            switch (effect) {
                case "enemy_hit":
                    next.enemyCurrentHp = finalFight.enemyCurrentHp;
                    break;

                case "player_hit":
                    next.playerCurrentHp = finalFight.playerCurrentHp;
                    break;
            }

            return next;
        });

        // ===== DEFENSE STATE =====
        setVisualState((s) => {
            switch (effect) {
                case "player_defend":
                    return { ...s, playerDefending: true };

                case "enemy_defend":
                    return { ...s, enemyDefending: true };

                case "player_miss":
                    return { ...s, playerDefending: false };

                case "enemy_miss":
                    return { ...s, enemyDefending: false };

                default:
                    return s;
            }
        });

        // ===== EVENT ANIMATION =====
        switch (effect) {
            case "player_attack":
                setEventAnim({ type: "player_attack" });
                break;

            case "enemy_attack":
                setEventAnim({ type: "enemy_attack" });
                break;

            case "player_miss":
                setEventAnim({ type: "player_miss" });
                break;

            case "enemy_miss":
                setEventAnim({ type: "enemy_miss" });
                break;
        }

        // auto-clear transient animation
        if (effect.includes("attack") || effect.includes("miss")) {
            setTimeout(() => setEventAnim(null), 200);
        }
    }

    return (
        <div className="flex flex-col gap-3 p-3 overflow-auto">
            {/* Enemy */}
            <CreatureCard
                name={state.enemy.name}
                hpCurrent={visualFight.enemyCurrentHp}
                hpMax={visualFight.enemyMaxHp}
                apCurrent={visualFight.enemyCurrentActionPoint}
                apMax={visualFight.enemyMaxActionPoint}
                imageUrl={state.enemy.imageUrl}
                isEnemy
                isDefending={visualState.enemyDefending}
            />


            {/* Player */}
            <CreatureCard
                name={state.player.name}
                hpCurrent={visualFight.playerCurrentHp}
                hpMax={visualFight.playerMaxHp}
                apCurrent={visualFight.playerCurrentActionPoint}
                apMax={visualFight.playerMaxActionPoint}
                imageUrl={state.player.imageUrl}
                isDefending={visualState.playerDefending}
            />
            {/* Round log */}
            <div className="border p-2 h-20 flex items-start bg-white rounded-lg">
                <LogBox
                    logs={lines}
                    onStep={(entry) => {
                        const res = pendingResult.current;
                        if (!res || !fight) return;

                        applyEffect(entry.effect, res.fight);
                    }}
                    onDone={handleLogDone}
                />
            </div>

            {/* Actions */}
            <ActionsPanel
                actions={state.actions}
                onSelect={handleAction}
                disabled={submitting || playing.current}
                currentAp={visualFight?.playerCurrentActionPoint}
            />
        </div>
    );
}