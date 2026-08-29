"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Raze?",
    answer:
      "Raze is an AI commerce infrastructure layer that helps merchants let AI buyers discover products, build carts, complete purchases, and recover failed transactions.",
  },
  {
    question: "How does Raze help increase merchant revenue?",
    answer:
      "Raze reduces friction across discovery, product selection, checkout, and payment recovery so more high-intent buying journeys can reach a successful transaction.",
  },
  {
    question: "How does the Raze SDK integrate with my product?",
    answer:
      "The SDK gives developers the primitives needed to connect AI-led product discovery, cart actions, buying flows, and payments to an existing commerce experience.",
  },
  {
    question: "What happens when a payment fails?",
    answer:
      "Raze can identify a failed payment and orchestrate a recovery path, helping the buyer continue toward a successful purchase instead of abandoning the journey.",
  },
  {
    question: "Can Raze work across different products and merchants?",
    answer:
      "Yes. Raze is built around merchant commerce infrastructure, allowing AI-led buying experiences to work across different catalogs and merchant environments.",
  },
];

export default function RazeFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (<section
    id="faq"
    className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#F5F0E8] px-5 py-6 text-[#191715] sm:px-8 sm:py-8 lg:px-12 lg:py-10"
  >
    <div className="pointer-events-none absolute -left-40 top-20 h-[460px] w-[460px] rounded-full border border-[#A86B47]/10" /> <div className="pointer-events-none absolute -left-28 top-32 h-[360px] w-[360px] rounded-full border border-[#A86B47]/10" />

    <div className="relative mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
      <div className="flex flex-col justify-center">
        <div>
          <h2
            className="max-w-[430px] text-[48px] font-semibold leading-[0.94] tracking-[-0.045em] sm:text-[58px] lg:text-[68px]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Frequently
            <br />
            asked
            <br />
            questions
          </h2>

          <p className="mt-5 max-w-[360px] text-[14px] leading-6 text-[#655F57] sm:text-[15px] sm:leading-7">
            Everything you need to know about Raze, AI-led commerce, the SDK,
            and the buying experience.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question}
              className={[
                "overflow-hidden rounded-[22px] border transition-all duration-300",
                isOpen
                  ? "border-[#191715] bg-[#24211F] text-[#F7F1E9] shadow-[0_16px_35px_rgba(25,23,21,0.16)]"
                  : "border-[#DED5CA] bg-[#FBF8F3] text-[#24211F] hover:-translate-y-0.5 hover:border-[#BCA995]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="flex items-start gap-4 text-[16px] font-medium leading-6 tracking-[-0.02em] sm:text-[18px]">
                  <span
                    className={
                      isOpen ? "text-[#C88A63]" : "text-[#A86B47]"
                    }
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{faq.question}</span>
                </span>

                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "rotate-180 border-white/20 bg-white/10"
                      : "border-[#D7CDC1] bg-transparent",
                  ].join(" ")}
                >
                  <ChevronDown size={17} />
                </span>
              </button>

              <div
                className={[
                  "grid transition-[grid-template-rows,opacity] duration-300",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[720px] px-5 pb-5 pl-[57px] text-[13px] leading-6 text-white/60 sm:px-6 sm:pl-[64px] sm:text-[14px] sm:leading-7">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>


  );
}
