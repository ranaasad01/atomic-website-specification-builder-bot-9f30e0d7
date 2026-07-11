"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { APP_NAME, APP_TAGLINE, APP_DOMAIN } from "@/lib/data";
import { useTranslations } from "next-intl";

const footerColumns = [
  {
    titleKey: "footer.col.product",
    links: [
      { labelKey: "footer.link.howItWorks", href: "#how-it-works" },
      { labelKey: "footer.link.theBot", href: "#the-bot" },
      { labelKey: "footer.link.network", href: "#network" },
      { labelKey: "footer.link.pricing", href: "#pricing" },
    ],
  },
  {
    titleKey: "footer.col.company",
    links: [
      { labelKey: "footer.link.about", href: "#about" },
      { labelKey: "footer.link.blog", href: "#blog" },
      { labelKey: "footer.link.careers", href: "#careers" },
      { labelKey: "footer.link.contact", href: "#contact" },
    ],
  },
  {
    titleKey: "footer.col.legal",
    links: [
      { labelKey: "footer.link.privacy", href: "#privacy" },
      { labelKey: "footer.link.terms", href: "#terms" },
      { labelKey: "footer.link.cookies", href: "#cookies" },
    ],
  },
];

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (pathname === "/" && href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function getLinkHref(href: string): string {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  return (
    <footer className="bg-[#0B0B0F] border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8"
        >
          {/* Brand column */}
          <motion.div variants={fadeInUp} className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#F4F4F6] font-semibold text-lg tracking-tight">
                {APP_NAME}
              </span>
              <span
                className="inline-block w-[2px] h-4 bg-[#6E5BFF] rounded-full"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm text-[#9A9AA8] leading-relaxed mb-4">
              {APP_TAGLINE}
            </p>
            <p className="text-xs text-[#9A9AA8]/60">{APP_DOMAIN}</p>
          </motion.div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <motion.div key={col.titleKey} variants={fadeInUp}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#9A9AA8]/60 mb-4">
                {t(col.titleKey)}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={getLinkHref(link.href)}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="text-sm text-[#9A9AA8] hover:text-[#F4F4F6] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] rounded-sm"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-[#9A9AA8]/50">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-[#9A9AA8]/50">{t("footer.tagline")}</p>
        </motion.div>
      </div>
    </footer>
  );
}