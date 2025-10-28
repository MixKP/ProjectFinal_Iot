interface WaterPanelProps {
  waterLeftLiters: number;
}

export default function WaterPanel({ waterLeftLiters }: WaterPanelProps) {
  return (
    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col gap-3">
      <div className="text-[12px] font-medium text-gray-500 tracking-wide uppercase">
        Remaining Water
      </div>

      <div className="text-5xl font-semibold text-gray-900 leading-none">
        {waterLeftLiters.toFixed(1)}
        <span className="text-2xl font-normal text-gray-500 ml-1">L</span>
      </div>

      <div className="text-[13px] text-gray-500">
        Live updated from dispenser
      </div>
    </section>
  );
}
