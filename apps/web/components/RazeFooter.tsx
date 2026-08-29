import { ArrowUpRight, Mail } from "lucide-react";

const navigation = {
  Product: ["Overview", "How it works", "SDK", "Pricing"],
  Developers: ["Documentation", "API reference", "Guides", "Changelog"],
  Resources: ["Use cases", "Blog", "Contact"],
};

export default function RazeFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#181614] px-5 pb-8 pt-16 text-[#F4EEE5] sm:px-8 lg:px-12 lg:pt-20"
    >
      {/* Large editorial wordmark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-8vw] select-none overflow-hidden">
        <div
          className="whitespace-nowrap text-center text-[27vw] font-semibold leading-none tracking-[-0.08em] text-[#F4EEE5]/[0.035]"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          raze
        </div>
      </div>

      <div className="relative mx-auto max-w-[1180px]">
        {/* Top CTA */}
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[#C88A63]">
              AI commerce infrastructure
            </p>

            <h2
              className="max-w-[720px] text-[48px] leading-[0.96] tracking-[-0.045em] sm:text-[64px] lg:text-[78px]"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Build commerce
              <br />
              agents can actually use.
            </h2>
          </div>

          <a
            href="#top"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#F4EEE5] px-5 py-3 text-sm font-medium text-[#191715] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
          >
            Get started

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#191715] text-[#F4EEE5] transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowUpRight size={15} />
            </span>
          </a>
        </div>

        {/* Main footer */}
        <div className="grid gap-12 py-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="text-[27px] font-semibold tracking-[-0.04em]">
              Raze
            </div>

            <p className="mt-5 max-w-[360px] text-[15px] leading-7 text-white/50">
              The commerce layer for AI buyers — from product discovery to
              checkout and payment recovery.
            </p>

            {/* Social icons */}
            <div className="mt-8 flex items-center gap-3">
              {/* Email */}
              <a
                href="#"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#C88A63]/60 hover:bg-[#C88A63]/10"
              >
                <Mail size={17} />
              </a>

              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#C88A63]/60 hover:bg-[#C88A63]/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[17px] w-[17px]"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.85 10.91.57.1.78-.25.78-.55v-2.13c-3.19.69-3.86-1.54-3.86-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.03 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.74.11 3.03.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#C88A63]/60 hover:bg-[#C88A63]/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[17px] w-[17px]"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.54 20.45H7.1V9H3.54v11.45ZM22.22 0H1.78C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(navigation).map(([title, links]) => (
              <div key={title}>
                <p className="mb-5 text-[12px] uppercase tracking-[0.16em] text-white/35">
                  {title}
                </p>

                <div className="space-y-3">
                  {links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block w-fit text-[14px] text-white/65 transition-colors duration-300 hover:text-[#C88A63]"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-[12px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Raze. All rights reserved.
          </span>

          <div className="flex gap-6">
            <a
              href="#"
              className="transition-colors duration-300 hover:text-white/70"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors duration-300 hover:text-white/70"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}