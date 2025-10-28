import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  async function load() {
    try {
      const res = await authService.getDashboard();
      const d = res.data;

      // ถ้าไม่มี activeUser ให้ redirect ไป login
      if (d.activeUser === null) {
        navigate("/login");
        return;
      }

      setData(d);
    } catch (err: any) {
      setError(err?.response?.data?.message || "failed to load dashboard");
    }
  }

  async function handleReset() {
    try {
      const res = await authService.resetDevice();

      // ถ้า reset แล้ว activeUser กลายเป็น null ให้ redirect ทันที
      if (res.data.activeUser === null) {
        navigate("/login");
        return;
      }

      await load();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 1000);
    return () => clearInterval(id);
  }, []);

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

  return (
    <main className="min-h-screen bg-[#d5d5d5] p-4">
      <div className="max-w-xl mx-auto flex flex-col gap-4">
        {/* Panel น้ำคงเหลือ */}
        <section className="bg-[#312E2F] text-white rounded-md p-4 border border-gray-500 shadow-md">
          <div className="text-3xl font-bold mb-2">
            {data.waterLeftLiters.toFixed(1)}L left
          </div>

          {data.activeUser ? (
            <div className="text-sm font-semibold">
              Current user: {data.activeUser.username} (
              {data.activeUser.totalTodayMl}ml today)
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

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-1">Username</th>
                <th className="py-1 text-right">Today (ml)</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.username} className="border-b last:border-0">
                  <td className="py-1">{u.username}</td>
                  <td className="py-1 text-right">{u.totalTodayMl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
