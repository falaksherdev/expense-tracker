import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <nav className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 000 4h4v-4h-4z"
            />
          </svg>
          <div className="font-serif text-lg text-text">Expense Tracker</div>
        </div>
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-muted text-sm hover:text-text transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-gold text-ink text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
