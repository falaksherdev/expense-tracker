import { useScrollReveal } from "../../hooks/useScrollReveal";

const STEPS = [
  {
    number: 1,
    title: "Sign up",
    description: "Takes less than a minute, no card required.",
  },
  {
    number: 2,
    title: "Set your currency and preferences",
    description:
      "Choose your currency, then pick the features that matter to you.",
  },
  {
    number: 3,
    title: "Add your transactions",
    description:
      "Income, expenses, savings groups, lending — whatever applies to you.",
  },
  {
    number: 4,
    title: "See the real picture",
    description: "A dashboard that actually reflects where your money goes.",
  },
];

export default function HowItWorks() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 md:py-20 bg-surface border-y border-border"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-text text-center mb-8 sm:mb-10 md:mb-12">
          Four steps to clarity
        </h2>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8"
        >
          {STEPS.map((s, i) => (
            <div
              key={s.number}
              className={`transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 100}ms` : "0ms" }}
            >
              <div className="w-8 h-8 rounded-full bg-gold text-ink flex items-center justify-center font-semibold text-sm mb-3 sm:mb-4">
                {s.number}
              </div>
              <h3 className="text-text text-base font-medium mb-1.5">
                {s.title}
              </h3>
              <p className="text-dim text-sm">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
