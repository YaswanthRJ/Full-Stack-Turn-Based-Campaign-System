import { useEffect, useState } from "react";
import { Table } from "../components/Table";
import type { TableColumn } from "../components/Table.types";
import { getCampaigns } from "../api/services/campaignservice";

type CampaignRow = {
  id: string;
  name: string;
  description: string;
  status: string;
};

export function Campaigns() {
  const [campaignsData, setCampaignsData] = useState<CampaignRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await getCampaigns();
        console.log(response);

        setCampaignsData(response.data || response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

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
      label: "Edit",
      onClick: (row: CampaignRow) => console.log("Edit", row),
      variant: "primary" as const,
    },
    {
      label: "Delete",
      onClick: (row: CampaignRow) => console.log("Delete", row),
      variant: "danger" as const,
    },
  ];

  return (
    <Table
      columns={columns}
      data={campaignsData}
      actions={actions}
    />
  );
}