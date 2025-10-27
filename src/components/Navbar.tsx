type HeaderBarProps = {
  username: string | null;
  onLogout: () => void;
};

export function HeaderBar({ username, onLogout }: HeaderBarProps) {
  return (
    <header className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        {username && (
          <div className="text-sm text-gray-500">
            Welcome, <span className="font-medium text-gray-700">{username}</span>
          </div>
        )}
      </div>

      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm active:scale-[0.98] transition"
      >
        Logout
      </button>
    </header>
  );
}
