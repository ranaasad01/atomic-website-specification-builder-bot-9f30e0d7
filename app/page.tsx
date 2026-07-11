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
    text: "Love it. Should I lead with a full-width gallery or a bold headline first?",
  },
  { role: "user", text: "Gallery. Dark background. Keep it minimal." },
  {
    role: "bot",
    text: "Done. I've added a shop section too — want to enable print orders?",
  },
  { role: "user", text: "Yes, and add an about page." },
  { role: "bot", text: "Your site is live at maya.builder-social.com ✦" },
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
    accent: "#00E0B8",
  },
  {
    handle: "sam",
    name: "Sam Rivera",
    role: "Illustrator",
    followers: 980,
    image: "https://elements-resized.envatousercontent.com/elements-cover-images/a3e6a9e4-6a3e-4b6e-8c3e-6a3e4b6e8c3e?w=433&cf_fit=scale-down&q=85&format=auto",
    accent: "#FF8C5B",
  },
];

const DISCOVER_FEED = [
  { handle: "maya", action: "published a new Prints page", time: "2h" },
  { handle: "jordan", action: "redesigned his home", time: "5h" },
  { handle: "priya", action: "added a new essay", time: "8h" },
  { handle: "leo", action: "launched a new portfolio", time: "1d" },
];

const PERSONA_TABS = [
  {
    id: "creator",
    label: "Creator",
    icon: <Sparkles size={14} />,
    headline: "Share your work with the world",
    description: "Portfolio, blog, and shop — all in one place.",
    color: "#6E5BFF",
    items: ["Portfolio grid", "Blog feed", "Shop integration", "Newsletter signup"],
  },
  {
    id: "musician",
    label: "Musician",
    icon: <Music size={14} />,
    headline: "Your music, your stage",
    description: "Stream, sell, and connect with fans directly.",
    color: "#FF5B8D",
    items: ["Music player", "Tour dates", "Merch store", "Fan community"],
  },
  {
    id: "writer",
    label: "Writer",
    icon: <FileText size={14} />,
    headline: "Words that live at your address",
    description: "Essays, fiction, journalism — beautifully presented.",
    color: "#00E0B8",
    items: ["Long-form editor", "Reading list", "Subscriber feed", "Dark/light mode"],
  },
  {
    id: "linkinbio",
    label: "Link-in-bio",
    icon: <Layout size={14} />,
    headline: "Link-in-bio, but the whole thing",
    description: "All your links, but make it a real website.",
    color: "#FFB85B",
    items: ["Link hub", "Social feed", "Contact form", "Analytics"],
  },
];

const PRICING_TIERS = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Everything you need to get started.",
    features: [
      "you.builder-social.com address",
      "Full AI chat builder",
      "Join the network",
      "Up to 5 pages",
      "Community support",
    ],
    cta: "Claim for free",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    annualPrice: 9,
    description: "For those who want to own their corner of the web.",
    features: [
      "Custom domain (you.com)",
      "Unlimited pages",
      "Priority AI bot",
      "Advanced analytics",
      "Remove builder-social branding",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Studio",
    monthlyPrice: 39,
    annualPrice: 29,
    description: "For teams and power users.",
    features: [
      "Multiple sites",
      "Team collaboration",
      "Advanced blocks",
      "API access",
      "White-label option",
      "Dedicated support",
    ],
    cta: "Start Studio",
    highlighted: false,
  },
];

// ─── Address Claim Input Component ─────────────────────────────────────────

