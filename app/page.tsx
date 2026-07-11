"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Check, Sparkles, Star, User, FileText, Music, Edit, Layout, Activity, ChevronDown, Circle } from 'lucide-react';
import { APP_NAME, APP_DOMAIN, APP_ADDRESS_SUFFIX } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Reusable motion helpers ───────────────────────────────────────────────

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

// ─── Mock data ─────────────────────────────────────────────────────────────

const PLACEHOLDER_NAMES = [
  "yourname",
  "alex",
  "maya",
  "jordan",
  "sam",
  "priya",
  "leo",
  "zoe",
];

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    icon: "✦",
    title: "Claim your address",
    body: "Pick a handle. It becomes your permanent home on the web — yours forever.",
  },
  {
    number: "02",
    icon: "◈",
    title: "Chat with the bot",
    body: "Tell the AI what you do, what you love, what you want to share. It builds as you talk.",
  },
  {
    number: "03",
    icon: "◉",
    title: "Your site goes live",
    body: "In seconds, a real, beautiful site appears at your address. No code. No templates.",
  },
  {
    number: "04",
    icon: "◎",
    title: "Grow your network",
    body: "Follow others, get followed. Your address becomes your identity across the whole network.",
  },
];

const CHAT_MESSAGES = [
  { role: "bot", text: "Hey! What do you want your site to be about?" },
  { role: "user", text: "I'm a photographer and I sell prints." },
  {
    role: "bot",
    text: "Love it. Should I lead with a full-bleed gallery or a bold headline first?",
  },
  { role: "user", text: "Gallery. Dark background. Keep it minimal." },
  {
    role: "bot",
    text: "Done. I've added a shop section too — want to enable print orders?",
  },
  { role: "user", text: "Yes, and add an about page." },
  { role: "bot", text: "Your site is live at maya.builder-bot.com ✦" },
];

const BOT_PAYOFFS = [
  "Writes your bio from a single sentence",
  "Picks fonts, colors, and layout automatically",
  "Adds pages as you ask for them",
  "Connects your social links and portfolio",
  "Optimizes for search without you asking",
  "Updates live — no publish button needed",
];

const NETWORK_MEMBERS = [
  {
    handle: "maya",
    name: "Maya Chen",
    role: "Photographer",
    followers: 2841,
    image: "https://uploads-ssl.webflow.com/5e8ccb3a40dd6598b6fd7228/622f9a25f6795dcb6be4fdda_cover.png",
    accent: "#6E5BFF",
  },
  {
    handle: "jordan",
    name: "Jordan Reeves",
    role: "Music Producer",
    followers: 5120,
    image: "https://cdn.prod.website-files.com/64da807a9aa000087e97b92d/6527c14ba37fecf88834dcff_64677dfc599ba3c1195323c2_thumbnail560x720.jpeg",
    accent: "#FF5B8D",
  },
  {
    handle: "priya",
    name: "Priya Nair",
    role: "Writer",
    followers: 1390,
    image: "https://elements-resized.envatousercontent.com/elements-cover-images/74f25820-74a1-47ba-a144-8bbd36a8fbd6?w=433&cf_fit=scale-down&q=85&format=auto&s=c1abc88bc216c5b323d359697503796e0bf0e6cb66cc9917754a9f474ba04edf",
    accent: "#5BFFC8",
  },
  {
    handle: "leo",
    name: "Leo Vasquez",
    role: "Designer",
    followers: 3670,
    image: "https://elements-resized.envatousercontent.com/elements-cover-images/086b8d7e-ca11-4220-b942-a994caf14e37?w=433&cf_fit=scale-down&q=85&format=auto&s=278f87b79cfdcb99949b2f5790d5680a0339ddac190385e17751b852ab176ec7",
    accent: "#FFB85B",
  },
  {
    handle: "zoe",
    name: "Zoe Park",
    role: "Developer",
    followers: 4210,
    image: "https://upload.wikimedia.org/wikipedia/en/9/9b/Free%21_promotional_image_1.jpg",
    accent: "#5BB8FF",
  },
  {
    handle: "alex",
    name: "Alex Torres",
    role: "Creator",
    followers: 9880,
    image: "https://cdn.prod.website-files.com/64da807a9aa000087e97b92d/66e1fcc87dcb327d75737330_65ddf993d967da455617984f_0146ed2b-2c90-48ea-bfee-f3085b37b961.jpeg",
    accent: "#6E5BFF",
  },
];

