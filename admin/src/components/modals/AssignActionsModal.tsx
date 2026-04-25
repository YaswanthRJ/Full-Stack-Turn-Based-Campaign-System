import { useEffect, useState } from "react";
import { getActions } from "../../api/services/actionservices";
import { assignActionsToCreature, getCreatureActions } from "../../api/services/creatureservice";
import type { Action } from "../../types/action.types";

type Props = {
  creatureId: string;
  creatureName: string;
  onClose: () => void;
};

export function AssignActionsModal({ creatureId, creatureName, onClose }: Props) {
  const [actions, setActions] = useState<Action[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);
      const [all, assigned] = await Promise.all([
        getActions(),
        getCreatureActions(creatureId),
      ]);

      setActions(all ?? []);
      setSelected(new Set((assigned ?? []).map((a) => a.id)));
    } catch (err) {
      console.error("Failed to load actions:", err);
      setActions([]);
      setSelected(new Set());
    } finally {
      setLoading(false);
    }
  };

  load();
}, [creatureId]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await assignActionsToCreature(creatureId, Array.from(selected));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[80vh]">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Assign Actions to {creatureName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Select actions to assign</p>
        </div>

        <div className="overflow-y-auto flex-1 p-4 grid grid-cols-1 gap-2">
          {loading ? (
            <p className="text-sm text-gray-500 p-2">Loading actions...</p>
          ) : actions.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">No actions available.</p>
          ) : (
            actions.map((action) => {
              const isSelected = selected.has(action.id);
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => toggle(action.id)}
                  className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-gray-200 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{action.name}</p>
                      <p className="text-xs text-gray-500">{action.tag} · {action.type}</p>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0">
                      ×{action.multiplier} · {action.accuracy}% acc
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <p className="text-sm text-gray-500 self-center mr-auto">
            {selected.size} selected
          </p>
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || selected.size === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
