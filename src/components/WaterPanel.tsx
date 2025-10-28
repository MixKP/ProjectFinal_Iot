interface WaterPanelProps {
  waterLeftLiters: number;
  tankCapacityLiters: number;
}

export default function WaterPanel({
  waterLeftLiters,
  tankCapacityLiters,
}: WaterPanelProps) {
  // safety กันหารศูนย์
  const capacity = tankCapacityLiters > 0 ? tankCapacityLiters : 1;
  const pct = Math.max(
    0,
    Math.min(100, (waterLeftLiters / capacity) * 100)
  );

  // เลือกสีตามระดับน้ำที่เหลือ
  // >50% = เขียวฟ้า
  // 20-50% = เหลืองอุ่น
  // <20% = แดงเตือน
  let barColor =
    "bg-indigo-500"; // default (น้ำยังเยอะ ดูสะอาดเทคโนโลยี)
  let statusText = "Tank level normal";

  if (pct <= 50 && pct > 20) {
    barColor = "bg-yellow-400";
    statusText = "Consider refill soon";
  } else if (pct <= 20) {
    barColor = "bg-red-500";
    statusText = "Low water · Refill now";
  }

  return (
    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col">
          <div className="text-[12px] font-medium text-gray-500 tracking-wide uppercase">
            Remaining Water
          </div>
          <div className="text-5xl font-semibold text-gray-900 leading-none">
            {waterLeftLiters.toFixed(1)}
            <span className="text-2xl font-normal text-gray-500 ml-1">
              L
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-gray-400 leading-tight">
            Capacity
          </div>
          <div className="text-sm font-medium text-gray-700 leading-tight">
            {tankCapacityLiters.toFixed(1)}L max
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-baseline justify-between text-[12px] leading-none">
          <div className="text-gray-700 font-medium">
            {pct.toFixed(0)}% full
          </div>

          <div
            className={
              pct <= 20
                ? "text-red-600 font-medium"
                : pct <= 50
                ? "text-yellow-600 font-medium"
                : "text-gray-500"
            }
          >
            {statusText}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="text-[12px] text-gray-500">
        Live updated from dispenser
      </div>
    </section>
  );
}
