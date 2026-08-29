"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  CreditCard,
  MousePointer2,
  Package,
  ShoppingBag,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    position: "left-top",
    icon: Sparkles,
    title: "AI-powered discovery",
    description:
      "Find the right products for every high-intent signal.",
  },
  {
    position: "left-bottom",
    icon: Target,
    title: "Targeted campaigns",
    description:
      "Turn intent into personalized offers that drive action.",
  },
  {
    position: "right-top",
    icon: ShoppingBag,
    title: "Frictionless buying",
    description:
      "Seamless cart creation and checkout for every buyer.",
  },
  {
    position: "right-bottom",
    icon: CreditCard,
    title: "Payment recovery",
    description:
      "Recover failed payments and protect your revenue.",
  },
];

function FeatureBlock({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      className="group max-w-[230px]"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A86B47]/25 bg-[#F8F3EA]/80 text-[#A86B47] transition-all duration-300 group-hover:border-[#A86B47]/50 group-hover:bg-[#A86B47]/5">
          <Icon size={17} strokeWidth={1.45} />
        </div>

        <div className="h-px w-8 bg-[#A86B47]/25" />
      </div>

      <h3
        className="text-[20px] leading-[1.05] tracking-[-0.035em] text-[#29241F]"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {title}
      </h3>

      <p className="mt-2.5 max-w-[205px] text-[12px] leading-[1.55] text-[#776F66]">
        {description}
      </p>
    </motion.div>
  );
}

function CommerceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.75,
        delay: 0.18,
        ease: "easeOut",
      }}
      className="relative w-[310px] sm:w-[340px]"
    >
      <div className="absolute inset-x-5 bottom-[-10px] h-10 rounded-full bg-[#6B5848]/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-[3px] border border-[#D9CBB9] bg-[#F9F5ED] p-3 shadow-[0_25px_60px_rgba(65,48,35,0.13)]">
        <div className="relative flex h-[235px] items-center justify-center overflow-hidden bg-[#E9DED0]">
          <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full border border-[#A86B47]/15" />
          <div className="absolute -left-20 bottom-[-65px] h-48 w-48 rounded-full border border-[#A86B47]/10" />
          <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-[#D9C8B6]/55" />
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >

            <div className="relative h-[135px] w-[190px]">
              <div className="absolute left-1/2 top-0 h-[105px] w-[135px] -translate-x-1/2 rounded-t-[70px] border-[11px] border-[#403A34] border-b-0" />

              <div className="absolute left-[15px] top-[75px] h-[55px] w-[43px] rounded-[17px] bg-[#403A34] shadow-[inset_-5px_-4px_10px_rgba(0,0,0,0.16)]" />

              <div className="absolute right-[15px] top-[75px] h-[55px] w-[43px] rounded-[17px] bg-[#403A34] shadow-[inset_-5px_-4px_10px_rgba(0,0,0,0.16)]" />

              <div className="absolute left-[24px] top-[84px] h-[37px] w-[25px] rounded-[12px] border border-[#74685D]/50 bg-[#B9AA9B]" />

              <div className="absolute right-[24px] top-[84px] h-[37px] w-[25px] rounded-[12px] border border-[#74685D]/50 bg-[#B9AA9B]" />
            </div>
          </motion.div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/60 bg-[#F9F5ED]/85 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#78916E]" />
            <span className="text-[8px] uppercase tracking-[0.14em] text-[#756B62]">
              AI recommended
            </span>
          </div>
        </div>

        <div className="px-3 pb-2 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.16em] text-[#9B9186]">
                Raze commerce
              </p>

              <h3
                className="mt-1.5 text-[21px] leading-none tracking-[-0.04em] text-[#29241F]"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                Premium Headphones
              </h3>
            </div>

            <div className="text-right">
              <p className="text-[14px] font-medium text-[#A66B47]">
                ₹4,999
              </p>
              <div className="mt-1 flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#78916E]" />
                <span className="text-[8px] text-[#837A70]">
                  In stock
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-[#DED3C5] pt-3">
            <div className="flex items-center justify-between">
              {[
                { label: "Discover", done: true },
                { label: "Cart", done: true },
                { label: "Checkout", done: true },
                { label: "Paid", done: true },
              ].map((step, index) => (
                <div
                  key={step.label}
                  className="relative flex flex-1 flex-col items-center"
                >
                  {index < 3 && (
                    <div className="absolute left-[58%] right-[-42%] top-[6px] h-px bg-[#A86B47]/25" />
                  )}

                  <div className="relative z-10 flex h-3 w-3 items-center justify-center rounded-full border border-[#78916E] bg-[#78916E] text-white">
                    <Check size={7} strokeWidth={3} />
                  </div>

                  <span className="mt-1.5 text-[7px] uppercase tracking-[0.08em] text-[#84796E]">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-5 bottom-14 hidden rounded-[12px] border border-[#D7C9B9] bg-[#FBF8F2] px-3.5 py-2.5 shadow-[0_12px_30px_rgba(65,48,35,0.1)] sm:block"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E3EBDF] text-[#66815E]">
            <Check size={12} />
          </div>

          <div>
            <p className="text-[7px] uppercase tracking-[0.13em] text-[#8C8177]">
              Transaction
            </p>
            <p className="mt-0.5 text-[9px] font-medium text-[#4B5D46]">
              Purchase completed
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RazeRevenueFlow() {
  return (
    <section
      id="growth"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#F5F0E8] px-5 py-8 text-[#29241F] sm:px-8 lg:px-12"
    >

      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/merchant-growth-bg.png')",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[#F5F0E8]/[0.08]" />
      <div className="pointer-events-none absolute -left-[280px] top-[8%] h-[650px] w-[650px] rounded-full border border-[#A86B47]/[0.09]" />
      <div className="pointer-events-none absolute -left-[210px] top-[17%] h-[510px] w-[510px] rounded-full border border-[#A86B47]/[0.075]" />
      <div className="pointer-events-none absolute -left-[145px] top-[27%] h-[370px] w-[370px] rounded-full border border-[#A86B47]/[0.06]" />

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col justify-center">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative z-20 mx-auto text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="relative flex h-8 w-8 items-center justify-center text-[#A86B47]">
              <Sparkles size={19} strokeWidth={1.2} />

              <span className="absolute right-0 top-0 h-1 w-1 rounded-full bg-[#A86B47]/60" />
              <span className="absolute bottom-1 left-0 h-1 w-1 rounded-full bg-[#A86B47]/45" />
            </div>
          </div>

          <h2
            className="mx-auto max-w-[820px] text-[43px] font-normal leading-[0.94] tracking-[-0.045em] text-[#29241F] sm:text-[52px] lg:text-[64px]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Turn every buying signal
            <br />
            <span className="italic text-[#A86B47]">
              into more revenue.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-[500px] text-[12px] leading-5 text-[#756D64] sm:text-[13px]">
            Raze orchestrates the moments between intent and purchase —
            helping merchants convert more demand without adding friction.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-7 w-full max-w-[1050px] sm:mt-9">
          <svg
            className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
            viewBox="0 0 1050 430"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M230 82 C300 82 325 120 365 150"
              fill="none"
              stroke="#A86B47"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="2 5"
            />

            <path
              d="M230 345 C300 345 320 300 365 275"
              fill="none"
              stroke="#A86B47"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="2 5"
            />

            <path
              d="M820 82 C750 82 725 120 685 150"
              fill="none"
              stroke="#A86B47"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="2 5"
            />

            <path
              d="M820 345 C750 345 730 300 685 275"
              fill="none"
              stroke="#A86B47"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="2 5"
            />

            <circle cx="365" cy="150" r="2.5" fill="#A86B47" fillOpacity="0.5" />
            <circle cx="365" cy="275" r="2.5" fill="#A86B47" fillOpacity="0.5" />
            <circle cx="685" cy="150" r="2.5" fill="#A86B47" fillOpacity="0.5" />
            <circle cx="685" cy="275" r="2.5" fill="#A86B47" fillOpacity="0.5" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_360px_1fr] lg:gap-12">
            <div className="order-2 flex flex-col justify-between gap-8 lg:order-1 lg:h-[360px] lg:py-4">
              <FeatureBlock
                icon={features[0].icon}
                title={features[0].title}
                description={features[0].description}
                delay={0.28}
              />

              <FeatureBlock
                icon={features[1].icon}
                title={features[1].title}
                description={features[1].description}
                delay={0.4}
              />
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <CommerceCard />
            </div>

            <div className="order-3 flex flex-col justify-between gap-8 lg:h-[360px] lg:py-4 lg:items-end">
              <div className="lg:text-right">
                <FeatureBlock
                  icon={features[2].icon}
                  title={features[2].title}
                  description={features[2].description}
                  delay={0.52}
                />
              </div>

              <div className="lg:text-right">
                <FeatureBlock
                  icon={features[3].icon}
                  title={features[3].title}
                  description={features[3].description}
                  delay={0.64}
                />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.8,
          }}
          className="relative z-10 mt-5 flex items-center justify-center sm:mt-7"
        >
          <div className="flex items-center gap-2 rounded-full border border-[#CDBEAE]/70 bg-[#F8F3EA]/65 px-4 py-2 backdrop-blur-sm">
            <ArrowUpRight
              size={13}
              strokeWidth={1.5}
              className="text-[#A86B47]"
            />

            <span className="text-[8px] uppercase tracking-[0.18em] text-[#7A7168]">
              Every step optimized for conversion
            </span>

            <MousePointer2
              size={11}
              strokeWidth={1.5}
              className="ml-1 text-[#A86B47]/60"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}