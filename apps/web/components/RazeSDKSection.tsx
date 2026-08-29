"use client";

import { Check, ChevronRight, Copy, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
{
label: "Discover",
method: "raze.discover()",
detail: "Intent → product",
},
{
label: "Cart",
method: "raze.cart.create()",
detail: "Product → cart",
},
{
label: "Checkout",
method: "raze.checkout.start()",
detail: "Cart → checkout",
},
{
label: "Payment",
method: "raze.payment.confirm()",
detail: "Checkout → paid",
},
];

export default function RazeSDKSection() {
const [activeStep, setActiveStep] = useState(0);
const [copied, setCopied] = useState(false);

useEffect(() => {
const timer = window.setInterval(() => {
setActiveStep((current) => (current + 1) % steps.length);
}, 2200);

return () => window.clearInterval(timer);


}, []);

async function copyCode() {
try {
await navigator.clipboard.writeText(
"npm install @raze/commerce-sdk"
);


  setCopied(true);

  window.setTimeout(() => {
    setCopied(false);
  }, 1400);
} catch {}

}

return ( <section
   id="developers"
   className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#171513] px-5 py-8 text-[#F7F4EE] sm:px-8 lg:px-12"
 >
{/* Background rings — intentionally retained */} <div className="pointer-events-none absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C88A63]/[0.065]" /> <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C88A63]/[0.06]" /> <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C88A63]/[0.055]" /> <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C88A63]/[0.045]" />


  <div className="relative mx-auto flex w-full max-w-[1320px] flex-col items-center justify-center">
    {/* Heading */}
    <div className="relative z-10 w-full text-center">
      <h2
        className="mx-auto whitespace-nowrap text-[34px] font-medium leading-none tracking-[-0.045em] text-[#F7F4EE] sm:text-[42px] md:text-[50px] lg:text-[58px]"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        The SDK that turns{" "}
        <span className="text-[#C88A63]">
          AI intent into checkout.
        </span>
      </h2>
    </div>

    {/* Large product interface */}
    <div className="relative z-10 mt-10 grid w-full gap-5 lg:mt-12 lg:grid-cols-2">
      {/* SDK / code panel */}
      <div className="relative min-h-[320px] overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#201E1B] shadow-[0_35px_100px_rgba(0,0,0,0.28)] sm:min-h-[360px]">
        {/* Header */}
        <div className="flex h-[62px] items-center justify-between border-b border-white/[0.08] px-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#C88A63]/20 bg-[#C88A63]/10 text-[#C88A63]">
              <Terminal size={15} strokeWidth={1.7} />
            </div>

            <div>
              <p className="text-[12px] font-medium text-white/70">
                Raze Commerce SDK
              </p>
              <p className="mt-0.5 font-mono text-[8px] text-white/25">
                @raze/commerce-sdk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#C88A63]/80" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Code */}
        <div className="px-5 py-7 sm:px-7 sm:py-8">
          <div className="mb-7 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
              agent.ts
            </span>

            <span className="font-mono text-[9px] text-white/20">
              TypeScript
            </span>
          </div>

          <div className="font-mono text-[12px] leading-[2] sm:text-[13px]">
            <div className="text-white/25">
              // give your agent the ability to buy
            </div>

            <div>
              <span className="text-[#C88A63]">const</span>{" "}
              <span className="text-white/75">raze</span>{" "}
              <span className="text-white/30">=</span>{" "}
              <span className="text-[#C88A63]">new</span>{" "}
              <span className="text-white/75">Raze</span>
              <span className="text-white/30">{"({"}</span>
            </div>

            <div className="pl-6 text-white/55">
              merchantId:{" "}
              <span className="text-[#D7A77E]">
                "your-store"
              </span>
            </div>

            <div className="text-white/30">
              {"});"}
            </div>

            <div className="my-5 h-px bg-white/[0.08]" />

            {steps.map((step, index) => {
              const active = index === activeStep;

              return (
                <div
                  key={step.method}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-500",
                    active
                      ? "bg-[#C88A63]/[0.08]"
                      : "",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500",
                      active
                        ? "bg-[#C88A63]"
                        : "bg-white/15",
                    ].join(" ")}
                  />

                  <span
                    className={[
                      "transition-colors duration-500",
                      active
                        ? "text-white/80"
                        : "text-white/30",
                    ].join(" ")}
                  >
                    {step.method}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Install command */}
          <button
            type="button"
            onClick={copyCode}
            className="group mt-7 flex w-full items-center justify-between rounded-[12px] border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 text-left transition-all duration-300 hover:border-[#C88A63]/30 hover:bg-white/[0.055]"
          >
            <span className="truncate font-mono text-[10px] text-white/45 sm:text-[11px]">
              <span className="mr-2 text-[#C88A63]/80">
                $
              </span>
              npm install @raze/commerce-sdk
            </span>

            {copied ? (
              <Check
                size={15}
                className="ml-3 shrink-0 text-[#C88A63]"
              />
            ) : (
              <Copy
                size={15}
                className="ml-3 shrink-0 text-white/25 transition-colors group-hover:text-white/50"
              />
            )}
          </button>
        </div>
      </div>

      {/* Live transaction panel */}
      <div className="relative min-h-[320px] overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#E8DED2] p-5 text-[#171513] shadow-[0_35px_100px_rgba(0,0,0,0.24)] sm:min-h-[360px] sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#78916E]" />

              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#71685F]">
                Live transaction
              </span>
            </div>

            <p
              className="mt-2 text-[22px] tracking-[-0.04em]"
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              Agent buying flow
            </p>
          </div>

          <div className="rounded-full border border-[#171513]/[0.08] bg-[#F7F4EE]/75 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-[#756C63]">
            Live
          </div>
        </div>

        {/* Product */}
        <div className="mt-6 rounded-[18px] border border-[#171513]/[0.06] bg-[#F8F4ED] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[16px] bg-[#C98B68]">
              <div className="relative h-9 w-12 rounded-[9px] border-[3px] border-[#F7F4EE]/80">
                <div className="absolute -left-[6px] top-[8px] h-4 w-2 rounded-l-full border-l-[3px] border-t-[3px] border-b-[3px] border-[#F7F4EE]/70" />
                <div className="absolute -right-[6px] top-[8px] h-4 w-2 rounded-r-full border-r-[3px] border-t-[3px] border-b-[3px] border-[#F7F4EE]/70" />
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#9A9087]">
                Agent recommendation
              </p>

              <p
                className="mt-1.5 truncate text-[22px] leading-none tracking-[-0.04em]"
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Premium Headphones
              </p>

              <div className="mt-3 flex items-center gap-2.5">
                <span className="text-[14px] font-medium text-[#A66A43]">
                  ₹4,999
                </span>

                <span className="text-[9px] text-[#999087]">
                  Best match for intent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Flow */}
        <div className="relative mt-6">
          <div className="absolute left-[17px] top-[18px] h-[calc(100%-36px)] w-px bg-[#171513]/10" />

          <div className="space-y-1.5">
            {steps.map((step, index) => {
              const active = index === activeStep;
              const complete = index < activeStep;

              return (
                <div
                  key={step.label}
                  className={[
                    "relative flex items-center gap-4 rounded-[14px] px-3 py-3 transition-all duration-500",
                    active
                      ? "bg-[#F7F4EE] shadow-[0_10px_30px_rgba(40,30,20,0.06)]"
                      : "",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium transition-all duration-500",
                      active
                        ? "border-[#A66A43] bg-[#A66A43] text-white"
                        : complete
                          ? "border-[#78916E] bg-[#78916E] text-white"
                          : "border-[#CEC1B4] bg-[#E8DED2] text-[#8C8177]",
                    ].join(" ")}
                  >
                    {complete ? (
                      <Check size={12} strokeWidth={2.2} />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className={[
                          "text-[13px] font-medium transition-colors duration-500",
                          active
                            ? "text-[#171513]"
                            : "text-[#70675F]",
                        ].join(" ")}
                      >
                        {step.label}
                      </p>

                      {active && (
                        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#A66A43]">
                          Running
                        </span>
                      )}
                    </div>

                    <p
                      className={[
                        "mt-0.5 text-[9px] transition-colors duration-500",
                        active
                          ? "text-[#91877E]"
                          : "text-[#A79D93]",
                      ].join(" ")}
                    >
                      {step.detail}
                    </p>
                  </div>

                  <ChevronRight
                    size={13}
                    className={[
                      "shrink-0 transition-all duration-500",
                      active
                        ? "text-[#A66A43]"
                        : "text-[#B7ACA2]",
                    ].join(" ")}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed state */}
        <div className="mt-5 flex items-center justify-between rounded-[14px] border border-[#78916E]/20 bg-[#E3EBDF] px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#78916E] text-white">
              <Check size={13} strokeWidth={2.3} />
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.13em] text-[#6D8266]">
                Transaction
              </p>

              <p className="mt-0.5 text-[11px] font-medium text-[#455A40]">
                Purchase completed
              </p>
            </div>
          </div>

          <span className="font-mono text-[8px] text-[#6D8266]">
            00:02.41
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

);
}
