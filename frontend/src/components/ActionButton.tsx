import type { Action } from "../types/action.types";

type ActionButtonProps = {
  action: Action;
  onClick: () => void;
  disabled?: boolean;
  starve?:boolean;
};

export function ActionButton({ action, onClick, disabled, starve }: ActionButtonProps) {
  const accuracyPercent = Math.round(action.accuracy * 100);

  return (
    <button
      onClick={onClick}
      disabled={disabled || starve}
      className={`p-3 rounded transition-all text-left
        ${
          starve
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-purple-700 text-white active:scale-95"
        }
        ${disabled ? "cursor-not-allowed" : ""}
      `}
    >
      <div className="font-bold">{action.name}</div>

      <div className="text-xs opacity-80 flex justify-between">
        <span>ACC: {accuracyPercent}%</span>
        <span>AP: {action.actionWeight}</span>
      </div>
    </button>
  );
}