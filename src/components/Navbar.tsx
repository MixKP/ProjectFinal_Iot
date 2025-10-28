interface NavbarProps {
  username: string;
  onLogout: () => void;
}

export default function Navbar({ username, onLogout }: NavbarProps) {
  return (
    <header className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
      {/* left: logo / brand */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
          H2O
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">
            Smart Dispenser
          </span>
          <span className="text-sm font-semibold text-gray-900">
            Hydration Station
          </span>
        </div>
      </div>

      {/* right: current user + logout */}
      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <div className="text-[11px] text-gray-500">Signed in as</div>
          <div className="text-sm font-medium text-gray-900">
            {username}
          </div>
        </div>

        <button
          onClick={onLogout}
          className="text-xs font-medium text-gray-600 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
