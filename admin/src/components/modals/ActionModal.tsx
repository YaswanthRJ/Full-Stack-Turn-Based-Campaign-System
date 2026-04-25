import { GenericFormModal, type FieldConfig } from "./GenericFormModal";

type ActionRow = {
  id?: string;
  name: string;
  description: string;
  accuracy: number;
  multiplier: number;
  tag: string;
  type: string;
  actionWeight: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<ActionRow, "id">) => void;
  initialData: ActionRow;
  isEdit: boolean;
};

const actionFields: FieldConfig[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description", type: "text" },
  { key: "accuracy", label: "Accuracy", type: "number" },
  { key: "multiplier", label: "Multiplier", type: "number" },
  { key: "tag", label: "Tag" },
  {
    key: "type",
    label: "Type",
    type: "select",
    options: [
      { label: "Offensive", value: "offensive" },
      { label: "Defensive", value: "defensive" },
    ],
  },
  { key: "actionWeight", label: "Weight", type: "number" },
];

export function ActionModal({
  open,
  onClose,
  onSave,
  initialData,
  isEdit,
}: Props) {
  return (
    <GenericFormModal<Omit<ActionRow, "id">>
      open={open}
      title={isEdit ? "Edit Action" : "Add Action"}
      initialData={initialData}
      fields={actionFields}
      onClose={onClose}
      onSubmit={onSave}
    />
  );
}