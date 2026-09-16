export default function LandingFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-dim text-xs">
        <div>Expense Tracker — built for real financial habits</div>
        <div className="flex items-center gap-2">
          <span>Made by</span>
          <a
            href="https://www.linkedin.com/in/falaksherdev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Falak Sher
          </a>
          <span>· &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
