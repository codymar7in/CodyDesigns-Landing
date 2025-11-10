import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type PortfolioItem = {
  id: number;
  businessName: string;
  location: string;
  industry: string;
  industryColor: string;
  description: string;
  metric: string;
  features: string[];
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  darkGradientFrom: string;
  darkGradientVia: string;
  darkGradientTo: string;
};

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    businessName: "Mountain Peak Diner",
    location: "Bozeman, MT",
    industry: "Restaurant",
    industryColor: "bg-blue-600",
    description:
      "A modern, mobile-friendly website with online menu, reservation system, and stunning photo galleries that transformed their online presence.",
    metric: "↑ 45% online orders",
    features: ["Online Menu", "Reservations", "Photo Gallery", "Mobile-First"],
    gradientFrom: "from-blue-600",
    gradientVia: "via-blue-500",
    gradientTo: "to-indigo-600",
    darkGradientFrom: "dark:from-blue-900",
    darkGradientVia: "dark:via-indigo-800",
    darkGradientTo: "dark:to-slate-900",
  },
  {
    id: 2,
    businessName: "Big Sky Outfitters",
    location: "Missoula, MT",
    industry: "Retail",
    industryColor: "bg-indigo-600",
    description:
      "Fast-loading e-commerce site with product catalog, seamless checkout, and beautiful product photography that showcases their inventory.",
    metric: "↑ 60% website traffic",
    features: ["E-Commerce", "Product Catalog", "Fast Checkout", "SEO Optimized"],
    gradientFrom: "from-indigo-600",
    gradientVia: "via-indigo-500",
    gradientTo: "to-slate-700",
    darkGradientFrom: "dark:from-indigo-900",
    darkGradientVia: "dark:via-slate-800",
    darkGradientTo: "dark:to-slate-950",
  },
  {
    id: 3,
    businessName: "Montana Home Services",
    location: "Billings, MT",
    industry: "Services",
    industryColor: "bg-slate-700",
    description:
      "Clean, professional website with service listings, customer testimonials, and easy contact forms that builds trust and credibility.",
    metric: "↑ 35% lead inquiries",
    features: ["Service Listings", "Testimonials", "Contact Forms", "Trust Building"],
    gradientFrom: "from-slate-700",
    gradientVia: "via-blue-600",
    gradientTo: "to-indigo-700",
    darkGradientFrom: "dark:from-slate-800",
    darkGradientVia: "dark:via-blue-900",
    darkGradientTo: "dark:to-indigo-950",
  },
];

const THEME_STORAGE_KEY = "codydesigns-theme";
const INPUT_BASE_CLASSES =
  "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-ink placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-white dark:border-surface-outline dark:bg-surface-elevated/80 dark:text-ink-inverted dark:placeholder:text-ink-accent/70 dark:focus:ring-offset-surface-base";
const TEXTAREA_BASE_CLASSES =
  "resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-ink placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-white dark:border-surface-outline dark:bg-surface-elevated/80 dark:text-ink-inverted dark:placeholder:text-ink-accent/70 dark:focus:ring-offset-surface-base";
