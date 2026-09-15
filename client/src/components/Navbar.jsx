import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-muted text-xs tracking-wide">
            Expense Tracker
          </div>
          <div className="font-serif text-lg text-text">
            Hi, {user?.name?.split(" ")[0]}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to="/dashboard"
            className="text-dim text-sm hover:text-text transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className="text-dim text-sm hover:text-text transition-colors"
          >
            All Transactions
          </Link>
          <button
            onClick={handleLogout}
            className="text-dim text-sm hover:text-rust transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
