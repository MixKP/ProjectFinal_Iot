import { useEffect, useState } from "react";
import { authService } from "../services/authService";

interface ActiveUser {
  username: string;
  totalTodayMl: number;
}

interface DashboardData {
  waterLeftLiters: number;
  activeUser: ActiveUser | null;
  users: ActiveUser[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await authService.getDashboard();

      // debug ดู payload จริงจาก backend
      console.log("[dashboard] /api/dashboard ->", res.data);

      // ปรับ payload ให้ปลอดภัยก่อนเซ็ต
      const safeData: DashboardData = {
        waterLeftLiters: typeof res.data.waterLeftLiters === "number"
          ? res.data.waterLeftLiters
          : 0,
        activeUser: res.data.activeUser && res.data.activeUser.username
          ? {
              username: String(res.data.activeUser.username),
              totalTodayMl: Number(res.data.activeUser.totalTodayMl || 0),
            }
          : null,
        users: Array.isArray(res.data.users)
          ? res.data.users.map((u: any) => ({
              username: String(u.username),
              totalTodayMl: Number(u.totalTodayMl || 0),
            }))
          : [],
      };

      setData(safeData);
      setError("");
    } catch (err: any) {
      console.error("[dashboard] load() error", err);
      setError(err?.response?.data?.message || "failed to load dashboard");
    }
  }

  async function handleReset() {
    try {
      await authService.resetDevice();
      await load();
    } catch (err) {
      console.error("[dashboard] resetDevice error", err);
    }
  }

  useEffect(() => {
    let alive = true;

    // wrap ให้เช็คว่ายัง mounted ก่อนค่อย setState
    async function tick() {
      if (!alive) return;
      await load();
    }

    // โหลดครั้งแรก
    tick();

    // poll ทุก 1 วิ
    const id = setInterval(tick, 1000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // ----- render states -----

  if (error) {
    return (
      <main className="min-h-screen bg-[#d5d5d5] p-4">
        <div className="max-w-xl mx-auto text-red-600">{error}</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#d5d5d5] p-4">
        <div className="max-w-xl mx-auto text-gray-800">Loading...</div>
      </main>
    );
  }

  const { waterLeftLiters, activeUser, users } = data;

  return (
    <main className="min-h-screen bg-[#d5d5d5] p-4">
      <div className="max-w-xl mx-auto flex flex-col gap-4">

        {/* แถบสถานะด้านบน */}
        <header className="bg-white border shadow rounded-md p-4 flex flex-col gap-1">
          <div className="text-sm text-gray-600 font-medium">
            Device Status
          </div>
          <div className="text-lg font-semibold text-gray-900">
            Water Left: {waterLeftLiters.toFixed(1)}L
          </div>
          {activeUser ? (
            <div className="text-sm text-gray-800">
              Active User:{" "}
              <span className="font-semibold">{activeUser.username}</span>{" "}
              ({activeUser.totalTodayMl} ml today)
            </div>
          ) : (
            <div className="text-sm text-yellow-600 font-medium">
              No active user (Please login…)
            </div>
          )}
        </header>

        {/* Panel น้ำคงเหลือแบบเดิมของคุณ */}
        <section className="bg-[#312E2F] text-white rounded-md p-4 border border-gray-500 shadow-md">
          <div className="text-3xl font-bold mb-2">
            {waterLeftLiters.toFixed(1)}L left
          </div>

          {activeUser ? (
            <div className="text-sm font-semibold">
              Current user: {activeUser.username} ({activeUser.totalTodayMl}ml today)
            </div>
          ) : (
            <div className="text-sm font-semibold text-yellow-300">
              No active user (Please login...)
            </div>
          )}
        </section>

        {/* User list + Reset */}
        <section className="bg-white rounded-md p-4 shadow border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Users</h2>

            <button
              onClick={handleReset}
              className="text-xs bg-red-600 text-white rounded px-3 py-1 font-semibold hover:bg-red-500"
            >
              Reset Device
            </button>
          </div>

          {users.length === 0 ? (
            <div className="text-sm text-gray-500">
              No users yet. Register first.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Username</th>
                  <th className="py-1 text-right">Today (ml)</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.username} className="border-b last:border-0">
                    <td className="py-1">{u.username}</td>
                    <td className="py-1 text-right">{u.totalTodayMl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
