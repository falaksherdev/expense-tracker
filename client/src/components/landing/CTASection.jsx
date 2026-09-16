import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-20 bg-surface border-t border-border text-center">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="font-serif text-3xl text-text mb-6">
          Start tracking today
        </h2>
        <Link
          to="/register"
          className="inline-block bg-gold text-ink font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-gold/90 transition-colors"
        >
          Create your free account
        </Link>
      </div>
    </section>
  );
}