function AddressInput({ size = "default" }: { size?: "default" | "large" }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder names
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_NAMES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sanitize = (raw: string) =>
    raw
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = sanitize(e.target.value);
    setValue(clean);

    if (!clean) {
      setStatus("idle");
      return;
    }

    setStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Mock availability check
      const taken = ["maya", "jordan", "priya", "leo", "zoe", "sam", "admin", "builder"];
      setStatus(taken.includes(clean) ? "taken" : "available");
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "available" && value) {
      alert(`Claiming ${value}.builder-social.com — sign-up flow coming soon!`);
    }
  };

  const isLarge = size === "large";

  return (
    <div className="w-full">
      {/* Live address preview */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-3 font-mono font-semibold ${
            isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
          }`}
          style={{
            background: "linear-gradient(120deg,#6E5BFF,#00E0B8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {value}.builder-social.com
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 flex items-center bg-[#15151C] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#6E5BFF]/60 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as unknown as React.FormEvent)}
            placeholder={PLACEHOLDER_NAMES[placeholderIndex]}
            aria-label="Enter your address name"
            className={`flex-1 bg-transparent font-mono text-[#F4F4F6] placeholder-[#9A9AA8]/50 outline-none px-4 ${
              isLarge ? "py-4 text-lg" : "py-3 text-base"
            }`}
            maxLength={32}
            autoComplete="off"
            spellCheck={false}
          />
          <span className={`pr-4 font-mono text-[#9A9AA8] whitespace-nowrap ${
            isLarge ? "text-lg" : "text-base"
          }`}>
            .builder-social.com
          </span>
        </div>

        <button
          type="submit"
          disabled={status !== "available"}
          className={`flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
            isLarge ? "px-7 py-4 text-base" : "px-5 py-3 text-sm"
          } ${
            status === "available"
              ? "bg-[#6E5BFF] hover:bg-[#5a49e8] text-white cursor-pointer"
              : "bg-[#6E5BFF]/30 text-white/40 cursor-not-allowed"
          }`}
        >
          Claim it <ArrowRight size={16} />
        </button>
      </form>

      {/* Status indicator */}
      <AnimatePresence mode="wait">
        {status !== "idle" && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 flex items-center gap-1.5 text-sm"
          >
            {status === "checking" && (
              <span className="text-[#9A9AA8]">Checking availability…</span>
            )}
            {status === "available" && (
              <>
                <Check size={14} className="text-[#00E0B8]" />
                <span className="text-[#00E0B8]">Available — it's yours!</span>
              </>
            )}
            {status === "taken" && (
              <span className="text-[#FF5B8D]">Already taken. Try another name.</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`py-24 md:py-32 px-5 md:px-8 ${
        className
      }`}
    >
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-4">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-4xl md:text-5xl font-bold text-[#F4F4F6] leading-tight mb-6">
      {children}
    </h2>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [activePersona, setActivePersona] = useState("creator");
  const [followedMembers, setFollowedMembers] = useState<Set<string>>(new Set());

  const toggleFollow = useCallback((handle: string) => {
    setFollowedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) {
        next.delete(handle);
      } else {
        next.add(handle);
      }
      return next;
    });
  }, []);

  const activePersonaData = PERSONA_TABS.find((p) => p.id === activePersona) ?? PERSONA_TABS[0];

  return (
    <div className="relative overflow-x-hidden">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
        aria-hidden="true"
      />

      {/* ── §1 HERO ─────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center px-5 md:px-8 pt-32 pb-24 overflow-hidden"
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(110,91,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(110,91,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(110,91,255,0.12) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Eyebrow */}
            <motion.p
              variants={itemVariant}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-6 px-3 py-1.5 rounded-full border border-[#6E5BFF]/30 bg-[#6E5BFF]/10"
            >
              <Sparkles size={12} />
              A social network made of websites
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={itemVariant}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#F4F4F6] leading-[1.05] tracking-tight mb-6 max-w-4xl"
            >
              Your identity has{" "}
              <span
                style={{
                  background: "linear-gradient(120deg,#6E5BFF,#00E0B8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                an address.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              variants={itemVariant}
              className="text-lg md:text-xl text-[#9A9AA8] max-w-2xl mb-10 leading-relaxed"
            >
              Not a profile you rent. A place you own. Tell the bot who you are
              — get a living website at{" "}
              <span className="font-mono text-[#F4F4F6]">you.builder-social.com</span>{" "}
              that is <em>you</em>.
            </motion.p>

            {/* Claim input */}
            <motion.div variants={itemVariant} className="w-full max-w-2xl mb-6">
              <AddressInput size="large" />
            </motion.div>

            {/* Trust line */}
            <motion.p
              variants={itemVariant}
              className="text-sm text-[#9A9AA8] flex flex-wrap justify-center gap-x-4 gap-y-1"
            >
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-[#00E0B8]" /> Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-[#00E0B8]" /> Live in 60 seconds
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-[#00E0B8]" /> No code, ever
              </span>
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#9A9AA8]/40"
          aria-hidden="true"
        >
          <ChevronDown size={20} className="animate-bounce" />
        </motion.div>
      </section>

      {/* ── §2 THE FLIP ─────────────────────────────────────────────────── */}
      <Section id="the-flip">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <SectionLabel>The argument</SectionLabel>
            <SectionHeading>
              You don't need another profile.{" "}
              <br className="hidden md:block" />
              You need a place.
            </SectionHeading>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Renting card */}
            <motion.div
              variants={fadeInUp}
              className="rounded-2xl border border-white/[0.06] bg-[#15151C] p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AA8]/60 mb-6">
                Renting a profile
              </p>
              <ul className="space-y-4">
                {[
                  "A row in someone's database",
                  "Looks like everyone else's",
                  "One feed, their rules",
                  "You're the product",
                  "@you on their platform",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#9A9AA8]">
                    <span className="mt-0.5 text-[#9A9AA8]/30">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Owning card */}
            <motion.div
              variants={fadeInUp}
              className="rounded-2xl border border-[#6E5BFF]/40 bg-[#15151C] p-8 relative overflow-hidden"
              style={{
                boxShadow: "0 0 40px rgba(110,91,255,0.12), inset 0 0 40px rgba(110,91,255,0.04)",
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  background: "linear-gradient(120deg,#6E5BFF,#00E0B8)",
                }}
                aria-hidden="true"
              />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-6">
                Owning an address
              </p>
              <ul className="space-y-4">
                {[
                  "A website that's yours",
                  "Looks like you",
                  "Your place, your design",
                  "You own the destination",
                  "you.builder-social.com",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#F4F4F6]">
                    <Check size={16} className="mt-0.5 text-[#00E0B8] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p
            variants={fadeInUp}
            className="text-center text-3xl md:text-4xl font-bold text-[#F4F4F6] mt-14"
          >
            One link.{" "}
            <span
              style={{
                background: "linear-gradient(120deg,#6E5BFF,#00E0B8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Infinite you.
            </span>
          </motion.p>
        </motion.div>
      </Section>

      {/* ── §3 HOW IT WORKS ─────────────────────────────────────────────── */}
      <Section id="how-it-works" className="bg-[#15151C]/40">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <SectionLabel>How it works</SectionLabel>
            <SectionHeading>You talk. The bot builds.</SectionHeading>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariant}
                className="bg-[#15151C] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden="true">{step.icon}</span>
                  <span className="font-mono text-xs text-[#9A9AA8]/40">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#F4F4F6]">{step.title}</h3>
                <p className="text-sm text-[#9A9AA8] leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Chat → Site animation */}
          <motion.div
            variants={scaleIn}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {/* Chat panel */}
            <div className="bg-[#15151C] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AA8]/60 mb-2">
                Chat
              </p>
              {CHAT_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#6E5BFF] text-white"
                        : "bg-[#0B0B0F] text-[#9A9AA8] border border-white/[0.06]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Site preview panel */}
            <div className="bg-[#15151C] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AA8]/60 mb-4">
                Live site
              </p>
              <div className="flex-1 rounded-xl overflow-hidden bg-[#0B0B0F] border border-white/[0.06] flex flex-col">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B8D]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFB85B]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E0B8]/60" />
                  <span className="ml-2 font-mono text-[10px] text-[#9A9AA8]/40">
                    maya.builder-social.com
                  </span>
                </div>
                {/* Mock site content */}
                <div className="flex-1 p-4 flex flex-col gap-3">
                  <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-[#6E5BFF]/20 to-[#00E0B8]/20 flex items-center justify-center">
                    <span className="text-[#9A9AA8]/40 text-xs">Gallery</span>
                  </div>
                  <div className="h-3 rounded bg-white/[0.06] w-3/4" />
                  <div className="h-3 rounded bg-white/[0.06] w-1/2" />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="aspect-square rounded-lg bg-white/[0.04]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ── §4 THE BOT ──────────────────────────────────────────────────── */}
      <Section id="the-bot">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <SectionLabel>The AI</SectionLabel>
            <SectionHeading>
              Meet builder-social.{" "}
              <br className="hidden md:block" />
              It never sleeps, and it's really good at{" "}
              <span
                style={{
                  background: "linear-gradient(120deg,#6E5BFF,#00E0B8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                you.
              </span>
            </SectionHeading>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Chat thread */}
            <motion.div
              variants={slideInLeft}
              className="bg-[#15151C] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-3"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AA8]/60 mb-2">
                A real conversation
              </p>
              {CHAT_MESSAGES.slice(0, 5).map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#6E5BFF] text-white"
                        : "bg-[#0B0B0F] text-[#9A9AA8] border border-white/[0.06]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Payoffs */}
            <motion.div variants={slideInRight} className="flex flex-col gap-4">
              {BOT_PAYOFFS.map((payoff) => (
                <div
                  key={payoff}
                  className="flex items-start gap-4 p-5 bg-[#15151C] border border-white/[0.06] rounded-xl"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(110,91,255,0.15)" }}
                  >
                    <Sparkles size={14} className="text-[#6E5BFF]" />
                  </div>
                  <p className="text-[#F4F4F6] text-sm leading-relaxed pt-1">{payoff}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* ── §5 THE NETWORK ──────────────────────────────────────────────── */}
      <Section id="network" className="bg-[#15151C]/40">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <SectionLabel>The network</SectionLabel>
            <SectionHeading>A whole internet made of people.</SectionHeading>
            <p className="text-lg text-[#9A9AA8] max-w-2xl mx-auto">
              Follow the sites you love. Get a feed of places, not posts. Link
              to friends and build the web-ring back.
            </p>
          </motion.div>

          {/* Member grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {NETWORK_MEMBERS.map((member) => (
              <motion.div
                key={member.handle}
                variants={itemVariant}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-[#15151C] border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Screenshot */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={member.image}
                    alt={`${member.name}'s site preview`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
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

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-[#F4F4F6]">{member.name}</p>
                      <p
                        className="font-mono text-xs mt-0.5"
                        style={{ color: member.accent }}
                      >
                        {member.handle}.builder-social.com
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFollow(member.handle)}
                      className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                        followedMembers.has(member.handle)
                          ? "bg-[#6E5BFF]/20 border-[#6E5BFF]/40 text-[#6E5BFF]"
                          : "border-white/10 text-[#9A9AA8] hover:border-[#6E5BFF]/40 hover:text-[#6E5BFF]"
                      }`}
                      aria-label={`${
                        followedMembers.has(member.handle) ? "Unfollow" : "Follow"
                      } ${member.name}`}
                    >
                      {followedMembers.has(member.handle) ? "Following" : "Follow"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#9A9AA8]">{member.role}</p>
                    <span className="text-[#9A9AA8]/30">·</span>
                    <p className="text-xs text-[#9A9AA8]">
                      {member.followers.toLocaleString("en-US")} followers
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Discover feed mock */}
          <motion.div variants={fadeInUp} className="max-w-md mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AA8]/60 mb-4 text-center">
              Discover feed
            </p>
            <div className="bg-[#15151C] border border-white/[0.06] rounded-2xl overflow-hidden">
              {DISCOVER_FEED.map((item, i) => (
                <div
                  key={item.handle + i}
                  className={`flex items-center gap-3 px-5 py-4 ${
                    i < DISCOVER_FEED.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#6E5BFF]/20 flex items-center justify-center shrink-0">
                    <User size={14} className="text-[#6E5BFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F4F4F6] truncate">
                      <span className="font-mono text-[#6E5BFF]">{item.handle}</span>{" "}
                      {item.action}
                    </p>
                  </div>
                  <span className="text-xs text-[#9A9AA8]/60 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ── §6 WHAT YOUR SITE CAN BE ────────────────────────────────────── */}
      <Section id="personas">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <SectionLabel>For everyone</SectionLabel>
            <SectionHeading>Whoever you are, your address fits.</SectionHeading>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {PERSONA_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePersona(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activePersona === tab.id
                    ? "border-[#6E5BFF]/60 bg-[#6E5BFF]/15 text-[#F4F4F6]"
                    : "border-white/10 text-[#9A9AA8] hover:border-white/20 hover:text-[#F4F4F6]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Persona preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePersona}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto bg-[#15151C] border border-white/[0.06] rounded-2xl overflow-hidden"
            >
              {/* Browser chrome */}
              <div
                className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2"
                style={{ background: `${activePersonaData.color}10` }}
              >
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <span className="font-mono text-xs text-[#9A9AA8]/60 ml-2">
                  you.builder-social.com
                </span>
              </div>

              <div className="p-8">
                <div
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
                  style={{
                    color: activePersonaData.color,
                    background: `${activePersonaData.color}18`,
                  }}
                >
                  {activePersonaData.icon}
                  {activePersonaData.label}
                </div>
                <h3 className="text-2xl font-bold text-[#F4F4F6] mb-2">
                  {activePersonaData.headline}
                </h3>
                <p className="text-[#9A9AA8] mb-6">{activePersonaData.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {activePersonaData.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-[#F4F4F6]"
                    >
                      <Check size={14} style={{ color: activePersonaData.color }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Section>

      {/* ── §7 PRICING ──────────────────────────────────────────────────── */}
      <Section id="pricing" className="bg-[#15151C]/40">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <SectionLabel>Pricing</SectionLabel>
            <SectionHeading>Start free. Own it forever.</SectionHeading>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-3 mb-12"
          >
            <span
              className={`text-sm ${
                !billingAnnual ? "text-[#F4F4F6]" : "text-[#9A9AA8]"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingAnnual((v) => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                billingAnnual ? "bg-[#6E5BFF]" : "bg-white/10"
              }`}
              aria-label="Toggle billing period"
              role="switch"
              aria-checked={billingAnnual}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  billingAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm flex items-center gap-1.5 ${
                billingAnnual ? "text-[#F4F4F6]" : "text-[#9A9AA8]"
              }`}
            >
              Annual
              <span className="text-xs font-semibold text-[#00E0B8] bg-[#00E0B8]/10 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </motion.div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <motion.div
                key={tier.name}
                variants={itemVariant}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  tier.highlighted
                    ? "border border-[#6E5BFF]/50 bg-[#15151C]"
                    : "border border-white/[0.06] bg-[#15151C]"
                }`}
                style={
                  tier.highlighted
                    ? {
                        boxShadow:
                          "0 0 40px rgba(110,91,255,0.15), inset 0 0 40px rgba(110,91,255,0.04)",
                      }
                    : {}
                }
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#6E5BFF] text-white">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#F4F4F6] mb-1">{tier.name}</h3>
                  <p className="text-sm text-[#9A9AA8]">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-[#F4F4F6]">
                    ${billingAnnual ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  {(billingAnnual ? tier.annualPrice : tier.monthlyPrice) > 0 && (
                    <span className="text-[#9A9AA8] text-sm ml-1">/mo</span>
                  )}
                  {billingAnnual &&
                    (billingAnnual ? tier.annualPrice : tier.monthlyPrice) > 0 && (
                      <p className="text-xs text-[#9A9AA8]/60 mt-1">Billed annually</p>
                    )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[#9A9AA8]">
                      <Check size={14} className="mt-0.5 text-[#00E0B8] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="#claim"
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    tier.highlighted
                      ? "bg-[#6E5BFF] hover:bg-[#5a49e8] text-white"
                      : "border border-white/10 text-[#F4F4F6] hover:border-[#6E5BFF]/40 hover:text-[#6E5BFF]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── §8 FINAL CTA ────────────────────────────────────────────────── */}
      <section
        id="claim"
        className="relative py-32 px-5 md:px-8 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0B0B0F 0%, #1a1040 50%, #0B0B0F 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(110,91,255,0.18) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col items-center"
          >
            <motion.p
              variants={itemVariant}
              className="text-xs font-semibold uppercase tracking-widest text-[#6E5BFF] mb-4"
            >
              Your corner of the internet
            </motion.p>
            <motion.h2
              variants={itemVariant}
              className="text-4xl md:text-6xl font-bold text-[#F4F4F6] mb-6 leading-tight"
            >
              Go claim your corner{" "}
              <br className="hidden md:block" />
              of the internet.
            </motion.h2>
            <motion.p
              variants={itemVariant}
              className="text-lg text-[#9A9AA8] mb-10"
            >
              It's yours in 60 seconds.
            </motion.p>
            <motion.div variants={itemVariant} className="w-full max-w-2xl">
              <AddressInput size="large" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
