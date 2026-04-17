import { useLocation } from "react-router-dom";
const titles: Record<string, string> = {
    "/": "Dashboard",
    "/creatures": "Creatures",
    "/actions": "Actions",
    "/campaigns": "Campaigns"
};

export function Header() {
    const { pathname } = useLocation();

    const title = titles[pathname] || "Admin";
    return (
        <div className="text-[#111827]">
            <p>{title}</p>
        </div>
    )
}

