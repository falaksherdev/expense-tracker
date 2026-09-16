import { useState } from "react";

const FAQS = [
  {
    q: "Is my data secure?",
    a: "Yes — authentication uses secure, httpOnly cookies and every request is verified server-side.",
  },
  {
    q: "Can I track committee (kameti) contributions?",
    a: "Yes, it's a built-in category with its own tracking logic, separate from regular expenses.",
  },
  {
    q: "Is this free to use?",
    a: "Yes, completely free.",
  },
  {
    q: "Can I turn off features I don't need?",
    a: "Yes — Committee, Lending, and Investment tracking can each be toggled on or off from Settings.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-10">
          Questions people ask
        </h2>
        <div>
          {FAQS.map((item, i) => (
            <div key={item.q} className="border-b border-border">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="text-text text-sm font-medium">{item.q}</span>
                <span className="text-dim text-lg">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <p className="text-dim text-sm leading-relaxed pb-5 pr-8">
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
