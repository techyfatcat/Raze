"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type RotatingTextProps = {
  words: string[];
  interval?: number;
  className?: string;
};

export default function RotatingText({
  words,
  interval = 2200,
  className = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={`relative inline-flex overflow-hidden align-bottom ${className}`}
      style={{
        verticalAlign: "baseline",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{
            opacity: 0,
            y: 24,
            filter: "blur(5px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -24,
            filter: "blur(5px)",
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}