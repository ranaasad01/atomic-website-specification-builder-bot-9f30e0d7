export interface NavLink {
  label: string;
  href: string;
}

export interface PricingTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const APP_NAME = "builder-bot";
export const APP_TAGLINE = "Your identity has an address.";
export const APP_DOMAIN = "builder-bot.com";
export const APP_ADDRESS_SUFFIX = ".builder-bot.com";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "The Bot", href: "#the-bot" },
  { label: "Network", href: "#network" },
  { label: "Pricing", href: "#pricing" },
];

export const navCTA = {
  label: "Claim Your Address",
  href: "#claim",
};