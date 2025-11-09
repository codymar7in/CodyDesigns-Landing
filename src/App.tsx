import { useEffect, useState } from "react";

type Project = {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  textClass: string;
  subtitleClass: string;
  ctaClass: string;
  darkTheme: string;
  darkTextClass: string;
  darkSubtitleClass: string;
  darkCtaClass: string;
  cta: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Design, Build & Deploy",
    subtitle: "Mission Control for modern SaaS teams",
    theme: "from-slate-900 via-slate-800 to-slate-900",
    textClass: "text-slate-100",
    subtitleClass: "text-white/70",
    ctaClass: "bg-white/10 text-white hover:bg-white/20",
    darkTheme: "dark:from-surface-elevated dark:via-slate-950 dark:to-black",
    darkTextClass: "dark:text-white",
    darkSubtitleClass: "dark:text-ink-accent",
    darkCtaClass: "dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
    cta: "Preview",
  },
  {
    id: 2,
    title: "Aligned Growth",
    subtitle: "Faster launch cycles for product ops",
    theme: "from-white via-sky-50 to-blue-100",
    textClass: "text-slate-900",
    subtitleClass: "text-slate-600",
    ctaClass: "bg-slate-900/5 text-slate-900 hover:bg-slate-900/10",
    darkTheme:
      "dark:from-[#26345a] dark:via-[#1a2543] dark:to-[#0f172a]",
    darkTextClass: "dark:text-white",
    darkSubtitleClass: "dark:text-ink-accent",
    darkCtaClass: "dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
    cta: "View Case",
  },
  {
    id: 3,
    title: "Launch Opportunities",
    subtitle: "Personal branding for founders",
    theme: "from-slate-950 via-slate-900 to-black",
    textClass: "text-slate-100",
    subtitleClass: "text-white/70",
    ctaClass: "bg-white/10 text-white hover:bg-white/20",
    darkTheme:
      "dark:from-[#0f172a] dark:via-[#070d19] dark:to-black",
    darkTextClass: "dark:text-white",
    darkSubtitleClass: "dark:text-ink-accent",
    darkCtaClass: "dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
    cta: "Explore",
  },
];

