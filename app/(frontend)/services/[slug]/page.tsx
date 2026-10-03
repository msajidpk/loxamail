import { notFound } from "next/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { getService, services } from "@/content/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="overflow-hidden">
        <section className="bg-[#f7f9fc]">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 lg:px-10 lg:pb-28 lg:pt-24">
            <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">
                  {service.eyebrow}
                </p>

                <h1 className="mt-5 max-w-4xl text-[clamp(3.2rem,6.5vw,6.3rem)] font-semibold leading-[.93] tracking-[-0.06em] text-slate-950">
                  {service.title}
                  <br />
                  <span className="text-blue-600">{service.highlight}</span>
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                  {service.description}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/contact"
                    className="rounded-full bg-slate-950 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    Get Started <span className="ml-2">→</span>
                  </a>

                  <a
                    href="#details"
                    className="rounded-full border border-slate-300 bg-white px-7 py-4 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-950"
                  >
                    Explore the service
                  </a>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-blue-200/60 blur-3xl" />
                <div className="absolute -bottom-10 left-0 h-44 w-44 rounded-full bg-violet-200/50 blur-3xl" />

                <div className="relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_30px_80px_-30px_rgba(15,23,42,.25)]">
                  <div className="rounded-[1.5rem] bg-slate-950 p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">LoxaMail</p>
                        <p className="mt-1 text-xs text-slate-400">{service.eyebrow}</p>
                      </div>

                      <span className="rounded-full bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                        Managed
                      </span>
                    </div>

                    <div className="mt-9 rounded-2xl border border-white/10 bg-white/[.06] p-5">
                      <p className="text-xs uppercase tracking-[.14em] text-slate-500">
                        Service
                      </p>

                      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                        {service.navLabel}
                      </p>

                      <div className="mt-6 space-y-3">
                        {service.features.map((feature) => (
                          <div
                            key={feature.number}
                            className="flex items-center gap-3 rounded-xl bg-white/[.05] px-4 py-3"
                          >
                            <span className="text-blue-300">✓</span>
                            <span className="text-sm text-slate-200">
                              {feature.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="details" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">
                  What we handle
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">
                  The technical work around your service.
                </h2>
              </div>

              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                {service.intro}
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.features.map((feature) => (
                <article
                  key={feature.number}
                  className="min-h-[290px] rounded-[1.75rem] border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <span className="text-sm font-semibold text-blue-600">
                    {feature.number}
                  </span>

                  <div className="mt-24">
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-300">
                  How it works
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] sm:text-6xl">
                  A clear path from setup to support.
                </h2>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[.05] p-4 sm:p-6">
                {service.process.map((step, index) => (
                  <div
                    key={step.number}
                    className={`grid gap-4 p-5 sm:grid-cols-[60px_160px_1fr] ${
                      index !== 0 ? "border-t border-white/10" : ""
                    }`}
                  >
                    <span className="text-sm font-bold text-blue-300">
                      {step.number}
                    </span>

                    <h3 className="font-semibold text-white">{step.title}</h3>

                    <p className="text-sm leading-6 text-slate-400">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eef4ff]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">
                  Who it is for
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">
                  Built for businesses that need things handled.
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {service.audience.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-blue-100 bg-white p-6"
                  >
                    <span className="text-blue-600">✓</span>
                    <p className="mt-5 font-medium leading-6 text-slate-900">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f7f5]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">
                Get started
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-6xl">
                {service.ctaTitle}
              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                {service.ctaText}
              </p>

              <a
                href="/contact"
                className="mt-9 inline-flex rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Get Started <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