const ERROR_INPUT_CLASSES =
  "border-red-400 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:border-red-400/80 dark:focus:ring-red-400";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [activeSection, setActiveSection] = useState<"services" | "packages" | "portfolio" | "contact">("services");
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  const navItems = [
    { id: "services", label: "Services", href: "#services" },
    { id: "packages", label: "Packages", href: "#packages" },
    { id: "portfolio", label: "Portfolio", href: "#portfolio" },
    { id: "contact", label: "Contact", href: "#contact" },
  ] as const;

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } else {
      root.classList.remove("dark");
      window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return;
      }
      setIsDark(event.matches);
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sectionIds: Array<"services" | "packages" | "portfolio" | "contact"> = ["services", "packages", "portfolio", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id as typeof sectionIds[number]);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.35, 0.6, 0.9],
      },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const message = (formData.get("message") ?? "").toString().trim();

    const nextErrors = {
      name: name.length === 0,
      email: email.length === 0 || !EMAIL_PATTERN.test(email),
      message: message.length === 0,
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setFieldErrors(nextErrors);
      setFormStatus("error");
      return;
    }

    setFieldErrors({ name: false, email: false, message: false });
    setFormStatus("idle");
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus("success");
      form.reset();
    }, 900);
  };

  return (
    <div className="min-h-screen bg-surface-subtle text-ink dark:bg-surface-base dark:text-ink-inverted">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-hero-grid opacity-60 dark:hidden mask-fade-bottom" />
        <div className="pointer-events-none absolute inset-0 hidden bg-hero-grid-dark opacity-80 dark:block mask-fade-bottom" />
        <div className="pointer-events-none absolute inset-0 bg-dotted mask-fade-bottom" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-24 pt-12 md:px-10 lg:px-16">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-lg font-semibold">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/40">
                CD
              </div>
              <div className="space-y-0.5">
                <span className="text-sm uppercase tracking-[0.24em] text-slate-400 dark:text-ink-accent">
                  CodyDesigns
                </span>
                <p className="text-base font-medium text-ink dark:text-ink-inverted">
                  Montana Websites
                </p>
              </div>
            </div>

            <nav className="flex flex-1 justify-center" aria-label="Primary">
              <ul className="flex flex-wrap items-center gap-8 text-sm font-medium md:text-base">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className={`group relative inline-flex items-center px-1.5 py-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 after:absolute after:-bottom-2 after:left-1/2 after:h-[3px] after:w-full after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:opacity-0 after:transition after:duration-300 after:content-[''] after:[transform-origin:center] ${
                          isActive
                            ? "text-ink dark:text-white after:opacity-100"
                            : "text-ink-soft dark:text-ink-accent hover:text-ink dark:hover:text-white group-hover:after:opacity-100"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label={`Activate ${isDark ? "light" : "dark"} mode`}
                aria-pressed={isDark}
                onClick={() => setIsDark((prev) => !prev)}
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/60 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600 dark:border-surface-outline dark:bg-surface-elevated/80 dark:text-ink-accent dark:shadow-card-dark/40 dark:hover:border-brand.light dark:hover:text-brand.light"
              >
                {isDark ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12.79A9 9 0 1 1 11.21 3 7.5 7.5 0 0 0 21 12.79Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1.5M12 19.5V21M4.5 12H3M21 12h-1.5M5.636 5.636 6.7 6.7M17.3 17.3l1.064 1.064M5.636 18.364 6.7 17.3M17.3 6.7l1.064-1.064M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"
                    />
                  </svg>
                )}
              </button>
              <a
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/30 sm:px-6 sm:py-3 dark:bg-white/90 dark:text-ink dark:shadow-button-dark dark:hover:shadow-button-dark"
                href="#contact"
              >
                Get Started
              </a>
            </div>
          </header>

          <main
            id="main-content"
            className="flex flex-1 flex-col gap-20 py-12 md:py-20"
          >
            <section id="services" className="text-center">
              <div className="mx-auto max-w-3xl space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 shadow-sm backdrop-blur dark:border-surface-outline dark:bg-surface-elevated/60 dark:text-ink-accent dark:shadow-card-dark/20">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Serving Montana Businesses
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-ink dark:text-ink-inverted sm:text-5xl sm:leading-tight lg:text-6xl">
                  Fast, AI-Powered Websites
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-900 bg-clip-text text-transparent dark:from-brand.light dark:via-brand.glow dark:to-white/80">
                    That Bring In Customers
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-base text-ink-soft dark:text-ink-accent sm:text-lg">
                  CodyDesigns helps Montana businesses modernize their online presence with fast, 
                  AI-powered websites. From local restaurants to retail shops, we build websites that 
                  look great, load fast, and bring in more customers—starting at just $300.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    href="#contact"
                  >
                    Get Your Website
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="ml-2 h-5 w-5"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            <section id="packages" className="space-y-12">
              <div className="text-center space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-blue-600 shadow-sm dark:from-blue-950/30 dark:to-indigo-950/30 dark:text-blue-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website Packages
                </span>
                <h2 className="text-4xl font-bold tracking-tight text-ink dark:text-ink-inverted sm:text-5xl">
                  Choose the perfect package
                  <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-slate-300">
                    for your business
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-ink-soft dark:text-ink-accent">
                  All packages include fast, AI-powered websites that are mobile-friendly, 
                  SEO-optimized, and designed to bring in customers.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="group relative rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-lg shadow-slate-200/50 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-surface-outline/60 dark:from-surface-elevated/90 dark:to-surface-muted/50 dark:shadow-card-dark dark:hover:shadow-blue-500/20">
                  <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-ink dark:text-ink-inverted">Basic</h3>
                        <div className="mt-1">
                          <span className="text-3xl font-bold text-ink dark:text-ink-inverted">$300</span>
                          <span className="text-sm font-medium text-ink-muted dark:text-ink-accent/70">/one-time</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-ink-soft dark:text-ink-accent leading-relaxed">
                      Perfect for small businesses getting started online
                    </p>
                    <ul className="space-y-3.5 text-sm text-ink-soft dark:text-ink-accent">
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Up to 5 pages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Mobile-responsive design</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Contact form</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Basic SEO optimization</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Fast loading times</span>
                      </li>
                    </ul>
                    <a
                      href="#contact"
                      className="mt-8 block w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 dark:shadow-blue-500/20"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
                <div className="group relative rounded-[32px] border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 p-8 shadow-xl shadow-blue-500/20 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30 dark:border-blue-400 dark:from-blue-950/40 dark:via-surface-elevated/90 dark:to-indigo-950/40 dark:shadow-blue-500/30 dark:hover:shadow-blue-500/40">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-500/40 dark:from-blue-400 dark:to-indigo-500">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Most Popular
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative space-y-6 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-ink dark:text-ink-inverted">Pro</h3>
                        <div className="mt-1">
                          <span className="text-3xl font-bold text-ink dark:text-ink-inverted">$750</span>
                          <span className="text-sm font-medium text-ink-muted dark:text-ink-accent/70">/one-time</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-ink-soft dark:text-ink-accent leading-relaxed">
                      Best for growing businesses that need more features
                    </p>
                    <ul className="space-y-3.5 text-sm text-ink-soft dark:text-ink-accent">
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Up to 10 pages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Everything in Basic</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Online booking/scheduling</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Image gallery</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Advanced SEO optimization</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Social media integration</span>
                      </li>
                    </ul>
                    <a
                      href="#contact"
                      className="mt-8 block w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5 dark:shadow-blue-500/30"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
                <div className="group relative rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-50/50 via-white to-indigo-50/30 p-8 shadow-lg shadow-slate-200/50 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-surface-outline/60 dark:from-surface-muted/50 dark:via-surface-elevated/90 dark:to-indigo-950/30 dark:shadow-card-dark dark:hover:shadow-indigo-500/20">
                  <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-700 text-white shadow-lg shadow-indigo-500/30">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-ink dark:text-ink-inverted">Advanced</h3>
                        <div className="mt-1">
                          <span className="text-3xl font-bold text-ink dark:text-ink-inverted">$1,500</span>
                          <span className="text-sm font-medium text-ink-muted dark:text-ink-accent/70">/one-time</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-ink-soft dark:text-ink-accent leading-relaxed">
                      For businesses ready to scale with e-commerce and custom features
                    </p>
                    <ul className="space-y-3.5 text-sm text-ink-soft dark:text-ink-accent">
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Unlimited pages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Everything in Pro</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">E-commerce/online store</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Custom functionality</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Payment processing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Customer portal/login</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Priority support</span>
                      </li>
                    </ul>
                    <a
                      href="#contact"
                      className="mt-8 block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-slate-700 px-6 py-3 text-center text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 dark:shadow-indigo-500/20"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section id="portfolio" className="space-y-12">
              <div className="text-center space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-indigo-600 shadow-sm dark:from-indigo-950/30 dark:to-blue-950/30 dark:text-indigo-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Portfolio
                </span>
                <h2 className="text-4xl font-bold tracking-tight text-ink dark:text-ink-inverted sm:text-5xl">
                  Stunning websites that
                  <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-slate-300">
                    drive results
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-ink-soft dark:text-ink-accent">
                  See how we&apos;ve helped Montana businesses modernize their online presence 
                  with fast, beautiful websites that bring in customers.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {portfolioItems.map((item) => (
                  <article
                    key={item.id}
                    className="group relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-white/50 shadow-xl shadow-slate-200/50 backdrop-blur-lg transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/20 dark:border-surface-outline/60 dark:bg-surface-elevated/50 dark:shadow-card-dark dark:hover:shadow-blue-500/30"
                    aria-label={`${item.businessName} - ${item.industry} website portfolio item`}
                  >
                    <div
                      className={`relative flex h-full min-h-[520px] flex-col overflow-hidden bg-gradient-to-br ${item.gradientFrom} ${item.gradientVia} ${item.gradientTo} ${item.darkGradientFrom} ${item.darkGradientVia} ${item.darkGradientTo} p-10 text-white transition-all duration-700 group-hover:scale-[1.03]`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/5 to-transparent dark:from-black/30 dark:via-black/10" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-8 flex items-start justify-between gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full ${item.industryColor} px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl backdrop-blur-sm`}
                          >
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {item.industry}
                          </span>
                          <span className="rounded-full bg-white/25 px-4 py-2 text-xs font-bold backdrop-blur-md shadow-lg border border-white/30">
                            {item.metric}
                          </span>
                        </div>
                        <div className="mb-8 flex-1 space-y-4">
                          <div>
                            <h3 className="text-3xl font-bold leading-tight tracking-tight">
                              {item.businessName}
                            </h3>
                            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-white/90">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {item.location}
                            </p>
                          </div>
                          <p className="text-base leading-relaxed text-white/95 font-medium">
                            {item.description}
                          </p>
                        </div>
                        <div className="space-y-4 border-t border-white/30 pt-6">
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                            Key Features
                          </p>
                          <ul className="grid grid-cols-2 gap-3">
                            {item.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2.5 text-sm font-semibold text-white/95"
                              >
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                  <svg
                                    className="h-3 w-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    aria-hidden="true"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-8 flex items-center justify-between border-t border-white/30 pt-6">
                          <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/90">
                            View Website
                          </span>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/15 blur-3xl transition-all duration-700 group-hover:opacity-60 group-hover:scale-150" />
                      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/15 blur-2xl transition-all duration-700 group-hover:opacity-60 group-hover:scale-150" />
                      <div className="absolute top-1/2 right-0 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all duration-700 group-hover:opacity-40 group-hover:translate-x-4" />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="contact"
              className="rounded-[32px] border border-white/80 bg-white/85 p-10 shadow-card backdrop-blur-lg dark:border-surface-outline dark:bg-surface-elevated/70 dark:shadow-card-dark"
            >
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
                <div className="space-y-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:bg-surface-muted/70 dark:text-ink-accent/90">
                    Contact
                    <span className="inline-flex h-2 w-2 rounded-full bg-brand-light" />
                  </span>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-semibold text-ink dark:text-ink-inverted sm:text-4xl">
                      Ready to modernize your online presence?
                    </h2>
                    <p className="max-w-lg text-base text-ink-soft dark:text-ink-accent">
                      Let&apos;s chat about how we can help your Montana business get a fast, 
                      AI-powered website that brings in customers. Share your business details 
                      and we&apos;ll respond within one business day with a custom quote.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <a
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-left text-ink transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 dark:border-surface-outline dark:bg-surface-muted/70 dark:text-ink-inverted dark:hover:border-brand.light"
                      href="tel:+15555550123"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 dark:bg-brand.light/10 dark:text-brand.light">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="h-5 w-5"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5A2.25 2.25 0 0 0 21 19.5v-2.651a2.25 2.25 0 0 0-1.743-2.183l-3.5-.778a2.25 2.25 0 0 0-2.139.655l-.97.97a11.048 11.048 0 0 1-4.943-4.943l.97-.97a2.25 2.25 0 0 0 .655-2.139l-.778-3.5A2.25 2.25 0 0 0 7.151 3H4.5A2.25 2.25 0 0 0 2.25 5.25v1.5Z"
                          />
                        </svg>
                      </span>
      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-ink-accent/80">
                          Phone
                        </p>
                        <p className="mt-1 text-base font-medium">+1 (555) 555-0123</p>
                      </div>
                    </a>
                    <a
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-left text-ink transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 dark:border-surface-outline dark:bg-surface-muted/70 dark:text-ink-inverted dark:hover:border-brand.light"
                      href="mailto:hello@codydesigns.com"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 dark:bg-brand.glow/10 dark:text-brand.light">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="h-5 w-5"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21.75 6.75-9 6.75-9-6.75m18 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m18 0v10.5a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 17.25V6.75"
                          />
                        </svg>
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-ink-accent/80">
                          Email
                        </p>
                        <p className="mt-1 text-base font-medium">hello@codydesigns.com</p>
                      </div>
        </a>
      </div>
                </div>
                <form
                  onSubmit={handleContactSubmit}
                  noValidate
                  className="grid gap-6 rounded-[28px] border border-white/60 bg-white/90 p-8 text-ink shadow-inner dark:border-surface-outline/70 dark:bg-surface-muted/70 dark:text-ink-inverted"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-ink dark:text-ink-inverted">Get Your Website</h3>
                    <p className="text-sm text-ink-soft dark:text-ink-accent">
                      Tell us about your business and which package interests you. We&apos;ll get back to you with a custom quote.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      Name
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        placeholder="Jane Doe"
                        aria-invalid={fieldErrors.name ? true : undefined}
                        aria-describedby="contact-name-helper"
                        className={`${INPUT_BASE_CLASSES} ${fieldErrors.name ? ERROR_INPUT_CLASSES : ""}`}
                      />
                      <span
                        id="contact-name-helper"
                        className={`block min-h-[1rem] text-xs font-semibold text-red-500 transition-opacity duration-150 ${
                          fieldErrors.name ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Please let me know who I&apos;m speaking with.
                      </span>
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Email
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="you@company.com"
                        aria-invalid={fieldErrors.email ? true : undefined}
                        aria-describedby="contact-email-helper"
                        className={`${INPUT_BASE_CLASSES} ${fieldErrors.email ? ERROR_INPUT_CLASSES : ""}`}
                      />
                      <span
                        id="contact-email-helper"
                        className={`block min-h-[1rem] text-xs font-semibold text-red-500 transition-opacity duration-150 ${
                          fieldErrors.email ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Use a business or personal email so I can follow up quickly.
                      </span>
                    </label>
                  </div>
                  <label className="grid gap-2 text-sm font-medium">
                    Project details
                    <textarea
                      name="message"
                      rows={5}
                        placeholder="Tell us about your business, which package you're interested in, and any questions you have."
                      required
                      aria-invalid={fieldErrors.message ? true : undefined}
                      aria-describedby="contact-message-helper"
                      className={`${TEXTAREA_BASE_CLASSES} h-36 md:h-40 ${
                        fieldErrors.message ? ERROR_INPUT_CLASSES : ""
                      }`}
                    />
                    <span
                      id="contact-message-helper"
                      className={`block min-h-[1rem] text-xs font-semibold text-red-500 transition-opacity duration-150 ${
                        fieldErrors.message ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      A quick summary of your product vision helps me prepare the best response.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
                  >
                    {isSubmitting ? "Sending…" : "Send Message"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="ml-2 h-5 w-5"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
        </button>
                  <div
                    role="status"
                    aria-live="polite"
                    className={`min-h-[1.5rem] text-sm font-medium ${
                      formStatus === "success"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : formStatus === "error"
                          ? "text-red-500 dark:text-red-400"
                          : "text-transparent"
                    }`}
                  >
                    {formStatus === "success"
                      ? "Thanks for your interest! We'll get back to you within one business day with a custom quote for your Montana business."
                      : formStatus === "error"
                        ? "Please double-check the highlighted fields and try again."
                        : ""}
                  </div>
                </form>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

