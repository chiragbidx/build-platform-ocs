// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};

// ... (types unchanged)

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "StripeFlow",
    badgeOuter: "Modern Payments for SaaS",
    titleBefore: "Accept payments with ",
    titleHighlight: "StripeFlow",
    titleAfter: ".",
    subtitle:
      "The modern payment platform for businesses and developers. Secure, reliable, and fast—manage payments, subscriptions, invoices, and financial reports from one SaaS dashboard.",
    primaryCta: { label: "Start with StripeFlow", href: "#pricing" },
    secondaryCta: { label: "See features", href: "#features" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "StripeFlow dashboard preview",
  },

  // ── Sponsors ─────────────────────────────────────────────────────────────
  sponsors: {
    heading: "Trusted by developers & teams",
    items: [
      { icon: "Vegan", name: "Stripe" },
      { icon: "Ghost", name: "OpenAI" },
      { icon: "Crown", name: "Vercel" },
      { icon: "Drama", name: "Sentry" },
      { icon: "Puzzle", name: "Supabase" },
      { icon: "Cookie", name: "Resend" },
    ],
  },

  // ── Benefits ─────────────────────────────────────────────────────────────
  benefits: {
    eyebrow: "Why StripeFlow",
    heading: "Modern payments, made simple",
    description:
      "From checkout to recurring billing and reporting, StripeFlow boosts productivity for businesses and developers. Reliable, secure, and ready to scale with you.",
    items: [
      {
        icon: "ShieldCheck",
        title: "Secure & Compliant",
        description: "Built with PCI principles in mind, so you never worry about card data or privacy.",
      },
      {
        icon: "Rocket",
        title: "Fast Integration",
        description: "Simple APIs and out-of-the-box UI lets you onboard or go live in minutes, not weeks.",
      },
      {
        icon: "Repeat",
        title: "Subscriptions & Invoices",
        description: "Flexible workflows for both one-time charges and recurring billing—no plug-ins required.",
      },
      {
        icon: "BarChart2",
        title: "Real-Time Reporting",
        description: "Track revenue, payments, client growth, and more from a single intuitive dashboard.",
      },
    ],
  },

  // ── Features ─────────────────────────────────────────────────────────────
  features: {
    eyebrow: "Payments Platform",
    heading: "End-to-end SaaS billing, in one place",
    subtitle:
      "StripeFlow gives you subscriptions, invoicing, payment processing, team collaboration, and actionable analytics—all ready to go.",
    items: [
      { icon: "CreditCard", title: "Card Payments", description: "Accept card payments instantly with secure, PCI-aware flows." },
      { icon: "Receipt", title: "Invoices", description: "Easily create, send, and track professional invoices with status and reminders." },
      { icon: "Repeat", title: "Subscriptions", description: "Flexible recurring plans—you pick the logic, StripeFlow does the rest." },
      { icon: "Users", title: "Client Management", description: "Organize clients, view activity, and maintain rich profiles and histories." },
      { icon: "Cube", title: "Product Catalog", description: "One-time or recurring—define products, set prices, and connect to invoices." },
      { icon: "BarChart3", title: "Reports & Analytics", description: "Download or explore payment, revenue, subscription, and churn metrics." },
    ],
  },

  // ── Services ─────────────────────────────────────────────────────────────
  services: {
    eyebrow: "StripeFlow Services",
    heading: "All your billing needs—no add-ons required",
    subtitle:
      "StripeFlow is built to minimize engineering drag. You focus on growth, we handle the payments infrastructure.",
    items: [
      { title: "User Authentication", description: "Secure registration, login, and workspace onboarding for every business.", pro: false },
      { title: "Multi-Tenant Dashboard", description: "Isolated views and roles for multiple business accounts.", pro: false },
      { title: "Collaboration & Activity Logs", description: "Invite team members, comment on invoices, and audit all actions.", pro: false },
      { title: "Exportable Data", description: "Download reports to CSV or PDF—no lock-in, ever.", pro: true },
    ],
  },

  // ── Testimonials ─────────────────────────────────────────────────────────
  testimonials: {
    eyebrow: "StripeFlow Success",
    heading: "Loved by modern SaaS teams",
    reviews: [
      {
        image: "/demo-img.jpg",
        name: "Emily Wang",
        role: "COO, Acme Billing",
        comment: "StripeFlow’s dashboard made onboarding and reporting delightfully simple. Our devs rolled out payments in days.",
        rating: 5.0,
      },
      {
        image: "/demo-img.jpg",
        name: "Brian Thompson",
        role: "Lead Engineer, DeployNow",
        comment: "Integrating subscriptions and invoicing took just a few hours. The developer docs are clear and top-notch.",
        rating: 4.9,
      },
      {
        image: "/demo-img.jpg",
        name: "Priya Desai",
        role: "Founder, SaaSnap",
        comment: "We never worry about PCI compliance—StripeFlow keeps payments secure and our team focused on product.",
        rating: 5.0,
      },
      {
        image: "/demo-img.jpg",
        name: "Liam O'Brien",
        role: "Product Manager, FinanceAlpha",
        comment: "Reporting and analytics are so easy to use. Highly recommend to any SaaS team handling payments.",
        rating: 4.8,
      },
      {
        image: "/demo-img.jpg",
        name: "Kate Novak",
        role: "CTO, RocketSubs",
        comment: "Our clients love the branded invoices and smooth checkout—StripeFlow just works.",
        rating: 5.0,
      },
    ],
  },

  // ── Team ─────────────────────────────────────────────────────────────────
  team: {
    eyebrow: "Meet the Team",
    heading: "StripeFlow is crafted by SaaS veterans",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Chirag",
        lastName: "Dodiya",
        positions: ["Founder", "Product/Engineering"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
          { name: "Github", url: "https://github.com/leoMirandaa" },
          { name: "X", url: "https://x.com/leo_mirand4" },
        ],
      },
      // ...retain additional team member slots, update names if you want real bios
    ],
  },

  // ── Pricing ──────────────────────────────────────────────────────────────
  pricing: {
    eyebrow: "Pricing",
    heading: "Pricing to fit every stage",
    subtitle: "Start for free, scale your operations as you grow. All plans include secure payments, subscriptions, invoicing, and analytics.",
    priceSuffix: "/mo",
    plans: [
      {
        title: "Starter",
        popular: false,
        price: 0,
        description: "For early projects and indie builders. Simulation/test-mode payments only.",
        buttonText: "Start free",
        benefits: [
          "Unlimited clients & invoices",
          "Simulate payments & subscriptions",
          "Team collaboration (1 business)",
          "In-app analytics & exports",
        ],
      },
      {
        title: "Growth",
        popular: true,
        price: 49,
        description: "Ideal for SaaS businesses shipping paid features.",
        buttonText: "Start 14-day trial",
        benefits: [
          "All Starter features",
          "Multiple business accounts",
          "Custom branding",
          "Scheduled reminders",
          "Priority support",
        ],
      },
      {
        title: "Enterprise",
        popular: false,
        price: 199,
        description: "For complex operations needing compliance, SSO, and advanced reporting.",
        buttonText: "Contact for demo",
        benefits: [
          "All Growth features",
          "Dedicated onboarding",
          "SSO & external integration support",
          "Compliance consulting",
          "SLA & audit logs",
        ],
      },
    ],
  },

  // ── Contact ──────────────────────────────────────────────────────────────
  contact: {
    eyebrow: "Contact",
    heading: "Talk to StripeFlow",
    description:
      "Questions about payments, onboarding, or integrations? Our team is ready to help you modernize your billing.",
    mailtoAddress: "hi@chirag.co",
    info: {
      address: { label: "Find us", value: "Remote-first • San Francisco, CA" },
      phone: { label: "Call us", value: "" },
      email: { label: "Email us", value: "hi@chirag.co" },
      hours: { label: "Visit us", value: ["Monday - Friday", "9AM - 6PM PT"] },
    },
    formSubjects: [
      "General Inquiry",
      "Platform Demo",
      "Integrations",
      "API / Developer Support",
      "Enterprise Features",
    ],
    formSubmitLabel: "Send message",
  },

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faq: {
    eyebrow: "FAQ",
    heading: "StripeFlow answers",
    items: [
      {
        question: "Do you support real payments?",
        answer: "StripeFlow supports both simulated payments (MVP) and real integration with Stripe in later updates.",
      },
      {
        question: "Is my data secure?",
        answer: "Yes. Your account and payment data are strictly isolated and protected by robust multi-tenant design.",
      },
      {
        question: "Can I automate reminders for invoices?",
        answer: "Absolutely, StripeFlow lets you send and schedule reminders for invoices automatically.",
      },
      {
        question: "Is there API access for developers?",
        answer: "API access and webhooks are available on Growth plans and up.",
      },
      {
        question: "How do I migrate from Stripe or another provider?",
        answer: "Contact us for onboarding support and data migration options.",
      },
    ],
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    brandName: "StripeFlow",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "hi@chirag.co", href: "mailto:hi@chirag.co" },
          { label: "Github", href: "https://github.com" },
          { label: "X", href: "https://x.com" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Contact Us", href: "#contact" },
          { label: "FAQ", href: "#faq" },
          { label: "Docs", href: "https://nextjs.org/docs" },
        ],
      },
      {
        heading: "Socials",
        links: [
          { label: "GitHub", href: "https://github.com" },
          { label: "Discord", href: "https://discord.com" },
          { label: "X", href: "https://x.com" },
        ],
      },
    ],
    copyright: "© 2026 StripeFlow Payments SaaS Platform.",
    attribution: { label: "Built on Next.js", href: "https://nextjs.org" },
  },

  // ── Navbar ───────────────────────────────────────────────────────────────
  navbar: {
    brandName: "StripeFlow",
    routes: [
      { href: "/#testimonials", label: "Testimonials" },
      { href: "/#team", label: "Team" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "Features",
    featureImage: { src: "/demo-img.jpg", alt: "StripeFlow payments preview" },
    features: [
      {
        title: "Payments, Invoices, Subscriptions",
        description: "All core billing flows, APIs, and UI to launch or grow your SaaS.",
      },
      {
        title: "Secure & Compliant",
        description: "Isolation, permissions and PCI principles applied everywhere.",
      },
      {
        title: "Analytics & Export",
        description: "Downloadable, filterable reports for your business needs.",
      },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://github.com", ariaLabel: "View on GitHub" },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}