const THEME_STORAGE_KEY = "codydesigns-theme";

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

  return (
    <div className="min-h-screen bg-surface-subtle text-ink dark:bg-surface-base dark:text-ink-inverted">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-hero-grid opacity-60 dark:hidden mask-fade-bottom" />
        <div className="pointer-events-none absolute inset-0 hidden bg-hero-grid-dark opacity-80 dark:block mask-fade-bottom" />
        <div className="pointer-events-none absolute inset-0 bg-dotted mask-fade-bottom" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-24 pt-12 md:px-10 lg:px-16">
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
                  Digital Studio
                </p>
              </div>
            </div>

            <nav className="flex flex-1 justify-center">
              <ul className="flex flex-wrap items-center gap-10 text-sm font-medium text-ink-soft dark:text-ink-accent md:text-base">
                <li>
                  <a
                    className="transition-colors hover:text-ink dark:hover:text-white"
                    href="#work"
                  >
                    Previous Work
                  </a>
                </li>
                <li>
                  <a
                    className="transition-colors hover:text-ink dark:hover:text-white"
                    href="#services"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    className="transition-colors hover:text-ink dark:hover:text-white"
                    href="#contact"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <button
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
                Contact Me
              </a>
            </div>
          </header>

          <main className="flex flex-1 flex-col justify-center">
            <section className="mt-16 grid gap-12 text-center md:mt-20 lg:grid-cols-[minmax(0,1fr)]">
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-slate-500 shadow-sm backdrop-blur dark:border-surface-outline dark:bg-surface-elevated/60 dark:text-ink-accent dark:shadow-card-dark/20">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  Available For Projects
                </div>
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-ink dark:text-ink-inverted sm:text-5xl lg:text-6xl">
                  Processional Designs
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-900 bg-clip-text text-transparent dark:from-brand.light dark:via-brand.glow dark:to-white/80">
                    For Digital Products
                  </span>
                </h1>
                <p className="mt-6 text-base text-ink-soft dark:text-ink-accent sm:text-lg">
                  CodyDesigns crafts digital experiences that not only look beautiful,
                  but also move metrics. We partner with SaaS teams to launch quickly,
                  iterate intelligently, and scale brands with intention.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <a
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    href="#contact"
                  >
                    Contact Me
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="ml-2 h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </a>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-medium text-ink shadow-sm shadow-slate-500/10 dark:bg-surface-elevated/60 dark:text-ink-accent dark:shadow-card-dark/20">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Say Hello!
                  </span>
                </div>
              </div>
              <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-3">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="group relative rounded-[32px] border border-white/60 bg-white/40 p-3 shadow-card backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-surface-outline/50 dark:bg-surface-elevated/40 dark:shadow-card-dark dark:hover:shadow-card-dark"
                  >
                    <div
                      className={`flex h-full flex-col overflow-hidden rounded-[24px] bg-gradient-to-br px-8 py-10 ${project.theme} ${project.textClass} ${project.darkTheme} ${project.darkTextClass}`}
                    >
                      <div className="flex-1 space-y-4 text-left text-inherit">
                        <h3 className="text-2xl font-semibold leading-snug text-inherit">
                          {project.title}
                        </h3>
                        <p
                          className={`text-sm md:text-base ${project.subtitleClass} ${project.darkSubtitleClass}`}
                        >
                          {project.subtitle}
                        </p>
                      </div>
                      <button
                        className={`mt-10 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${project.ctaClass} ${project.darkCtaClass}`}
                      >
                        {project.cta}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="contact"
              className="mt-20 rounded-[32px] border border-white/80 bg-white/85 p-10 shadow-card backdrop-blur-lg dark:border-surface-outline dark:bg-surface-elevated/70 dark:shadow-card-dark"
            >
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
                <div className="space-y-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:bg-surface-muted/70 dark:text-ink-accent/90">
                    Contact
                    <span className="inline-flex h-2 w-2 rounded-full bg-brand-light" />
                  </span>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-semibold text-ink dark:text-ink-inverted sm:text-4xl">
                      Ready to collaborate? Let&apos;s talk.
                    </h2>
                    <p className="max-w-lg text-base text-ink-soft dark:text-ink-accent">
                      CodyDesigns partners with product teams to launch meaningful, revenue-driving
                      experiences. Reach out directly or share a few details and we&apos;ll respond within
                      one business day.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <a
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-left text-ink transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 dark:border-surface-outline dark:bg-surface-muted/70 dark:text-ink-inverted dark:hover:border-brand.light"
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
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-left text-ink transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 dark:border-surface-outline dark:bg-surface-muted/70 dark:text-ink-inverted dark:hover:border-brand.light"
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
                  className="grid gap-5 rounded-[28px] border border-white/60 bg-white/90 p-8 text-ink shadow-inner dark:border-surface-outline/70 dark:bg-surface-muted/70 dark:text-ink-inverted"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-ink dark:text-ink-inverted">Get In Touch</h3>
                    <p className="text-sm text-ink-soft dark:text-ink-accent">
                      Tell us a little about your project and we&apos;ll reach back out shortly.
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
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-ink placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-white dark:border-surface-outline dark:bg-surface-elevated/80 dark:text-ink-inverted dark:placeholder:text-ink-accent/70 dark:focus:ring-offset-surface-base"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Email
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="you@company.com"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-ink placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-white dark:border-surface-outline dark:bg-surface-elevated/80 dark:text-ink-inverted dark:placeholder:text-ink-accent/70 dark:focus:ring-offset-surface-base"
                      />
                    </label>
                  </div>
                  <label className="grid gap-2 text-sm font-medium">
                    Project details
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Share your goals, timeline, or anything else that helps us prepare."
                      className="resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-ink placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-white dark:border-surface-outline dark:bg-surface-elevated/80 dark:text-ink-inverted dark:placeholder:text-ink-accent/70 dark:focus:ring-offset-surface-base"
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Send Message
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="ml-2 h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
        </button>
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
