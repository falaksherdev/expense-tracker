const FEATURES = [
  {
    title: "Real financial logic",
    description:
      'Kameti, lending, and donations tracked the way they actually work — not forced into "expense".',
  },
  {
    title: "Custom categories",
    description:
      "Start with sensible defaults, add your own categories anytime.",
  },
  {
    title: "Period analytics",
    description:
      "Weekly, monthly, yearly, or a custom range — your data, your timeframe.",
  },
  {
    title: "Personalized setup",
    description:
      "Only see the features you actually use — nothing else gets in the way.",
  },
];

export default function Features() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-12">
          Everything you need, nothing you don't
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <h3 className="text-text text-base font-medium mb-2">
                {f.title}
              </h3>
              <p className="text-dim text-xs lg:text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