const DISCOVER_FEED = [
  {
    handle: "maya",
    action: "published a new gallery",
    time: "2m ago",
  },
  {
    handle: "jordan",
    action: "dropped a new beat pack",
    time: "14m ago",
  },
  {
    handle: "priya",
    action: "posted an essay on solitude",
    time: "1h ago",
  },
  {
    handle: "leo",
    action: "updated their portfolio",
    time: "3h ago",
  },
];

const PERSONA_TABS = [
  { id: "creator", label: "Creator", icon: Activity },
  { id: "musician", label: "Musician", icon: Music },
  { id: "writer", label: "Writer", icon: FileText },
  { id: "designer", label: "Designer", icon: Layout },
  { id: "developer", label: "Developer", icon: Edit },
];

const PERSONA_PREVIEWS: Record<
  string,
  {
    headline: string;
    sub: string;
    accent: string;
    tags: string[];
    image: string;
  }
> = {
  creator: {
    headline: "alex.builder-bot.com",
    sub: "Videos, merch, and a community — all in one address.",
    accent: "#6E5BFF",
    tags: ["Videos", "Shop", "Newsletter", "Community"],
    image: "https://cdn.prod.website-files.com/64da807a9aa000087e97b92d/66e1fcc87dcb327d75737330_65ddf993d967da455617984f_0146ed2b-2c90-48ea-bfee-f3085b37b961.jpeg",
  },
  musician: {
    headline: "jordan.builder-bot.com",
    sub: "Stream your tracks, sell beats, and book shows.",
    accent: "#FF5B8D",
    tags: ["Music", "Beats", "Shows", "Press Kit"],
    image: "https://cdn.prod.website-files.com/64da807a9aa000087e97b92d/6527c14ba37fecf88834dcff_64677dfc599ba3c1195323c2_thumbnail560x720.jpeg",
  },
  writer: {
    headline: "priya.builder-bot.com",
    sub: "Essays, a newsletter, and a reading list — beautifully typeset.",
    accent: "#5BFFC8",
    tags: ["Essays", "Newsletter", "Reading List", "About"],
    image: "https://elements-resized.envatousercontent.com/elements-cover-images/74f25820-74a1-47ba-a144-8bbd36a8fbd6?w=433&cf_fit=scale-down&q=85&format=auto&s=c1abc88bc216c5b323d359697503796e0bf0e6cb66cc9917754a9f474ba04edf",
  },
  designer: {
    headline: "leo.builder-bot.com",
    sub: "Case studies, a shop, and client inquiries — all handled.",
    accent: "#FFB85B",
    tags: ["Portfolio", "Shop", "Case Studies", "Contact"],
    image: "https://elements-resized.envatousercontent.com/elements-cover-images/086b8d7e-ca11-4220-b942-a994caf14e37?w=433&cf_fit=scale-down&q=85&format=auto&s=278f87b79cfdcb99949b2f5790d5680a0339ddac190385e17751b852ab176ec7",
  },
  developer: {
    headline: "zoe.builder-bot.com",
    sub: "Projects, a blog, and your GitHub — one clean address.",
    accent: "#5BB8FF",
    tags: ["Projects", "Blog", "GitHub", "Resume"],
    image: "https://upload.wikimedia.org/wikipedia/en/9/9b/Free%21_promotional_image_1.jpg",
  },
};

const PRICING_TIERS = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Claim your address and launch a site today.",
    features: [
      "Your own .builder-bot.com address",
      "AI chat builder (10 messages/day)",
      "1 page site",
      "Network profile",
      "Follow up to 50 people",
    ],
    cta: "Claim for free",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    annualPrice: 9,
    description: "Everything you need to build a real presence.",
    features: [
      "Everything in Free",
      "Unlimited AI chat builder",
      "Unlimited pages",
      "Custom domain support",
      "Analytics dashboard",
      "Priority in discover feed",
      "Remove builder-bot branding",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    name: "Studio",
    monthlyPrice: 39,
    annualPrice: 29,
    description: "For teams, agencies, and power creators.",
    features: [
      "Everything in Pro",
      "Up to 5 addresses",
      "Team collaboration",
      "White-label option",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact us",
    highlighted: false,
  },
];

// ─── Address Claim Input ────────────────────────────────────────────────────

