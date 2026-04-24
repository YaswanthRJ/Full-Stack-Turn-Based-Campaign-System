// import { useEffect, useState } from "react"
// import { getActions } from "../service/action.service"
// import { type Action } from "../types/action.types"

// export function Actions(){
//   const [actions,setActions] = useState<Action[]|null>(null)
//   useEffect(()=>{
//     getActions().then(setActions)
//     .catch(console.log)
//   },[])
//   return (
//     <>
//     Actions
//     </>
//   )
// }

import { useEffect, useState } from "react";
import { Table } from "../components/Table";
import type { TableColumn } from "../components/Table.types";
import { getActions } from "../service/action.service";

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

export function Actions() {
  const [actionsData, setActionsData] = useState<ActionRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getActions();
        console.log(response);
        setActionsData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const columns: TableColumn<ActionRow>[] = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    {
      key: "accuracy",
      label: "Accuracy",
      formatter: (value) => `${(value * 100).toFixed(0)}%`,
    },
    { key: "multiplier", label: "Multiplier" },
    { key: "tag", label: "Tag" },
    { key: "type", label: "Type" },
    { key: "actionWeight", label: "Weight" },
  ];

  const rowActions = [
    {
      label: "Edit",
      onClick: (row: ActionRow) => console.log("Edit", row),
      variant: "primary" as const,
    },
    {
      label: "Delete",
      onClick: (row: ActionRow) => console.log("Delete", row),
      variant: "danger" as const,
    },
  ];

  return (
    <Table
      columns={columns}
      data={actionsData}
      actions={rowActions}
    />
  );
}