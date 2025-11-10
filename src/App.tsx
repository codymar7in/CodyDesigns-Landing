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

            <section id="packages" className="space-y-10">
              <div className="text-center space-y-4">
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-ink-accent/80">
                  Website Packages
                </span>
                <h2 className="text-3xl font-semibold text-ink dark:text-ink-inverted sm:text-4xl">
                  Choose the perfect package for your business
                </h2>
                <p className="mx-auto max-w-2xl text-base text-ink-soft dark:text-ink-accent">
                  All packages include fast, AI-powered websites that are mobile-friendly, 
                  SEO-optimized, and designed to bring in customers.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-[32px] border border-white/80 bg-white/85 p-8 shadow-card backdrop-blur-lg dark:border-surface-outline dark:bg-surface-elevated/70 dark:shadow-card-dark">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-ink dark:text-ink-inverted">Basic</h3>
                      <span className="text-3xl font-bold text-ink dark:text-ink-inverted">$300</span>
                    </div>
                    <p className="text-sm text-ink-soft dark:text-ink-accent">
                      Perfect for small businesses getting started online
                    </p>
                    <ul className="space-y-3 text-sm text-ink-soft dark:text-ink-accent">
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Up to 5 pages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Mobile-responsive design</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Contact form</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Basic SEO optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Fast loading times</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-[32px] border-2 border-blue-500 bg-white/90 p-8 shadow-card backdrop-blur-lg dark:border-brand-light dark:bg-surface-elevated/80 dark:shadow-card-dark relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-ink dark:text-ink-inverted">Pro</h3>
                      <span className="text-3xl font-bold text-ink dark:text-ink-inverted">$750</span>
                    </div>
                    <p className="text-sm text-ink-soft dark:text-ink-accent">
                      Best for growing businesses that need more features
                    </p>
                    <ul className="space-y-3 text-sm text-ink-soft dark:text-ink-accent">
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Up to 10 pages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Everything in Basic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Online booking/scheduling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Image gallery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Advanced SEO optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Social media integration</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-[32px] border border-white/80 bg-white/85 p-8 shadow-card backdrop-blur-lg dark:border-surface-outline dark:bg-surface-elevated/70 dark:shadow-card-dark">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-ink dark:text-ink-inverted">Advanced</h3>
                      <span className="text-3xl font-bold text-ink dark:text-ink-inverted">$1,500</span>
                    </div>
                    <p className="text-sm text-ink-soft dark:text-ink-accent">
                      For businesses ready to scale with e-commerce and custom features
                    </p>
                    <ul className="space-y-3 text-sm text-ink-soft dark:text-ink-accent">
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Unlimited pages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Everything in Pro</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>E-commerce/online store</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Custom functionality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Payment processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Customer portal/login</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Priority support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="portfolio" className="space-y-10">
              <div className="text-center space-y-4">
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-ink-accent/80">
                  Portfolio
                </span>
                <h2 className="text-3xl font-semibold text-ink dark:text-ink-inverted sm:text-4xl">
                  Stunning websites that drive results
                </h2>
                <p className="mx-auto max-w-2xl text-base text-ink-soft dark:text-ink-accent">
                  See how we&apos;ve helped Montana businesses modernize their online presence 
                  with fast, beautiful websites that bring in customers.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {portfolioItems.map((item) => (
                  <article
                    key={item.id}
                    className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/45 shadow-card backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-surface-outline/60 dark:bg-surface-elevated/45 dark:shadow-card-dark dark:hover:shadow-card-dark"
                    aria-label={`${item.businessName} - ${item.industry} website portfolio item`}
                  >
                    <div
                      className={`relative flex h-full min-h-[480px] flex-col overflow-hidden bg-gradient-to-br ${item.gradientFrom} ${item.gradientVia} ${item.gradientTo} ${item.darkGradientFrom} ${item.darkGradientVia} ${item.darkGradientTo} p-8 text-white transition-transform duration-500 group-hover:scale-[1.02]`}
                    >
                      <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-6 flex items-start justify-between">
                          <span
                            className={`inline-flex items-center rounded-full ${item.industryColor} px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg`}
                          >
                            {item.industry}
                          </span>
                          <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                            {item.metric}
                          </span>
                        </div>
                        <div className="mb-6 flex-1 space-y-3">
                          <div>
                            <h3 className="text-2xl font-bold leading-tight">
                              {item.businessName}
                            </h3>
                            <p className="mt-1 text-sm font-medium text-white/80">
                              {item.location}
                            </p>
                          </div>
                          <p className="text-sm leading-relaxed text-white/90">
                            {item.description}
                          </p>
                        </div>
                        <div className="space-y-3 border-t border-white/20 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            Key Features
                          </p>
                          <ul className="grid grid-cols-2 gap-2">
                            {item.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-xs font-medium text-white/90"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0 text-white/80"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            View Website
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
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
                      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-opacity duration-500 group-hover:opacity-50" />
                      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10 blur-xl transition-opacity duration-500 group-hover:opacity-50" />
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