function AddressInput({
  size = "lg",
  onSubmit,
}: {
  size?: "lg" | "sm";
  onSubmit?: (handle: string) => void;
}) {
  const t = useTranslations();
  const [value, setValue] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_NAMES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkAvailability = useCallback((handle: string) => {
    if (!handle) {
      setStatus("idle");
      return;
    }
    setStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const taken = ["alex", "maya", "jordan", "sam"].includes(handle);
      setStatus(taken ? "taken" : "available");
    }, 600);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9-]/g, "");
    setValue(raw);
    checkAvailability(raw);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value && status === "available") {
      onSubmit?.(value);
    }
  }

  const isLg = size === "lg";

  return (
    <div className="w-full max-w-xl">
      <div
        className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
          status === "available"
            ? "border-[#6E5BFF]/60 shadow-[0_0_0_3px_rgba(110,91,255,0.15)]"
            : status === "taken"
            ? "border-red-500/40 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
            : "border-white/10 hover:border-white/20"
        } bg-white/[0.04] backdrop-blur-sm`}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER_NAMES[placeholderIdx] ?? "yourname"}
          aria-label={t("hero.inputLabel")}
          className={`flex-1 bg-transparent font-mono text-[#F4F4F6] placeholder-[#9A9AA8]/50 outline-none ${
            isLg ? "text-lg px-5 py-4" : "text-sm px-4 py-3"
          }`}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
        />
        <span
          className={`font-mono text-[#6E5BFF] pr-4 select-none whitespace-nowrap ${
            isLg ? "text-lg" : "text-sm"
          }`}
        >
          {APP_ADDRESS_SUFFIX}
        </span>
      </div>

      {/* Live address render */}
      <AnimatePresence mode="wait">
        {value && (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex items-center justify-between px-1"
          >
            <span className="font-mono text-sm">
              <span className="text-[#6E5BFF] font-semibold">{value}</span>
              <span className="text-[#9A9AA8]">{APP_ADDRESS_SUFFIX}</span>
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                status === "checking"
                  ? "text-[#9A9AA8] bg-white/5"
                  : status === "available"
                  ? "text-emerald-400 bg-emerald-400/10"
                  : status === "taken"
                  ? "text-red-400 bg-red-400/10"
                  : ""
              }`}
            >
              {status === "checking"
                ? t("address.checking")
                : status === "available"
                ? t("address.available")
                : status === "taken"
                ? t("address.taken")
                : ""}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {status === "available" && value && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => onSubmit?.(value)}
          className="mt-3 w-full py-3 rounded-xl bg-[#6E5BFF] text-white font-semibold text-sm hover:bg-[#5a49e8] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
        >
          {t("address.claimButton")} {value}{APP_ADDRESS_SUFFIX}
        </motion.button>
      )}
    </div>
  );
}

// ─── Chat Animation ─────────────────────────────────────────────────────────

