import { GenericFormModal, type FieldConfig } from "./GenericFormModal";

export type CreatureRequest = {
  name: string;
  description: string;
  isPlayable: boolean;
  maxhp: number;
  attack: number;
  defence: number;
  action_point: number;
  speed: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<CreatureRequest, "id">) => void;
  initialData: CreatureRequest;
  isEdit: boolean;
};

const creatureFields: FieldConfig[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description", type: "text" },
  { key: "isPlayable", label: "Playable", type: "checkbox" },
  { key: "maxhp", label: "Max Health", type: "number" },
  { key: "attack", label: "Attack", type: "number" },
  { key: "defence", label: "Defence", type: "number" },
  { key: "action_point", label: "Action Point", type: "number" },
  { key: "speed", label: "Speed", type: "number" },
];

export function CreatureModal({
  open,
  onClose,
  onSave,
  initialData,
  isEdit,
}: Props) {
  return (
    <GenericFormModal<Omit<CreatureRequest, "id">>
      open={open}
      title={isEdit ? "Edit Creature Stats" : "Add Creature"}
      initialData={initialData}
      fields={creatureFields}
      onClose={onClose}
      onSubmit={onSave}
    />
  );
}