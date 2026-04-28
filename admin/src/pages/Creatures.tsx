import { useEffect, useState } from "react";
import { Table } from "../components/Table";
import type { TableColumn } from "../components/Table.types";
import {
  getCreatures,
  getCreatureById,
  createCreature,
  updateCreatureStats,
  deleteCreature,
} from "../api/services/creatureservice";
import { CreatureModal, type CreatureRequest } from "../components/modals/CreatureModal";
import { DeleteModal } from "../components/modals/DeleteModal";
import { AssignActionsModal } from "../components/modals/AssignActionsModal";

type CreatureRow = {
  id: string;
  name: string;
  description: string;
  isPlayable: boolean;
};

type CreatureEditData = CreatureRequest & { id: string };

const emptyForm: CreatureRequest = {
  name: "",
  description: "",
  imageUrl: "",
  isPlayable: false,
  maxhp: 0,
  attack: 0,
  defence: 0,
  action_point: 0,
  speed: 0,
};

export function Creatures() {
  const [creaturesData, setCreaturesData] = useState<CreatureRow[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editData, setEditData] = useState<CreatureEditData | null>(null);
  const [deleteRow, setDeleteRow] = useState<CreatureRow | null>(null);
  const [assignRow, setAssignRow] = useState<CreatureRow | null>(null);

  const loadData = async () => {
    const data = await getCreatures();
    setCreaturesData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const handleEdit = async (row: CreatureRow) => {
    const details = await getCreatureById(row.id);
    setEditData({
      id: details.id,
      name: details.name,
      description: details.description,
      imageUrl: details.imageUrl ?? "",
      isPlayable: details.isPlayable,
      maxhp: details.maxHp,
      attack: details.attack,
      defence: details.defence,
      action_point: details.actionPoint,
      speed: details.speed,
    });
    setOpenModal(true);
  };

  const handleSave = async (form: CreatureRequest) => {
    if (editData) {
      await updateCreatureStats(editData.id, {
        maxhp: form.maxhp,
        attack: form.attack,
        defence: form.defence,
        action_point: form.action_point,
      });
    } else {
      await createCreature({
        name: form.name,
        description: form.description,
        imageUrl: form.imageUrl,
        is_playable: form.isPlayable,
        maxhp: form.maxhp,
        attack: form.attack,
        defence: form.defence,
        action_point: form.action_point,
        speed: form.speed,
      });
    }
    setOpenModal(false);
    loadData();
  };

  const handleDeleteClick = (row: CreatureRow) => {
    setDeleteRow(row);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteRow) return;
    await deleteCreature(deleteRow.id);
    setDeleteOpen(false);
    loadData();
  };

  const columns: TableColumn<CreatureRow>[] = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    {
      key: "isPlayable",
      label: "Playable",
      formatter: (value) => (value ? "Yes" : "No"),
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: handleEdit,
      variant: "primary" as const,
    },
    {
      label: "Actions",
      onClick: (row: CreatureRow) => setAssignRow(row),
      variant: "primary" as const,
    },
    {
      label: "Delete",
      onClick: handleDeleteClick,
      variant: "danger" as const,
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white shadow hover:bg-blue-700"
        >
          Add Creature
        </button>
      </div>
      <Table columns={columns} data={creaturesData} actions={actions} />

      <CreatureModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        initialData={editData || emptyForm}
        isEdit={!!editData}
      />

      <DeleteModal
        open={deleteOpen}
        title={`Delete ${deleteRow?.name}?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      {assignRow && (
        <AssignActionsModal
          creatureId={assignRow.id}
          creatureName={assignRow.name}
          onClose={() => setAssignRow(null)}
        />
      )}
    </>
  );
}
