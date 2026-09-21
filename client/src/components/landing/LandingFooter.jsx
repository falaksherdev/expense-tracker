export default function LandingFooter() {
  return (
    <footer className="border-t border-border py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 text-dim text-xs text-center">
        <div>Expense Tracker — built for real financial habits</div>
        <div>&copy; {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
