type WaterPanelProps = {
  waterLeft: number;
};

export function WaterPanel({ waterLeft }: WaterPanelProps) {
  const liters = (waterLeft / 1000).toFixed(1);

  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Water Left
      </h3>

      <div className="text-2xl font-bold text-gray-900">
        {liters} L{" "}
        <span className="text-base font-medium text-gray-500">
          ({waterLeft} ml)
        </span>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        {/* แถบ progress แบบประมาณคร่าว ๆ: สมมติเต็มคือ 10000 ml */}
        <div
          className="h-full bg-blue-500 transition-all"
          style={{
            width: `${Math.min((waterLeft / 10000) * 100, 100)}%`,
          }}
        />
      </div>

      <div className="mt-1 text-xs text-gray-500">
        {Math.min((waterLeft / 10000) * 100, 100).toFixed(0)}% remaining
      </div>
    </section>
  );
}
