import { NavLink } from "react-router-dom";

const items = [
    { to: "/", label: "Dashboard" },
    { to: "/actions", label: "Actions" },
    { to: "/campaigns", label: "Campaigns" },
    { to: "/creatures", label: "Creatures" },
];
const base = "block text-base p-2";
export function Sidebar() {
    return (
        <div className="size-full">
            <div className="h-14 flex items-center border-b border-[#363249] px-2">
                <p className="text-[#D1D5DB]">Game Manager</p>
            </div>
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                            `${base} ${isActive
                                ? "bg-[#4C1D95] text-white"
                                : "text-[#9CA3AF] hover:bg-[#374151] hover:text-white"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}