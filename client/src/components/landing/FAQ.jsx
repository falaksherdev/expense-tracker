import { useState } from "react";

const FAQS = [
  {
    q: "Is my data secure?",
    a: "Yes — authentication uses secure, httpOnly cookies and every request is verified server-side.",
  },
  {
    q: "Is this free to use?",
    a: "Yes, completely free.",
  },
  {
    q: "Can I turn off features I don't need?",
    a: "Yes — rotating savings groups, lending, and investment tracking can each be toggled on or off from Settings.",
  },
  {
    q: "Can I track rotating savings groups (like committees or chit funds)?",
    a: "Yes — if you select PKR or INR as your currency, this feature becomes available automatically during setup.",
  },
  {
    q: "Does this work outside Pakistan and India?",
    a: "Yes — pick your currency during setup and the app adapts. Region-specific features show up automatically when relevant, and you can always adjust what you track from Settings.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-text text-center mb-8 sm:mb-10">
          Questions people ask
        </h2>
        <div>
          {FAQS.map((item, i) => (
            <div key={item.q} className="border-b border-border">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-3 py-4 sm:py-5 text-left"
              >
                <span className="text-text text-sm font-medium">{item.q}</span>
                <span className="text-dim text-lg shrink-0">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <p className="text-dim text-sm leading-relaxed pb-4 sm:pb-5 pr-6 sm:pr-8">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
