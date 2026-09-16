const STEPS = [
  {
    number: 1,
    title: "Sign up",
    description: "Takes less than a minute, no card required.",
  },
  {
    number: 2,
    title: "Add your transactions",
    description: "Income, expenses, kameti, lending — whatever applies to you.",
  },
  {
    number: 3,
    title: "See the real picture",
    description: "A dashboard that actually reflects where your money goes.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-surface border-y border-border"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-12">
          Three steps to clarity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.number}>
              <div className="w-8 h-8 rounded-full bg-gold text-ink flex items-center justify-center font-semibold text-sm mb-4">
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
