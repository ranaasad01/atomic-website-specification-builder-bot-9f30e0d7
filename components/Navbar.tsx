"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from 'lucide-react';
import { navLinks, navCTA, APP_NAME } from "@/lib/data";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
      setMobileOpen(false);
    } else {
      setMobileOpen(false);
    }
  }

  function getLinkHref(href: string): string {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0B0F]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">
          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] rounded-md"
            aria-label={t("nav.homeLabel")}
          >
            <span className="text-[#F4F4F6] font-semibold text-lg tracking-tight leading-none">
              {t("nav.wordmark")}
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
              className="inline-block w-[2px] h-4 bg-[#6E5BFF] rounded-full"
              aria-hidden="true"
            />
          </Link>

          {/* Center nav links — desktop */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label={t("nav.ariaLabel")}
          >
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={getLinkHref(link.href)}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="px-3 py-1.5 text-sm text-[#9A9AA8] hover:text-[#F4F4F6] transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF]"
              >
                {t(`nav.${link.label.toLowerCase().replace(/\s+/g, "")}`)}
              </Link>
            ))}
          </nav>

          {/* CTA — desktop */}
          <div className="hidden md:flex items-center">
            <Link
              href={getLinkHref(navCTA.href)}
              onClick={(e) => handleAnchorClick(e, navCTA.href)}
              className="px-4 py-2 text-sm font-medium rounded-full bg-[#6E5BFF] text-white hover:bg-[#5a49e8] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] shadow-[0_0_20px_rgba(110,91,255,0.35)]"
            >
              {t("nav.cta")}
            </Link>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden p-2 text-[#9A9AA8] hover:text-[#F4F4F6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] rounded-md"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#0B0B0F]/95 backdrop-blur-xl flex flex-col pt-20 px-6 pb-8"
          >
            <nav
              className="flex flex-col gap-2"
              aria-label={t("nav.mobileAriaLabel")}
            >
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={getLinkHref(link.href)}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="py-3 text-xl font-medium text-[#F4F4F6] border-b border-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] rounded-sm"
                >
                  {t(`nav.${link.label.toLowerCase().replace(/\s+/g, "")}`)}
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <Link
                href={getLinkHref(navCTA.href)}
                onClick={(e) => handleAnchorClick(e, navCTA.href)}
                className="block w-full text-center px-6 py-3.5 text-base font-semibold rounded-full bg-[#6E5BFF] text-white hover:bg-[#5a49e8] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] shadow-[0_0_24px_rgba(110,91,255,0.4)]"
              >
                {t("nav.cta")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}