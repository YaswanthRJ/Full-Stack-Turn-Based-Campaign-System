import { useEffect, useState } from "react";
import { Table } from "../components/Table";
import type { TableColumn } from "../components/Table.types";
import { getCreatures } from "../api/services/creatureservice";

type CreatureRow = {
  id: string;
  name: string;
  description: string;
  isPlayable: boolean;
};

export function Creatures() {
  const [creaturesData, setCreaturesData] = useState<CreatureRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await getCreatures();
        console.log(response);

        // if API returns array directly use response
        // if axios response use response.data
        setCreaturesData(response.data || response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

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
      onClick: (row: CreatureRow) => console.log("Edit", row),
      variant: "primary" as const,
    },
    {
      label: "Delete",
      onClick: (row: CreatureRow) => console.log("Delete", row),
      variant: "danger" as const,
    },
  ];

  return (
    <Table
      columns={columns}
      data={creaturesData}
      actions={actions}
    />
  );
}