import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import WaterPanel from "../components/WaterPanel";
import UserCard from "../components/UserCard";
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
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData | null>(null);

  const lastActiveTsRef = useRef<number>(Date.now());
  const [secondsLeft, setSecondsLeft] = useState<number>(30);

  const lastMlRef = useRef<number | null>(null);
  const lastLitersRef = useRef<number | null>(null);

  function recordActivity(next: DashboardData) {
    if (!next.activeUser) return;

    const curMl = next.activeUser.totalTodayMl;
    const prevMl = lastMlRef.current;

    const curLiters = next.waterLeftLiters;
    const prevLiters = lastLitersRef.current;

    const usedWater =
      (prevMl !== null && curMl > prevMl) ||
      (prevLiters !== null && curLiters < prevLiters);

    if (usedWater) {
      lastActiveTsRef.current = Date.now();
    }

    lastMlRef.current = curMl;
    lastLitersRef.current = curLiters;
  }

  async function load() {
      const res = await authService.getDashboard();
      const d: DashboardData = res.data;

      if (!d.activeUser) {
        navigate("/login");
        return;
      }

      recordActivity(d);
      setData(d);
  }

  async function handleLogout() {
    try {
      await authService.logout();
    } catch {}
    navigate("/login");
  }
  useEffect(() => {
    load();
    const pollId = setInterval(load, 1000);
    return () => clearInterval(pollId);
  }, []);

  useEffect(() => {
    const idleId = setInterval(() => {
      const now = Date.now();
      const diffMs = now - lastActiveTsRef.current;
      const remainMs = 30_000 - diffMs;
      const remainSec = Math.max(0, Math.ceil(remainMs / 1000));
      setSecondsLeft(remainSec);

      if (diffMs >= 30_000) {
        handleLogout();
      }
    }, 1000);

    return () => clearInterval(idleId);
  }, []);

  if (!data || !data.activeUser) {
    return (
      <main className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
        <div className="text-gray-700 text-sm">Loading...</div>
      </main>
    );
  }

  const { activeUser, waterLeftLiters, users } = data;

  const sortedUsers = [
    ...users.filter((u) => u.username === activeUser.username),
    ...users.filter((u) => u.username !== activeUser.username),
  ];

  return (
    <main className="bg-[#f5f6fa] min-h-screen p-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <Navbar username={activeUser.username} onLogout={handleLogout} />
        
        <WaterPanel
          waterLeftLiters={waterLeftLiters}
          tankCapacityLiters={10}
        />
        
        <div className="flex items-center justify-between">
          <div className="text-[12px] tracking-wide uppercase font-medium text-gray-500">
            Users today
          </div>

          <div className="flex items-center gap-4 text-[12px] text-gray-500">
            <div>
              Auto logout in{" "}
              <span className="font-semibold text-gray-700">
                {secondsLeft}s
              </span>
            </div>
            <div className="text-gray-400">
              {users.length} user{users.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedUsers.map((u) => (
            <UserCard
              key={u.username}
              username={u.username}
              totalTodayMl={u.totalTodayMl}
              highlight={u.username === activeUser.username}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
