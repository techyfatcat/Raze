"use client";

import {
  ArrowRight,
  Check,
  Copy,
} from "lucide-react";

import { useState } from "react";

import Shuffle from "@/components/Shuffle";
import RotatingText from "@/components/RotatingText";

import RazeFeatures from "@/components/RazeFeatures";
import MerchantGrowth from "@/components/MerchantGrowth";
import RazeSDKSection from "@/components/RazeSDKSection";
import RazeFAQ from "@/components/RazeFAQ";
import RazeFooter from "@/components/RazeFooter";


export default function Home() {
  const [copied, setCopied] = useState(false);


  /* ============================================================= */
  /* COPY INSTALL COMMAND                                          */
  /* ============================================================= */

  async function copyInstallCommand() {
    await navigator.clipboard.writeText(
      "npm install @raze/commerce-sdk"
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }


  return (
    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-[#171513]
      "
    >


      {/* ========================================================= */}
      {/* NAVBAR                                                     */}
      {/* ========================================================= */}

      <header
        className="
          absolute
          inset-x-0
          top-0
          z-50
          px-4
          pt-4
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            mx-auto
            flex
            h-[54px]
            max-w-[800px]
            items-center
            justify-between
            rounded-[16px]
            border
            border-[#171513]/[0.08]
            bg-[#F7F4EE]/70
            px-4
            shadow-[0_8px_35px_rgba(40,30,20,0.06)]
            backdrop-blur-xl
            sm:px-5
          "
        >


          {/* =================================================== */}
          {/* BRAND                                                 */}
          {/* =================================================== */}

          <a
            href="/"
            className="
              text-[21px]
              font-semibold
              tracking-[-0.055em]
              text-[#171513]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:text-[#A66A43]
            "
          >
            Raze
          </a>


          {/* =================================================== */}
          {/* NAVIGATION                                            */}
          {/* =================================================== */}

          <nav
            className="
              hidden
              items-center
              gap-7
              md:flex
              lg:gap-8
            "
          >

            <NavLink
              href="#product"
              label="Product"
            />

            <NavLink
              href="#how-it-works"
              label="How it works"
            />

            <NavLink
              href="#developers"
              label="Developers"
            />

            <NavLink
              href="#pricing"
              label="Pricing"
            />

            <NavLink
              href="#resources"
              label="Resources"
            />

          </nav>


          {/* =================================================== */}
          {/* NAVBAR CTA                                            */}
          {/* =================================================== */}

          <a
            href="#developers"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-[11px]
              bg-[#171513]
              px-4
              py-2.5
              text-[12px]
              font-medium
              text-white
              shadow-[0_7px_20px_rgba(23,21,19,0.12)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#A66A43]
              hover:shadow-[0_10px_28px_rgba(166,106,67,0.25)]
              active:translate-y-0
            "
          >

            Get started

            <ArrowRight
              size={14}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

          </a>

        </div>

      </header>


      {/* ========================================================= */}
      {/* HERO                                                       */}
      {/* ========================================================= */}

      <section
        id="product"
        className="
          relative
          min-h-[100svh]
          overflow-hidden
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('/images/raze-hero-bg.png')",

          backgroundSize:
            "100% auto",

          backgroundPosition:
            "center 0px",
        }}
      >


        {/* ===================================================== */}
        {/* SUBTLE READABILITY OVERLAY                              */}
        {/* ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[#F7F4EE]/[0.04]
          "
        />


        {/* ===================================================== */}
        {/* HERO CONTENT                                            */}
        {/* ===================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[100svh]
            max-w-[1380px]
            items-center
            justify-center
            px-5
            pb-16
            pt-28
            sm:px-8
          "
        >

          <div
            className="
              flex
              w-full
              max-w-[850px]
              flex-col
              items-center
              text-center
            "
          >


           {/* ========================================================= */}
{/* HERO HEADING                                               */}
{/* ========================================================= */}

<h1
  className="
    mx-auto
    max-w-[920px]
    text-center
    text-[50px]
    font-normal
    leading-[0.94]
    tracking-[-0.06em]
    text-[#171513]
    sm:text-[64px]
    lg:text-[78px]
  "
  style={{
    fontFamily:
      "Georgia, 'Times New Roman', serif",
  }}
>
  Commerce that can

  <br />

  <RotatingText
    words={[
      "think.",
      "shop.",
      "transact.",
    ]}
    interval={2200}
    className="
      ml-2
      text-[#B56A3C]
    "
  />
</h1>


{/* ========================================================= */}
{/* HERO DESCRIPTION                                            */}
{/* ========================================================= */}

<div
  className="
    mt-8
    flex
    w-full
    max-w-[610px]
    flex-col
    items-center
    text-center
  "
>

  <p
    className="
      text-[16px]
      font-normal
      leading-[1.65]
      tracking-[-0.01em]
      text-[#625B53]
      sm:text-[17px]
    "
  >
    Raze is the commerce SDK that lets AI buyers{" "}
    <Shuffle
      text="discover products"
      tag="span"
      shuffleDirection="right"
      duration={0.35}
      animationMode="evenodd"
      shuffleTimes={1}
      ease="power3.out"
      stagger={0.03}
      threshold={0.1}
      triggerOnce={true}
      triggerOnHover={true}
      respectReducedMotion={true}
      loop={false}
      loopDelay={0}
      className="
        font-medium
        text-[#A66A43]
      "
    />
    {" "}manage carts, and complete secure,
    customer-approved payments in your store.
  </p>


  {/* Small supporting label */}

  <div
    className="
      mt-5
      flex
      items-center
      gap-2
      text-[10px]
      font-medium
      uppercase
      tracking-[0.18em]
      text-[#9A9087]
    "
  >

    <span
      className="
        h-px
        w-8
        bg-[#C9B8A8]
      "
    />

    AI-native commerce

    <span
      className="
        h-px
        w-8
        bg-[#C9B8A8]
      "
    />

  </div>

</div>

            {/* ================================================= */}
            {/* INSTALL COMMAND                                    */}
            {/* ================================================= */}

            <button
              onClick={copyInstallCommand}
              aria-label="Copy install command"
              className="
                group
                mt-6
                inline-flex
                items-center
                gap-3
                rounded-xl
                border
                border-[#171513]/[0.10]
                bg-[#171513]/[0.94]
                px-4
                py-3
                font-mono
                text-[12px]
                text-[#F7F4EE]
                shadow-[0_15px_40px_rgba(30,25,20,0.15)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#24211E]
                hover:shadow-[0_18px_45px_rgba(30,25,20,0.20)]
                active:translate-y-0
              "
            >

              <span
                className="
                  text-[#A66A43]
                "
              >
                $
              </span>

              <span>
                npm install @raze/commerce-sdk
              </span>

              {copied ? (

                <Check
                  size={14}
                  className="
                    ml-1
                    text-emerald-400
                  "
                />

              ) : (

                <Copy
                  size={14}
                  className="
                    ml-1
                    text-white/40
                    transition-colors
                    duration-200
                    group-hover:text-white/75
                  "
                />

              )}

            </button>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FEATURES                                                   */}
      {/* ========================================================= */}

      <RazeFeatures />

      <MerchantGrowth />

      <RazeSDKSection />

      <RazeFAQ />



      <RazeFooter />




      

    </main>
  );
}


/* ================================================================= */
/* NAVIGATION LINK                                                   */
/* ================================================================= */

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {

  return (
    <a
      href={href}
      className="
        group
        relative
        text-[13px]
        font-medium
        tracking-[-0.01em]
        text-[#625B53]
        transition-all
        duration-300
        hover:-translate-y-[1px]
        hover:text-[#A66A43]
      "
    >

      {label}

      <span
        className="
          absolute
          -bottom-1
          left-0
          h-px
          w-0
          bg-[#A66A43]
          transition-all
          duration-300
          group-hover:w-full
        "
      />

    </a>
  );
}