# Changelog
<!--
  Purpose:
  - Track project change history over time.
  - Record date, summary, and key files touched for each change set.
  - Keep entries append-only (do not delete past entries).
-->

## 2024-06-11 Brand and Homepage Overhaul – StripeFlow Release

- Rebranded all landing, navigation, dashboard, and auth content and messaging to StripeFlow.
- Updated main/homepage sections for StripeFlow professional payments SaaS:
  - Hero, Features, Benefits, Services, Sponsors, Pricing, Team, Testimonials, Contact, FAQ, and Footer.
- Updated defaultHomeContent in `content/home.ts` for StripeFlow brand context, value proposition, and product features.
- Updated all homepage React components to consume new StripeFlow values and copy.
- Navbar, Sidebar, Auth, and Dashboard layout headers now display StripeFlow instead of legacy project names.
- Contact form and footer now reference Chirag Dodiya (hi@chirag.co).
- All section content, CTAs, testimonials, FAQ, team, and pricing reflect StripeFlow attributes and targets.
- [Files affected]  
  - content/home.ts  
  - components/layout/navbar.tsx  
  - app/dashboard/layout.tsx  
  - app/auth/page.tsx  
  - app/page.tsx  
  - components/home/LayoutHeroSection.tsx  
  - components/home/LayoutFeatureGridSection.tsx  
  - components/home/LayoutBenefitsSection.tsx  
  - components/home/LayoutSponsorsSection.tsx  
  - components/home/LayoutPricingSection.tsx  
  - components/home/LayoutContactSection.tsx  
  - components/home/LayoutFooterSection.tsx  
  - components/home/LayoutServicesSection.tsx  
  - components/home/LayoutTeamSection.tsx  
  - components/home/LayoutTestimonialSection.tsx  
  - components/home/LayoutFaqSection.tsx

---