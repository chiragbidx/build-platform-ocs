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

## 2024-06-11 Dashboard Nav/Feature Surface Expansion – StripeFlow

- Updated dashboard sidebar navigation for StripeFlow: new Platform entries (Clients, Products, Invoices, Payments, Subscriptions, Reports, Activity Log).
- Added placeholder pages for `/dashboard/clients`, `/dashboard/products`, `/dashboard/invoices`, `/dashboard/payments`, `/dashboard/subscriptions`, `/dashboard/reports`, `/dashboard/activity`, all with StripeFlow branded copy, empty states, and clear CTAs.
- Modernized section/route structure to reflect StripeFlow SaaS payments, billing, and analytics flows. 
- All new pages guarded by authentication, enforcing multi-tenant separation.
- [Files affected]
  - components/dashboard/sidebar-nav.tsx
  - app/dashboard/clients/page.tsx
  - app/dashboard/products/page.tsx
  - app/dashboard/invoices/page.tsx
  - app/dashboard/payments/page.tsx
  - app/dashboard/subscriptions/page.tsx
  - app/dashboard/reports/page.tsx
  - app/dashboard/activity/page.tsx

---