"use client";

import {
  ArrowRight,
  Check,
  CreditCard,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export default function RazeAgentDemo() {
  return (
    <section
      id="how-it-works"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#F8F5EF]
        px-8
        py-28
        text-[#191715]
        lg:px-16
        lg:py-32
      "
    >
      {/* ========================================================= */}
      {/* BACKGROUND                                                 */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-32
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#D89A70]/[0.07]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#C7A9A0]/[0.07]
            blur-[160px]
          "
        />
      </div>


      {/* ========================================================= */}
      {/* CONTENT                                                     */}
      {/* ========================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          max-w-[1280px]
          items-center
          gap-20
          lg:grid-cols-[0.9fr_1.1fr]
          lg:gap-24
        "
      >

        {/* ======================================================= */}
        {/* LEFT                                                     */}
        {/* ======================================================= */}

        <div className="max-w-[560px]">

          {/* Eyebrow */}

         


          {/* Heading */}

          <h2
            className="
              max-w-[540px]
              text-[48px]
              font-normal
              leading-[1.02]
              tracking-[-0.055em]
              text-[#191715]
              sm:text-[58px]
              lg:text-[68px]
            "
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            From intent to
            <br />

            <span className="text-[#B66D43]">
              checkout.
            </span>
          </h2>


          {/* Description */}

          <p
            className="
              mt-7
              max-w-[490px]
              text-[16px]
              leading-[1.7]
              text-[#6F6861]
              sm:text-[17px]
            "
          >
            Raze gives AI buyers a direct path through
            your store — from discovering the right
            product to building a basket and completing
            a customer-approved purchase.
          </p>


          {/* ===================================================== */}
          {/* STEPS                                                   */}
          {/* ===================================================== */}

          <div className="mt-10 space-y-3">

            <Step
              number="01"
              icon={Search}
              title="Discover"
              description="Find the right product from your catalog."
              active
            />

            <Step
              number="02"
              icon={ShoppingBag}
              title="Build the basket"
              description="Add products and relevant recommendations."
            />

            <Step
              number="03"
              icon={CreditCard}
              title="Transact"
              description="Complete the purchase with customer approval."
            />

          </div>


       

        </div>


        {/* ======================================================= */}
        {/* RIGHT — IPHONE                                           */}
        {/* ======================================================= */}

        <div
          className="
            relative
            flex
            min-h-[650px]
            items-center
            justify-center
          "
        >

          {/* Ambient phone glow */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[480px]
              w-[360px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#B66D43]/[0.10]
              blur-[100px]
            "
          />


          {/* Floating status — top */}

          <div
            className="
              absolute
              left-[2%]
              top-[15%]
              z-20
              hidden
              items-center
              gap-2.5
              rounded-full
              border
              border-[#D9CEC2]
              bg-white/75
              px-4
              py-2.5
              shadow-[0_12px_35px_rgba(60,45,30,0.08)]
              backdrop-blur-xl
              sm:flex
            "
          >

            <div
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-emerald-500/10
                text-emerald-600
              "
            >
              <Check size={13} />
            </div>

            <span
              className="
                text-[12px]
                font-medium
                text-[#514A43]
              "
            >
              Product discovered
            </span>

          </div>


          {/* Floating status — bottom */}

          <div
            className="
              absolute
              bottom-[14%]
              right-[0%]
              z-20
              hidden
              items-center
              gap-2.5
              rounded-full
              border
              border-[#D9CEC2]
              bg-white/75
              px-4
              py-2.5
              shadow-[0_12px_35px_rgba(60,45,30,0.08)]
              backdrop-blur-xl
              sm:flex
            "
          >

            <div
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-[#B66D43]/10
                text-[#B66D43]
              "
            >
              <CreditCard size={13} />
            </div>

            <span
              className="
                text-[12px]
                font-medium
                text-[#514A43]
              "
            >
              Payment approved
            </span>

          </div>


          {/* =================================================== */}
          {/* IPHONE FRAME                                          */}
          {/* =================================================== */}

          <div
            className="
              relative
              z-10
              h-[620px]
              w-[305px]
              rounded-[46px]
              border-[7px]
              border-[#24211E]
              bg-[#24211E]
              p-[4px]
              shadow-[0_40px_100px_rgba(45,35,25,0.24)]
              sm:h-[670px]
              sm:w-[330px]
            "
          >

            {/* Titanium highlight */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-[40px]
                border
                border-white/20
              "
            />


            {/* Side button */}

            <div
              className="
                absolute
                -right-[10px]
                top-[145px]
                h-[75px]
                w-[4px]
                rounded-r-md
                bg-[#3A3632]
              "
            />


            {/* Volume buttons */}

            <div
              className="
                absolute
                -left-[10px]
                top-[135px]
                h-[45px]
                w-[4px]
                rounded-l-md
                bg-[#3A3632]
              "
            />

            <div
              className="
                absolute
                -left-[10px]
                top-[190px]
                h-[65px]
                w-[4px]
                rounded-l-md
                bg-[#3A3632]
              "
            />


            {/* Screen */}

            <div
              className="
                relative
                h-full
                w-full
                overflow-hidden
                rounded-[38px]
                bg-black
              "
            >

              {/* Dynamic island */}

              <div
                className="
                  absolute
                  left-1/2
                  top-[11px]
                  z-30
                  h-[27px]
                  w-[92px]
                  -translate-x-1/2
                  rounded-full
                  bg-black
                "
              />


              {/* VIDEO */}

              <video
                className="
                  h-full
                  w-full
                  object-cover
                "
                src="/videos/raze-agent.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


/* =============================================================== */
/* STEP                                                           */
/* =============================================================== */

function Step({
  number,
  icon: Icon,
  title,
  description,
  active = false,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
        group
        flex
        items-center
        gap-4
        rounded-2xl
        border
        px-4
        py-4
        transition-all
        duration-300

        ${
          active
            ? "border-[#D8C7B8] bg-white/65 shadow-[0_10px_30px_rgba(70,50,30,0.05)]"
            : "border-transparent hover:border-[#DDD2C7] hover:bg-white/40"
        }
      `}
    >

      {/* Number */}

      <span
        className={`
          w-6
          text-[11px]
          font-semibold
          tracking-[0.08em]

          ${
            active
              ? "text-[#B66D43]"
              : "text-[#A79D93]"
          }
        `}
      >
        {number}
      </span>


      {/* Icon */}

      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          transition-all
          duration-300

          ${
            active
              ? "border-[#D7BCA8] bg-[#B66D43]/10 text-[#B66D43]"
              : "border-[#DDD4CA] bg-white/60 text-[#756D65]"
          }
        `}
      >
        <Icon
          size={17}
          strokeWidth={1.7}
        />
      </div>


      {/* Text */}

      <div>

        <p
          className="
            text-[14px]
            font-medium
            text-[#302C28]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[12px]
            leading-5
            text-[#81786F]
          "
        >
          {description}
        </p>

      </div>

    </div>
  );
}