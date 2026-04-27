import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../components/Table";
import type { TableColumn } from "../components/Table.types";
import { getCampaigns, deleteCampaign } from "../api/services/campaignservice";
import { DeleteModal } from "../components/modals/DeleteModal";

type CampaignRow = {
  id: string;
  name: string;
  description: string;
  status: string;
};

export function Campaigns() {
  const navigate = useNavigate();
  const [campaignsData, setCampaignsData] = useState<CampaignRow[]>([]);
  const [deleteRow, setDeleteRow] = useState<CampaignRow | null>(null);

  const loadData = async () => {
    try {
      const response: any = await getCampaigns();
      setCampaignsData(response.data || response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const confirmDelete = async () => {
    if (!deleteRow) return;
    await deleteCampaign(deleteRow.id);
    setDeleteRow(null);
    loadData();
  };

  const columns: TableColumn<CampaignRow>[] = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    {
      key: "status",
      label: "Status",
      formatter: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1),
    },
  ];

  const actions = [
    {
      label: "Delete",
      onClick: (row: CampaignRow) => setDeleteRow(row),
      variant: "danger" as const,
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => navigate("/campaigns/new")}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white shadow hover:bg-blue-700"
        >
          Create Campaign
        </button>
      </div>
      <Table columns={columns} data={campaignsData} actions={actions} />

      <DeleteModal
        open={!!deleteRow}
        title={`Delete "${deleteRow?.name}"?`}
        onClose={() => setDeleteRow(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}