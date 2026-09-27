import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function ProblemStatement() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-surface border-y border-border">
      <div
        ref={ref}
        className={`max-w-xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-text mb-3 sm:mb-4">
          Generic trackers miss half your money
        </h2>
        <p className="text-dim text-sm leading-relaxed">
          You contribute to rotating savings groups. You lend money to family
          and friends. You give to charity. Most apps lump all of this into
          "expense" — making your numbers wrong from day one. We built this to
          fix that.
        </p>
      </div>
    </section>
  );
}
