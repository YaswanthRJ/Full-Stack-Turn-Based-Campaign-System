import type { Action } from "../types/action.types";
import { ActionButton } from "./ActionButton";

export const NO_ACTION = "NO_ACTION";

type ActionsPanelProps = {
  actions: Action[];
  onSelect: (actionId: string) => void;
  disabled?: boolean;
  currentAp: number;
};

export function ActionsPanel({
  actions,
  onSelect,
  disabled = false,
  currentAp
}: ActionsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-auto">
      {actions.map((a) => (
        <ActionButton
          key={a.id}
          action={a}
          onClick={() => onSelect(a.id)}
          disabled={disabled}
          starve={a.actionWeight>currentAp}
        />
      ))}

      {/* Always present */}
      <button
        onClick={() => onSelect(NO_ACTION)}
        disabled={disabled}
        className="bg-gray-700 text-white p-3 rounded active:scale-95 transition-all"
      >
        Skip Turn
      </button>
    </div>
  );
}