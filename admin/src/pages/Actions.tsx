// src/pages/Actions.tsx
import { useEffect, useState } from "react";
import { Table } from "../components/Table";
import type { TableColumn } from "../components/Table.types";
import {
  getActions,

} from "../service/action.service";
import { createAction, deleteAction, updateAction } from "../api/services/actionservices";
import { ActionModal } from "../components/modals/ActionModal";
import { DeleteModal } from "../components/modals/DeleteModal";


type ActionRow = {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  multiplier: number;
  tag: string;
  type: string;
  actionWeight: number;
};

const emptyForm: Omit<ActionRow, "id"> = {
  name: "",
  description: "",
  accuracy: 0,
  multiplier: 1,
  tag: "",
  type: "",
  actionWeight: 0,
};

export function Actions() {
  const [actionsData, setActionsData] = useState<ActionRow[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editData, setEditData] = useState<ActionRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<ActionRow | null>(null);

  const loadData = async () => {
  const data = await getActions();
  setActionsData(data ?? []);
};

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const handleEdit = (row: ActionRow) => {
    setEditData(row);
    setOpenModal(true);
  };

  const handleSave = async (form: Omit<ActionRow, "id">) => {
    if (editData) {
      await updateAction(editData.id, form);

    } else {
      await createAction(form);

    }

    setOpenModal(false);
    loadData();
  };

  const handleDeleteClick = (row: ActionRow) => {
    setDeleteRow(row);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteRow) return;
    await deleteAction(deleteRow.id);
    setDeleteOpen(false);
    loadData();
  };

  const columns: TableColumn<ActionRow>[] = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "accuracy", label: "Accuracy" },
    { key: "multiplier", label: "Multiplier" },
    { key: "tag", label: "Tag" },
    { key: "type", label: "Type" },
    { key: "actionWeight", label: "Weight" },
  ];

  const rowActions = [
    {
      label: "Edit",
      onClick: handleEdit,
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
    Add Action
  </button>
</div>

      <Table columns={columns} data={actionsData} actions={rowActions} />

      <ActionModal
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
    </>
  );
}