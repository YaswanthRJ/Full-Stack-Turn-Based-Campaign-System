import { useEffect, useState } from "react";
import { getStats } from "../service/dashboard";
import { Card } from "../components/Card";

type Stats = {
    users: number,
    actions: number,
    creatures: number,
    campaigns: number
}


export function Dashboard() {
    const [stats,setStats] = useState<Stats|null>(null)
    
    useEffect(()=>{
        getStats().then(setStats)
        .catch((err)=>{
            console.error(err)
        })
    },[])

  const cardContents = [
    { title: "Creatures", value: stats?.creatures ?? 0 },
    { title: "Actions", value: stats?.actions ?? 0 },
    { title: "Campaigns", value: stats?.campaigns ?? 0 },
    { title: "Users", value: stats?.users ?? 0 },
  ];
  
    return (
        <div className="flex gap-4">
            {cardContents.map((card) => (
                <Card key={card.title} title={card.title} value={card.value} />
            ))}
        </div>
    );
}

