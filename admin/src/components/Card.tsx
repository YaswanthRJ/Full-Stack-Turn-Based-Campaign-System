interface CardProps {
    title: string;
    value: number;
}



export function Card({ title, value }: CardProps) {
    return (
        <div className="w-70 h-30 border border-[#E5E7EB] rounded-xl bg-white shadow-sm flex flex-col justify-between p-4">

            <div className="text-sm font-medium text-[#8B5FD8]">
                {title}
            </div>

            <div className="text-3xl font-bold text-[#7C3AED]">
                {value}
            </div>

        </div>
    );
}