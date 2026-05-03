import { useEffect, useState } from "react";

export type FieldConfig<T = any> = {
  key: keyof T;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "checkbox" | "file";
  options?: { label: string; value: string }[];
};

export type GenericFormModalProps<T> = {
  open: boolean;
  title: string;
  initialData: T;
  fields: FieldConfig<T>[];
  onClose: () => void;
  onSubmit: (data: T) => void;
};

export function GenericFormModal<T extends Record<string, any>>({
  open,
  title,
  initialData,
  fields,
  onClose,
  onSubmit,
}: GenericFormModalProps<T>) {
  const [form, setForm] = useState<T>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const change = <K extends keyof T>(key: K, value: T[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          {fields.map((field) => (
            <div key={String(field.key)} className="flex flex-col gap-1">
              {field.type === "checkbox" ? (
                <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.key])}
                    onChange={(e) =>
                      change(field.key, e.target.checked as T[typeof field.key])
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  {field.label}
                </label>
              ) : (
                <>
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                  </label>

                  {field.type === "select" ? (
                    <select
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        change(field.key, e.target.value as T[typeof field.key])
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        change(field.key, e.target.value as T[typeof field.key])
                      }
                      rows={4}
                      className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                    />
                  ) : field.type === "file" ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        change(
                          field.key,
                          (e.target.files?.[0] ?? null) as T[typeof field.key]
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        change(
                          field.key,
                          (field.type === "number"
                            ? e.target.value === ""
                              ? ""
                              : Number(e.target.value)
                            : e.target.value) as T[typeof field.key]
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                    />
                  )}
                </>
              )}
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
            onClick={() => onSubmit(form)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}