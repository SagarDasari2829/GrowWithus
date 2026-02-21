import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    title: "Role-Based Learning Paths",
    description:
      "Follow structured IT roadmaps mapped to real job outcomes, milestones, and practical project goals.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Progress Intelligence",
    description:
      "Track module completion, identify gaps early, and maintain momentum with measurable weekly progress.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 20V10m8 10V4m8 16v-7" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Career Outcome Focus",
    description:
      "Build portfolio-ready skills with guided sequencing designed for internships and full-time IT roles.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18m9-9H3" strokeLinecap="round" />
      </svg>
    )
  }
];

const roadmapPreviews = [
  { title: "Frontend Engineering", level: "Beginner to Intermediate", modules: "24 modules", time: "4-6 months" },
  { title: "Backend Engineering", level: "Intermediate", modules: "28 modules", time: "5-7 months" },
  { title: "DevOps Foundations", level: "Intermediate to Advanced", modules: "20 modules", time: "4-5 months" }
];

const stats = [
  { label: "Learners Onboarded", value: "10,000+" },
  { label: "Roadmap Modules", value: "250+" },
  { label: "Weekly Completions", value: "35K+" },
  { label: "Career Tracks", value: "20+" }
];

const testimonials = [
  {
    quote: "GrowWithUS removed the guesswork and gave me a clear system to build my IT career.",
    name: "Nitin Dasari",
    role: "Final-Year Student"
  },
  {
    quote: "The roadmap flow is practical and professional. I could focus on execution, not confusion.",
    name: "Vinayak Yemul",
    role: "Final-Year Student"
  },
  {
    quote: "I finally had structure, weekly momentum, and confidence during placement preparation.",
    name: "Aarav M.",
    role: "Junior Software Engineer"
  }
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-200/30 to-blue-200/30 blur-3xl" />

      <main>
        <section className="relative py-20 sm:py-24">
          <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-6 lg:grid-cols-2">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">
                Premium IT Career Roadmaps
              </p>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Build an IT Career with a
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> Clear, Modern System</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                GrowWithUS helps students and aspiring professionals choose the right path, master the right skills, and track progress from day one to placement.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Free"}
                </Link>
                <Link
                  to={isAuthenticated ? ROUTES.ROADMAPS : ROUTES.LOGIN}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-xl"
                >
                  View Roadmaps
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Weekly Progress</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">+18%</span>
              </div>

              <div className="space-y-5">
                {[
                  { label: "Frontend Fundamentals", value: 82 },
                  { label: "Backend APIs", value: 65 },
                  { label: "Cloud Basics", value: 48 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="font-medium text-slate-500">{item.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why Learners Choose GrowWithUS</h2>
            <p className="mt-4 text-slate-600">A modern, structured platform for building practical IT skills with confidence.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex rounded-lg bg-indigo-50 p-2 text-indigo-700 ring-1 ring-indigo-100">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="roadmaps" className="border-y border-slate-200/70 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto w-full max-w-7xl px-6 py-20">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Roadmap Previews</h2>
                <p className="mt-3 text-slate-600">Explore career-focused learning tracks built for high-demand IT roles.</p>
              </div>

              <Link
                to={isAuthenticated ? ROUTES.ROADMAPS : ROUTES.LOGIN}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-400 hover:bg-slate-100"
              >
                View All
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {roadmapPreviews.map((roadmap) => (
                <article
                  key={roadmap.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{roadmap.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{roadmap.level}</p>

                  <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
                    <span>{roadmap.modules}</span>
                    <span>{roadmap.time}</span>
                  </div>

                  <Link
                    to={isAuthenticated ? ROUTES.ROADMAPS : ROUTES.REGISTER}
                    className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl"
                  >
                    Open Path
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="stats" className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Trusted at Scale</h2>
            <p className="mt-4 text-slate-600">A fast-growing platform helping learners build consistent IT careers.</p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <p className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonials" className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Trusted by Future IT Professionals</h2>
            <p className="mt-4 text-slate-600">Real learner feedback from students and early-career professionals.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure
                key={item.name}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <blockquote className="text-sm leading-relaxed text-slate-700">"{item.quote}"</blockquote>
                <figcaption className="mt-6">
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/90">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <p>(c) {new Date().getFullYear()} GrowWithUS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#features" className="transition-all duration-300 hover:text-slate-700">Features</a>
            <a href="#roadmaps" className="transition-all duration-300 hover:text-slate-700">Roadmaps</a>
            <a href="#stats" className="transition-all duration-300 hover:text-slate-700">Trust</a>
            <a href="#testimonials" className="transition-all duration-300 hover:text-slate-700">Testimonials</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
