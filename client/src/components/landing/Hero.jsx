import { Link } from "react-router-dom";

export default function Hero() {
  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
  });

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-slate/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-10 items-center relative">
        <div className="animate-[fadeInUp_0.6s_ease-out]">
          <div className="text-muted text-[11px] sm:text-xs tracking-wide uppercase mb-3 sm:mb-4">
            Built for how you actually spend
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text font-semibold leading-tight mb-4 sm:mb-5">
            Track every dollar, rupee, or riyal — even the ones you lend
          </h1>
          <p className="text-dim text-sm sm:text-base leading-relaxed mb-6 sm:mb-7 max-w-md">
            The only expense tracker that understands rotating savings groups,
            informal lending, and family support — not just generic categories.
          </p>
          <div className="flex flex-col xs:flex-row gap-3">
            <Link
              to="/register"
              className="bg-gold text-ink font-semibold text-sm px-6 py-3 rounded-lg
                         hover:bg-gold/90 transition-colors text-center whitespace-nowrap"
            >
              Get started free
            </Link>
            <a
              href="#how-it-works"
              className="border border-border text-text text-sm px-6 py-3 rounded-lg
                         hover:border-gold/40 transition-colors text-center whitespace-nowrap"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/40 animate-[fadeInUp_0.6s_ease-out_0.15s_both]">
          <div className="text-dim text-xs mb-3">{currentMonth} overview</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-4">
            <div className="bg-ink p-2.5 sm:p-3">
              <div className="text-dim text-[9px] sm:text-[10px] mb-1 sm:mb-1.5">
                BALANCE
              </div>
              <div className="font-serif text-xs sm:text-sm font-semibold text-text truncate">
                82,500
              </div>
            </div>
            <div className="bg-ink p-2.5 sm:p-3">
              <div className="text-dim text-[9px] sm:text-[10px] mb-1 sm:mb-1.5">
                INCOME
              </div>
              <div className="font-serif text-xs sm:text-sm font-semibold text-sage truncate">
                +113,000
              </div>
            </div>
            <div className="bg-ink p-2.5 sm:p-3">
              <div className="text-dim text-[9px] sm:text-[10px] mb-1 sm:mb-1.5">
                SENT OUT
              </div>
              <div className="font-serif text-xs sm:text-sm font-semibold text-rust truncate">
                −30,500
              </div>
            </div>
            <div className="bg-ink p-2.5 sm:p-3">
              <div className="text-dim text-[9px] sm:text-[10px] mb-1 sm:mb-1.5">
                SAVED
              </div>
              <div className="font-serif text-xs sm:text-sm font-semibold text-gold truncate">
                92%
              </div>
            </div>
          </div>
          <div className="h-16 bg-ink rounded-lg mb-2" />
          <div className="h-10 bg-ink rounded-lg" />
        </div>
      </div>
    </section>
  );
}
