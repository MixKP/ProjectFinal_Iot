type UserCardProps = {
  name: string;
  useWater: number; // ml
};

export function UserCard({ name, useWater }: UserCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-3">
      <div>
        <div className="text-base font-semibold text-gray-900">{name}</div>
        <div className="text-xs text-gray-500">Used water</div>
      </div>

      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">{useWater} ml</div>
      </div>
    </div>
  );
}