function ChatThread() {
  const t = useTranslations();
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= CHAT_MESSAGES.length) return;
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 1200);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="flex flex-col gap-3 p-5 h-full overflow-hidden">
      <AnimatePresence initial={false}>
        {CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#6E5BFF] text-white rounded-br-sm"
                  : "bg-white/[0.07] text-[#F4F4F6] rounded-bl-sm border border-white/[0.06]"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {visibleCount < CHAT_MESSAGES.length && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex justify-start"
        >
          <div className="px-4 py-2.5 rounded-2xl bg-white/[0.07] border border-white/[0.06] flex gap-1 items-center">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                className="w-1.5 h-1.5 rounded-full bg-[#9A9AA8] inline-block"
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();
  const [annual, setAnnual] = useState(false);
  const [activePersona, setActivePersona] = useState("creator");
  const [followedHandles, setFollowedHandles] = useState<Set<string>>(new Set());
  const [claimedHandle, setClaimedHandle] = useState<string | null>(null);

  function toggleFollow(handle: string) {
    setFollowedHandles((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) {
        next.delete(handle);
      } else {
        next.add(handle);
      }
      return next;
    });
  }

  function handleClaim(handle: string) {
    setClaimedHandle(handle);
  }

  const currentPersona = PERSONA_PREVIEWS[activePersona] ?? PERSONA_PREVIEWS["creator"];

  return (
    <main className="bg-[#0B0B0F] text-[#F4F4F6] overflow-x-hidden">
      {/* ── §1 Hero ─────────────────────────────────────────────────────── */}
      <section
        id="claim"
        className="relative min-h-screen flex flex-col items-center justify-center px-5 md:px-8 pt-32 pb-24 text-center overflow-hidden"
      >
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-[700px] h-[700px] rounded-full bg-[#6E5BFF]/10 blur-[120px] opacity-60" />
        </div>
        <div
          className="pointer-events-none absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#FF5B8D]/5 blur-[80px]"
          aria-hidden="true"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#6E5BFF]/30 bg-[#6E5BFF]/10 text-[#6E5BFF] text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={12} />
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.05]"
          >
            {t("hero.headline")}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-[#9A9AA8] leading-relaxed max-w-xl text-pretty"
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div variants={fadeInUp} className="w-full flex justify-center">
            <AddressInput size="lg" onSubmit={handleClaim} />
          </motion.div>

          <AnimatePresence>
            {claimedHandle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
              >
                {t("hero.claimed")} <span className="font-mono font-bold">{claimedHandle}{APP_ADDRESS_SUFFIX}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p variants={fadeIn} className="text-xs text-[#9A9AA8]/50">
            {t("hero.footnote")}
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#9A9AA8]/40"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── §2 The Flip ─────────────────────────────────────────────────── */}
      <section className="relative px-5 md:px-8 py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-3">
              {t("flip.eyebrow")}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("flip.headline")}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            {/* Renting */}
            <motion.div
              variants={itemVariant}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 opacity-70"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AA8]/60 mb-5">
                {t("flip.rentingLabel")}
              </p>
              <ul className="space-y-3.5">
                {[
                  t("flip.renting1"),
                  t("flip.renting2"),
                  t("flip.renting3"),
                  t("flip.renting4"),
                  t("flip.renting5"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#9A9AA8]">
                    <span className="mt-0.5 text-[#9A9AA8]/40 text-base leading-none">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Owning */}
            <motion.div
              variants={itemVariant}
              className="rounded-2xl border border-[#6E5BFF]/40 bg-[#6E5BFF]/[0.06] p-8 shadow-[0_0_40px_-8px_rgba(110,91,255,0.3)] relative overflow-hidden"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 0%, rgba(110,91,255,0.15) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-5">
                {t("flip.owningLabel")}
              </p>
              <ul className="space-y-3.5">
                {[
                  t("flip.owning1"),
                  t("flip.owning2"),
                  t("flip.owning3"),
                  t("flip.owning4"),
                  t("flip.owning5"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#F4F4F6]">
                    <Check size={15} className="mt-0.5 text-[#6E5BFF] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── §3 How It Works ─────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative px-5 md:px-8 py-24 md:py-32 bg-white/[0.015]"
      >
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-3">
              {t("how.eyebrow")}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("how.headline")}
            </motion.h2>
          </motion.div>

          {/* Steps */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20"
          >
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                variants={itemVariant}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 hover:border-[#6E5BFF]/30 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl" aria-hidden="true">
                    {step.icon}
                  </span>
                  <span className="font-mono text-xs text-[#9A9AA8]/40 font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-semibold text-[#F4F4F6] mb-2 text-base">
                  {step.title}
                </h3>
                <p className="text-sm text-[#9A9AA8] leading-relaxed">{step.body}</p>
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-[#6E5BFF]/40 to-transparent"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Chat animation centerpiece */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-lg mx-auto rounded-2xl border border-white/[0.08] bg-[#111116] overflow-hidden shadow-[0_8px_40px_-8px_rgba(110,91,255,0.25)]"
          >
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex gap-1.5" aria-hidden="true">
                {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                  <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="font-mono text-xs text-[#9A9AA8]/60 ml-2">
                builder-bot chat
              </span>
            </div>
            <div className="h-72">
              <ChatThread />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── §4 The Bot ──────────────────────────────────────────────────── */}
      <section
        id="the-bot"
        className="relative px-5 md:px-8 py-24 md:py-32 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#6E5BFF]/8 blur-[100px]"
          aria-hidden="true"
        />
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: chat */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-2xl border border-white/[0.08] bg-[#111116] overflow-hidden shadow-[0_8px_40px_-8px_rgba(110,91,255,0.2)]"
          >
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex gap-1.5" aria-hidden="true">
                {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                  <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="font-mono text-xs text-[#9A9AA8]/60 ml-2">
                your-site.builder-bot.com
              </span>
            </div>
            <div className="h-80">
              <ChatThread />
            </div>
          </motion.div>

          {/* Right: payoffs */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-4">
              {t("bot.eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 text-balance">
              {t("bot.headline")}
            </h2>
            <p className="text-[#9A9AA8] leading-relaxed mb-8 text-pretty">
              {t("bot.sub")}
            </p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {BOT_PAYOFFS.map((payoff, i) => (
                <motion.li
                  key={i}
                  variants={itemVariant}
                  className="flex items-center gap-3 text-sm text-[#F4F4F6]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#6E5BFF]/20 border border-[#6E5BFF]/30 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-[#6E5BFF]" />
                  </span>
                  {payoff}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      {/* ── §5 The Network ──────────────────────────────────────────────── */}
      <section
        id="network"
        className="relative px-5 md:px-8 py-24 md:py-32 bg-white/[0.015]"
      >
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-3">
              {t("network.eyebrow")}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("network.headline")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-[#9A9AA8] max-w-xl mx-auto text-pretty">
              {t("network.sub")}
            </motion.p>
          </motion.div>

          {/* Masonry-style grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
          >
            {NETWORK_MEMBERS.map((member) => (
              <motion.div
                key={member.handle}
                variants={itemVariant}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden hover:border-white/[0.12] transition-colors duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]"
              >
                {/* Screenshot preview */}
                <div className="relative h-36 overflow-hidden bg-[#111116]">
                  <img
                    src={member.image}
                    alt={`${member.name}'s site preview`}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, transparent 40%, ${member.accent}22 100%)`,
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#F4F4F6] text-sm">{member.name}</p>
                      <p className="font-mono text-xs text-[#9A9AA8] mt-0.5">
                        {member.handle}{APP_ADDRESS_SUFFIX}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleFollow(member.handle)}
                      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] ${
                        followedHandles.has(member.handle)
                          ? "bg-white/[0.06] text-[#9A9AA8] border border-white/[0.08]"
                          : "bg-[#6E5BFF] text-white hover:bg-[#5a49e8]"
                      }`}
                    >
                      {followedHandles.has(member.handle) ? t("network.following") : t("network.follow")}
                    </motion.button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-[#9A9AA8]">
                      <span className="text-[#F4F4F6] font-semibold">
                        {(member.followers ?? 0).toLocaleString("en-US")}
                      </span>{" "}
                      {t("network.followers")}
                    </span>
                    <span className="text-[#9A9AA8]/30">·</span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        color: member.accent,
                        background: `${member.accent}18`,
                      }}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Discover feed */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="max-w-lg mx-auto rounded-2xl border border-white/[0.06] bg-[#111116] overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AA8]/60">
                {t("network.discoverFeed")}
              </p>
            </div>
            <ul className="divide-y divide-white/[0.04]">
              {DISCOVER_FEED.map((item, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#6E5BFF]/20 border border-[#6E5BFF]/20 flex items-center justify-center shrink-0">
                    <User size={13} className="text-[#6E5BFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-xs text-[#6E5BFF] font-semibold">
                      {item.handle}{APP_ADDRESS_SUFFIX}
                    </span>
                    <span className="text-xs text-[#9A9AA8]"> {item.action}</span>
                  </div>
                  <span className="text-xs text-[#9A9AA8]/40 shrink-0">{item.time}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── §6 What Your Site Can Be ────────────────────────────────────── */}
      <section className="relative px-5 md:px-8 py-24 md:py-32 overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#6E5BFF]/6 blur-[100px]"
          aria-hidden="true"
        />
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-3">
              {t("persona.eyebrow")}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("persona.headline")}
            </motion.h2>
          </motion.div>

          {/* Tab switcher */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {PERSONA_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActivePersona(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] ${
                    activePersona === tab.id
                      ? "bg-[#6E5BFF] text-white shadow-[0_0_16px_rgba(110,91,255,0.4)]"
                      : "bg-white/[0.04] text-[#9A9AA8] border border-white/[0.06] hover:text-[#F4F4F6] hover:border-white/[0.12]"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Persona preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePersona}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-2xl mx-auto rounded-2xl border overflow-hidden shadow-[0_8px_40px_-8px_rgba(110,91,255,0.2)]"
              style={{ borderColor: `${currentPersona.accent}40` }}
            >
              {/* Mini browser chrome */}
              <div
                className="flex items-center gap-2 px-5 py-3 border-b"
                style={{
                  background: `${currentPersona.accent}10`,
                  borderColor: `${currentPersona.accent}20`,
                }}
              >
                <div className="flex gap-1.5" aria-hidden="true">
                  {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                    <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span
                  className="font-mono text-xs ml-2"
                  style={{ color: currentPersona.accent }}
                >
                  {currentPersona.headline}
                </span>
              </div>
              <div className="relative h-48 bg-[#111116] overflow-hidden">
                <img
                  src={currentPersona.image}
                  alt={`${activePersona} site preview`}
                  className="w-full h-full object-cover opacity-60"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6"
                  style={{
                    background: `linear-gradient(135deg, ${currentPersona.accent}22 0%, rgba(11,11,15,0.7) 100%)`,
                  }}
                >
                  <p className="text-[#F4F4F6] font-semibold text-lg text-center text-balance">
                    {currentPersona.sub}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentPersona.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          color: currentPersona.accent,
                          background: `${currentPersona.accent}18`,
                          border: `1px solid ${currentPersona.accent}30`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── §7 Pricing ──────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="relative px-5 md:px-8 py-24 md:py-32 bg-white/[0.015]"
      >
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-3">
              {t("pricing.eyebrow")}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("pricing.headline")}
            </motion.h2>

            {/* Toggle */}
            <motion.div
              variants={fadeInUp}
              className="mt-6 inline-flex items-center gap-3 p-1 rounded-full bg-white/[0.04] border border-white/[0.06]"
            >
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] ${
                  !annual ? "bg-[#6E5BFF] text-white" : "text-[#9A9AA8] hover:text-[#F4F4F6]"
                }`}
              >
                {t("pricing.monthly")}
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] ${
                  annual ? "bg-[#6E5BFF] text-white" : "text-[#9A9AA8] hover:text-[#F4F4F6]"
                }`}
              >
                {t("pricing.annual")}
                <span className="ml-1.5 text-xs text-emerald-400 font-semibold">
                  {t("pricing.annualSave")}
                </span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {PRICING_TIERS.map((tier) => (
              <motion.div
                key={tier.name}
                variants={itemVariant}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                  tier.highlighted
                    ? "border border-[#6E5BFF]/50 bg-[#6E5BFF]/[0.07] shadow-[0_0_50px_-8px_rgba(110,91,255,0.35)]"
                    : "border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full bg-[#6E5BFF] text-white text-xs font-semibold shadow-[0_0_16px_rgba(110,91,255,0.5)]">
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <p className="font-semibold text-[#F4F4F6] text-lg mb-1">{tier.name}</p>
                  <p className="text-sm text-[#9A9AA8] leading-relaxed">{tier.description}</p>
                </div>
                <div className="mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={annual ? "annual" : "monthly"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-end gap-1"
                    >
                      <span className="text-4xl font-bold text-[#F4F4F6]">
                        ${annual ? tier.annualPrice : tier.monthlyPrice}
                      </span>
                      {(annual ? tier.annualPrice : tier.monthlyPrice) > 0 && (
                        <span className="text-sm text-[#9A9AA8] mb-1.5">{t("pricing.perMonth")}</span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  {annual && tier.annualPrice > 0 && (
                    <p className="text-xs text-[#9A9AA8]/60 mt-1">{t("pricing.billedAnnually")}</p>
                  )}
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#9A9AA8]">
                      <Check
                        size={14}
                        className={`mt-0.5 shrink-0 ${
                          tier.highlighted ? "text-[#6E5BFF]" : "text-[#9A9AA8]/60"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E5BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] ${
                    tier.highlighted
                      ? "bg-[#6E5BFF] text-white hover:bg-[#5a49e8] shadow-[0_0_20px_rgba(110,91,255,0.3)]"
                      : "bg-white/[0.06] text-[#F4F4F6] border border-white/[0.08] hover:bg-white/[0.1]"
                  }`}
                >
                  {tier.cta}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── §8 Final CTA ────────────────────────────────────────────────── */}
      <section className="relative px-5 md:px-8 py-24 md:py-36 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(110,91,255,0.18) 0%, rgba(11,11,15,0) 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 border-y border-[#6E5BFF]/10"
          aria-hidden="true"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-8"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#6E5BFF]/30 bg-[#6E5BFF]/10 text-[#6E5BFF] text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={12} />
              {t("cta.badge")}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-balance leading-[1.05]"
          >
            {t("cta.headline")}
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-[#9A9AA8] text-lg leading-relaxed text-pretty">
            {t("cta.sub")}
          </motion.p>

          <motion.div variants={fadeInUp} className="w-full flex justify-center">
            <AddressInput size="lg" onSubmit={handleClaim} />
          </motion.div>

          <motion.p variants={fadeIn} className="text-xs text-[#9A9AA8]/40">
            {t("cta.footnote")}
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}