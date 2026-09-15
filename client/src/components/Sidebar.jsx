import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "All Transactions" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-gold/10 text-gold font-medium"
        : "text-muted hover:text-text hover:bg-border/50"
    }`;

  return (
    <>
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface sticky top-0 z-20">
        <div className="font-serif text-text">Expense Tracker</div>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="text-muted p-1"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 md:top-0 left-0 h-screen w-64 bg-surface border-r border-border
          flex flex-col p-4 z-40 transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="mb-6 px-2">
          <div className="text-muted text-xs tracking-wide">
            Expense Tracker
          </div>
          <div className="font-serif text-lg text-text mt-0.5">
            Hi, {user?.name?.split(" ")[0]}
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="text-dim text-sm hover:text-rust transition-colors text-left px-3 py-2"
        >
          Log out
        </button>
      </aside>
    </>
  );
}
