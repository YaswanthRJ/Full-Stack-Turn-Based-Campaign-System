// src/components/ActionModal.tsx
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any;
  isEdit: boolean;
};

export function ActionModal({
  open,
  onClose,
  onSave,
  initialData,
  isEdit,
}: Props) {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  if (!open) return null;

  const change = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const fields = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "accuracy", label: "Accuracy" },
    { key: "multiplier", label: "Multiplier" },
    { key: "tag", label: "Tag" },
    { key: "type", label: "Type" },
    { key: "actionWeight", label: "Weight" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Action" : "Add Action"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          {fields.map((item) => (
            <div key={item.key} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                {item.label}
              </label>

              <input
                value={form[item.key]}
                onChange={(e) => change(item.key, e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}