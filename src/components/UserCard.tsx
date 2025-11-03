interface UserCardProps {
  username: string;
  totalTodayMl: number;
  highlight?: boolean;
}

export default function UserCard({
  username,
  totalTodayMl,
  highlight = false,
}: UserCardProps) {
  const liters = totalTodayMl / 1000;

  return (
    <div
      className={[
        "rounded-xl border p-4 shadow-sm flex flex-col justify-between min-h-[120px] transition-colors",
        highlight
          ? "border-indigo-400 bg-indigo-50/70"
          : "border-gray-200 bg-white",
      ].join(" ")}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">
            User
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {username}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">
            Usage
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {liters.toFixed(2)} L
          </div>
        </div>
      </div>

      {highlight && (
        <div className="text-[11px] font-medium text-indigo-600 bg-indigo-100/70 rounded-md px-2 py-1 w-fit mt-4 shadow-sm">
          Active now
        </div>
      )}
    </div>
  );
}
