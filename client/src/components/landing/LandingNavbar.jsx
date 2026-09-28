import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <nav className="border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-2">
        <Link to="/" className="block sm:hidden h-10 w-full overflow-hidden">
          <img
            src="/mobile_logo.png"
            alt="MoneyMove"
            className=" h-full object-contain object-left"
          />
        </Link>
        <Link to="/" className="hidden sm:block h-12.5 w-full overflow-hidden">
          <img
            src="/logo.png"
            alt="MoneyMove"
            className=" h-full object-contain object-left"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <Link
            to="/login"
            className="text-muted text-xs sm:text-sm hover:text-text transition-colors whitespace-nowrap"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="bg-gold text-ink text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg
                   hover:bg-gold/90 transition-colors whitespace-nowrap"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
