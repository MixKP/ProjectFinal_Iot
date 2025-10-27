import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [waterLeft, setWaterLeft] = useState(10000);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("user");

  useEffect(() => {
    if (!username) navigate("/login");
  }, [username, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://192.168.1.34:3000/api/status");
      const data = await res.json();
      setWaterLeft(data.waterLeft);
      setUsers(data.users);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const percent = Math.min((waterLeft / 10000) * 100, 100);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 px-8 py-4 flex justify-between items-center w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          💧 Water Usage Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            Welcome, <span className="font-semibold">{username}</span>
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-lg text-sm shadow-sm transition active:scale-95"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full px-8 py-8 overflow-auto">
        {/* Progress */}
        <section className="bg-white shadow-md rounded-2xl p-6 mb-8 border border-blue-100 w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Water Left</h2>
            <span className="text-sm text-gray-500">
              {percent.toFixed(1)}% remaining
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-2">
            {(waterLeft / 1000).toFixed(1)} L{" "}
            <span className="text-base text-gray-500">({waterLeft} ml)</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </section>

        {/* User List */}
        <div className="mb-4 text-lg font-semibold text-gray-700">User List</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {users.map((user, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Used water</p>
              </div>
              <div className="text-right mt-4">
                <span className="text-3xl font-bold text-blue-600">
                  {user.useWater}
                </span>
                <span className="text-sm text-gray-500 ml-1">ml</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
