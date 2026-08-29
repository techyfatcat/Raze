"use client";

import {
  ArrowDown,
  Check,
  CircleDollarSign,
  Code2,
  Database,
  MessageSquare,
  ShoppingCart,
  Store,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  {
    label: "Product discovery",
    icon: Database,
  },
  {
    label: "Cart creation",
    icon: ShoppingCart,
  },
  {
    label: "Checkout",
    icon: Zap,
  },
  {
    label: "Payment approval",
    icon: CircleDollarSign,
  },
];

export default function RazeArchitecture() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) =>
        current === steps.length - 1
          ? 0
          : current + 1
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="developers"
      className="
        relative
        overflow-hidden
        bg-[#FAF9F6]
        px-8
        py-28
        text-[#171513]
        lg:px-16
        lg:py-36
      "
    >
      {/* ======================================================= */}
      {/* BACKGROUND                                               */}
      {/* ======================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(30,25,20,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(30,25,20,0.7)_1px,transparent_1px)]
          [background-size:64px_64px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[20%]
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-[#A66A43]/5
          blur-[140px]
        "
      />

      {/* ======================================================= */}
      {/* HEADING                                                   */}
      {/* ======================================================= */}

      <div className="relative z-10 mx-auto max-w-[1100px] text-center">

        <p
          className="
            text-[11px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-[#A66A43]
          "
        >
          How Raze works
        </p>

        <h2
          className="
            mt-5
            text-[46px]
            font-normal
            leading-[0.98]
            tracking-[-0.045em]
            text-[#171513]
            sm:text-[58px]
            lg:text-[72px]
          "
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",
          }}
        >
          One SDK. An AI commerce layer.
        </h2>

        <p
          className="
            mx-auto
            mt-6
            max-w-[650px]
            text-[16px]
            leading-[1.7]
            text-[#6F6961]
            sm:text-[18px]
          "
        >
          Plug Raze into your storefront and give AI
          buyers a direct path from product discovery
          to customer-approved payment.
        </p>

      </div>

      {/* ======================================================= */}
      {/* ARCHITECTURE                                             */}
      {/* ======================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          mt-20
          max-w-[1200px]
        "
      >

        <div
          className="
            grid
            items-center
            gap-6
            lg:grid-cols-[1fr_1.35fr_1fr]
          "
        >

          {/* ================================================= */}
          {/* MERCHANT                                             */}
          {/* ================================================= */}

          <ArchitectureNode
            title="Your store"
            description="Your existing storefront"
            icon={Store}
            className="lg:justify-self-end"
          >

            <div
              className="
                mt-5
                rounded-xl
                border
                border-[#DDD6CA]
                bg-[#FAF9F6]
                p-3
              "
            >

              <div className="flex items-center gap-2">

                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#171513]
                    text-white
                  "
                >
                  <Store size={13} />
                </div>

                <div>

                  <p className="text-[11px] font-medium text-[#3F3A35]">
                    Merchant catalog
                  </p>

                  <p className="text-[10px] text-[#9A9288]">
                    Products · Pricing · Inventory
                  </p>

                </div>

              </div>

            </div>

          </ArchitectureNode>


          {/* ================================================= */}
          {/* RAZE CORE                                            */}
          {/* ================================================= */}

          <div
            className="
              relative
              rounded-[28px]
              border
              border-[#2B2926]
              bg-[#171513]
              p-7
              text-white
              shadow-[0_30px_100px_rgba(50,40,30,0.18)]
              lg:p-9
            "
          >

            {/* Top label */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#A66A43]
                  "
                >
                  <Zap
                    size={17}
                    strokeWidth={2}
                  />
                </div>

                <div>

                  <p className="text-[15px] font-medium">
                    Raze
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Commerce layer
                  </p>

                </div>

              </div>


              <span
                className="
                  rounded-full
                  border
                  border-emerald-400/20
                  bg-emerald-400/10
                  px-2.5
                  py-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-emerald-400
                "
              >
                Active
              </span>

            </div>


            {/* SDK */}

            <div
              className="
                mt-7
                rounded-xl
                border
                border-white/10
                bg-white/[0.045]
                px-4
                py-3
                font-mono
                text-[11px]
                text-white/65
              "
            >
              <span className="text-[#D49A70]">
                npm
              </span>{" "}
              install @raze/commerce-sdk
            </div>


            {/* Capabilities */}

            <div className="mt-6 space-y-2">

              {[
                "Agent-readable catalog",
                "Cart management",
                "Customer-approved payments",
              ].map((item) => (

                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-lg
                    px-2
                    py-2
                  "
                >

                  <Check
                    size={13}
                    className="text-[#D49A70]"
                  />

                  <span className="text-[12px] text-white/55">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>


          {/* ================================================= */}
          {/* AI BUYER                                            */}
          {/* ================================================= */}

          <ArchitectureNode
            title="AI buyer"
            description="Conversational shopping"
            icon={MessageSquare}
            className="lg:justify-self-start"
          >

            <div
              className="
                mt-5
                rounded-xl
                border
                border-[#DDD6CA]
                bg-[#FAF9F6]
                p-3
              "
            >

              <div
                className="
                  rounded-lg
                  bg-[#E7E2D9]
                  px-3
                  py-2
                "
              >

                <p className="text-[10px] text-[#6F6961]">
                  Find me headphones under ₹5,000
                </p>

              </div>


              <div className="mt-2 flex justify-end">

                <div
                  className="
                    rounded-lg
                    bg-[#171513]
                    px-3
                    py-2
                    text-[10px]
                    text-white
                  "
                >
                  Found 3 matches
                </div>

              </div>

            </div>

          </ArchitectureNode>

        </div>


        {/* ===================================================== */}
        {/* CONNECTIONS                                            */}
        {/* ===================================================== */}

        <div
          className="
            relative
            mx-auto
            mt-8
            max-w-[700px]
          "
        >

          <div
            className="
              absolute
              left-1/2
              top-0
              h-full
              w-px
              -translate-x-1/2
              bg-[#D8D1C5]
              lg:hidden
            "
          />

          <div
            className="
              hidden
              items-center
              justify-between
              lg:flex
            "
          >

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#9A9288]">
              <span>Store data</span>
              <ArrowDown className="rotate-[-90deg]" size={13} />
            </div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#9A9288]">
              <ArrowDown className="rotate-[90deg]" size={13} />
              <span>Agent actions</span>
            </div>

          </div>

        </div>


        {/* ===================================================== */}
        {/* JOURNEY                                                */}
        {/* ===================================================== */}

        <div className="mt-16">

          <div className="mb-5 flex items-center justify-between">

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-[#8F8880]
              "
            >
              One connected journey
            </p>

            <span
              className="
                text-[11px]
                text-[#A66A43]
              "
            >
              AI → Raze → Store
            </span>

          </div>


          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            {steps.map(
              (step, index) => {

                const Icon =
                  step.icon;

                const active =
                  index === activeStep;

                return (

                  <div
                    key={step.label}
                    className={`
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      p-5
                      transition-all
                      duration-500
                      ${
                        active
                          ? "border-[#A66A43]/40 bg-[#A66A43]/10 shadow-[0_15px_45px_rgba(166,106,67,0.08)]"
                          : "border-[#DDD6CA] bg-white/40"
                      }
                    `}
                  >

                    <div className="flex items-center justify-between">

                      <span
                        className={`
                          text-[11px]
                          font-medium
                          ${
                            active
                              ? "text-[#A66A43]"
                              : "text-[#9A9288]"
                          }
                        `}
                      >
                        0{index + 1}
                      </span>


                      <Icon
                        size={17}
                        strokeWidth={1.7}
                        className={
                          active
                            ? "text-[#A66A43]"
                            : "text-[#9A9288]"
                        }
                      />

                    </div>


                    <p
                      className={`
                        mt-8
                        text-[14px]
                        font-medium
                        ${
                          active
                            ? "text-[#3F3A35]"
                            : "text-[#6F6961]"
                        }
                      `}
                    >
                      {step.label}
                    </p>


                    {/* Active indicator */}

                    <div
                      className={`
                        absolute
                        bottom-0
                        left-0
                        h-[2px]
                        bg-[#A66A43]
                        transition-all
                        duration-700
                        ${
                          active
                            ? "w-full"
                            : "w-0"
                        }
                      `}
                    />

                  </div>

                );

              }
            )}

          </div>

        </div>


        {/* ===================================================== */}
        {/* FINAL MESSAGE                                         */}
        {/* ===================================================== */}

        <div
          className="
            mx-auto
            mt-20
            max-w-[700px]
            text-center
          "
        >

          <p
            className="
              text-[13px]
              leading-[1.7]
              text-[#6F6961]
            "
          >
            Your merchant keeps control of the catalog,
            cart, and payment boundaries. Raze handles
            the AI commerce experience in between.
          </p>

        </div>

      </div>

    </section>
  );
}


/* =============================================================== */
/* ARCHITECTURE NODE                                               */
/* =============================================================== */

function ArchitectureNode({
  title,
  description,
  icon: Icon,
  className = "",
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`
        w-full
        max-w-[300px]
        rounded-[24px]
        border
        border-[#DDD6CA]
        bg-white/50
        p-6
        shadow-[0_15px_50px_rgba(70,55,40,0.06)]
        backdrop-blur-sm
        ${className}
      `}
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-[#E7E2D9]
            text-[#A66A43]
          "
        >
          <Icon
            size={18}
            strokeWidth={1.7}
          />
        </div>


        <div>

          <h3
            className="
              text-[15px]
              font-medium
              text-[#3F3A35]
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-0.5
              text-[11px]
              text-[#9A9288]
            "
          >
            {description}
          </p>

        </div>

      </div>


      {children}

    </div>
  );
}