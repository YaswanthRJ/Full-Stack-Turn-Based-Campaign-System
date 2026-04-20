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

import { Table } from "../components/Table";

const data = [
  { name: 'Item 1', createdAt: '2026-04-17T10:00:00Z' },
  { name: 'Item 2', createdAt: '2026-04-18T12:00:00Z' },
];
export function Campaigns(){
 const columns = [
    { key: 'name', label: 'Name' },
    { key: 'createdAt', label: 'Created', type: 'date' as const },
  ];

  const campaigns = [
    {
      label: 'Edit',
      onClick: (row: any) => console.log('Edit', row),
      variant: 'primary' as const,
    },
    {
      label: 'Delete',
      onClick: (row: any) => console.log('Delete', row),
      variant: 'danger' as const,
    },
  ];

  return <Table columns={columns} data={data} actions={campaigns} />;
}